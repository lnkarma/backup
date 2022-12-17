const { simpleGit } = require("simple-git");

const git = simpleGit("/home/lokenath/Documents/work/backup/ms3-ta-frontend");

// git.pull({}, (err, data) => {
//   console.log({ err, data });
// });

const USER = "arindam.chakraborty@indusnet.co.in";
// const PASSWORD = "ATBBFJe9JRSGEVQZpv3XuneKGmek14C337BC";
const PASSWORD = "IntArindam2022";
const main = async () => {
  //   const remotes = await git.getRemotes(true);
  //   if (remotes.length) {
  //     // Otherwise it's a local repository, no push
  //     let remote = remotes[0].name;
  //     console.log(remotes[0].refs);
  //     const pushRemote = remotes[0].refs.push;
  //     if (remotes[0].refs.push.indexOf("@") < 0) {
  //       // credentials aren't in the remote ref
  //       remote = remotes[0].refs.push.replace("://", `://${USER}:${PASSWORD}@`);
  //     } else {
  //       const [left, right] = pushRemote.split("@");
  //       remote = `${left}:${PASSWORD}@${right}`;
  //     }
  //     console.log({ remote });
  //     const pushRes = await git.pull(remote);
  //   }
  const pullRes = await git.pull();
  console.log({ pullRes });
};

main();
