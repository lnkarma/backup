const util = require("util");
const fs = require("fs-extra");
const { default: simpleGit, gitP } = require("simple-git");
const exec = util.promisify(require("child_process").exec);

const testDestination = "/home/lokenath/Documents/playground/backup";
const mainDestination = "/home/lokenath/Documents/work/backup/ms3-ta-frontend";
const dest = testDestination;
const projectList = [
  {
    name: "lineup-web-app",
    src: "/home/lokenath/Documents/work/techAlchemy/lineup/lineup-web-app",
    srcBranch: "development",
    dest: dest,
  },
  {
    name: "lineup-admin",
    src: "/home/lokenath/Documents/work/techAlchemy/lineup/lineup-admin",
    srcBranch: "dev",
    dest: dest,
  },
];

const backupProject = async (project) => {
  console.log("Backing up project...", project.name);
  const tempDir = `/home/lokenath/Documents/work/backup/temp`;
  const tempProjectDir = `${tempDir}/${project.name}`;

  console.log("ensuing temp directory exists: " + tempDir);
  fs.ensureDirSync(tempDir);

  console.log("checking if project exists in temp directory");
  if (fs.existsSync(tempProjectDir)) {
    console.log("\ttemp prject dir already exists");
    console.log("\tremoving temporary dir: " + tempProjectDir);
    fs.rmSync(tempProjectDir, { recursive: true });
  }

  console.log("cloning project to temp dir");
  await exec("cd " + tempDir + " && git clone " + project.src);

  console.log("Connecting to git in temp project directory");
  const srcTempGit = simpleGit(tempProjectDir);

  console.log(`checking out ${project.srcBranch} branch`);
  await srcTempGit.checkout(project.srcBranch);

  console.log("removing .git directory from temp project directory");
  fs.rmSync(`${tempProjectDir}/.git`, { recursive: true });

  console.log("Connecting to git in destination directory");
  const destGit = simpleGit(project.dest);

  console.log("fetching all branches from destination");
  await destGit.fetch(["--prune"]);

  try {
    console.log("try to checkout branch");
    await destGit.checkout(project.name);
  } catch (error) {
    console.log("\tbranch not found creating branch");
    await destGit.checkout(["-b", project.name]);
  }

  console.log(`pulling ${project.name} branch`);
  try {
    await destGit.pull(project.name);
  } catch (error) {
    console.log("\tbranch does not exist on remote");
    console.log("pushing the new branch");
    await destGit.push(["-u", "origin", project.name]);
  }

  console.log(
    "copying files from temp project directory to destination folder"
  );
  fs.copySync(tempProjectDir, project.dest + "/");

  console.log("checking if any changes were made since last backup");
  if (await (await destGit.status()).isClean()) {
    console.log("\tno changes were made");
    console.log("\texiting project");
    return;
  }

  console.log("changes were made");
  console.log("adding all changes");
  await destGit.add(".");

  console.log("commiting changes with timestamp");
  await destGit.commit(`backup taken on ${new Date().toLocaleString()}`, ".");

  console.log("pushing changes");
  try {
    await destGit.push("origin");
  } catch (error) {
    console.log("error pushing changes", error);
  }
};

const backupProjects = async (projects) => {
  for await (const project of projects) {
    await backupProject(project);
    console.log(
      "================================================================"
    );
  }
};

backupProjects(projectList);
