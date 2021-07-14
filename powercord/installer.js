const { execSync } = require("child_process");
const os = require("os");

let InfoLogger = (data) => console.log(`\x1b[30m\x1b[104m[ INFO ]\x1b[0m ${data}`);
let SuccessLogger = (data) => console.log(`\x1b[30m\x1b[102m[ SUCCESS ]\x1b[0m ${data}`);
let WarnLogger = (data) => console.log(`\x1b[30m\x1b[103m[ WARN ]\x1b[0m ${data}`);
let DangerLogger = (data) => console.log(`\x1b[30m\x1b[101m[ DANGER ]\x1b[0m ${data}`);

(async () => {
    InfoLogger("Checking NodeJS version...")
    let nodev = Number(await execSync("node --version").toString().slice(1).split(".")[0])
    if(nodev < 10) return DangerLogger(`The minimum version of NodeJS >= 10.x`)
    if(nodev < 14) WarnLogger(`The recommended version is NodeJS >= 14.x`)
    else SuccessLogger(`You meet the NodeJS requirements!`)

    InfoLogger("Checking git version...")
    let git = await execSync("git --version").toString().slice(12).split(".")[0]
    if(!parseInt(git) || parseInt(git) < 2) return DangerLogger(`The minimum version of git >= 2.x`)
    else SuccessLogger(`You meet the git requirements!`)

    InfoLogger("Downloading dependencies...")
    await execSync("npm i node-fetch prompts fs codemirror less node-watch sass stylus sucrase unzip-crx");

    const fs = require("fs")
    InfoLogger("Checking Discord Canary...")
    await fs.readdirSync(`${os.userInfo().homedir}/AppData/Local/DiscordCanarys`)
    SuccessLogger("Successfully detected Discord Canary!")

    InfoLogger("Downloading Powercord...")
    console.log("\x1b[90m-------------------------------------------------------------------------------------------\x1b[0m")
    await execSync(`git clone https://github.com/powercord-org/powercord`)
    console.log("\x1b[90m-------------------------------------------------------------------------------------------\x1b[0m")

    InfoLogger("Injecting powercord...")
    let r = await execSync(`node powercord/injectors/index.js inject --no-exit-codes`).toString()
    if(r.toLocaleLowerCase().startsWith("looks like you already")) {
        DangerLogger(`You've already injected the client.`)
        WarnLogger(`It's possible you have a betterdiscord. You may have injected the client only 1x.`)
        return;
    }
    SuccessLogger("Powercord has been injected!")
})();

process.on("warning", WarnLogger)
process.on("uncaughtException", (e) => {
    if(e.message.toLocaleLowerCase().startsWith("enoent: no such file or directory")) {
        DangerLogger(`You need to install Discord Canary.`)
        WarnLogger(`URL: https://discord.com/api/download/canary?platform=${os.version().startsWith("Windows") ? "win" : "linux"}`)
        if(!os.version().startsWith("Windows")) return InfoLogger(`tar.gz: https://discord.com/api/download/canary?platform=linux&format=tar.gz`)
        return;
    }
    DangerLogger(e)
    return;
})