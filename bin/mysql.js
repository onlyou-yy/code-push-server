const { spawn } = require("child_process");

function runShell(shellString) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve("SUCCESS");
    }, 3000);
    const shell = createSpawn(shellString);
    let output = "";
    shell.stdin.setEncoding("utf-8");
    // shell.stdout.pipe(process.stdout);

    shell.stdout.on("data", async (data) => {
      output += data.toString();
    });

    shell.stderr.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    shell.on("close", (code) => {
      clearTimeout(timer);
      resolve(output);
    });
  });
}
function createSpawn(shellString) {
  let [cmdName, ...args] = shellString.split(" ");
  return spawn(cmdName, args);
}

(async function () {
  const startShell = "mysql.server start";
  const stopShell = "mysql.server stop";
  const statusShell = "mysql.server status";
  const status = await runShell(statusShell);
  if (status.includes("SUCCESS")) {
    console.log("MySQL服务已启动");
  } else {
    await runShell(startShell);
    const status = await runShell(statusShell);
    if (status.includes("SUCCESS")) {
      console.log("MySQL服务已启动");
    } else {
      console.log("MySQL服务启动失败");
    }
  }
})();
