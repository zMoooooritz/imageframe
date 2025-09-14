const { exec, execSync } = require('child_process');
const path = require('path');
const config = require('./config');
const https = require("https");
const deasync = require("deasync");

class System {
    static shutdown() {
        this.execute("sudo shutdown now");
    }

    static reboot() {
        this.execute("sudo shutdown -r now");
    }

    static restartSoftware() {
        this.execute("sudo systemctl restart imageframe");
    }

    static displayOn() {
        this.execute("vcgencmd display_power 1");
    }

    static displayOff() {
        this.execute("vcgencmd display_power 0");
    }

    static getInstalledVersion() {
        if (process.env.NODE_ENV === "development") {
            return "Local Build";
        } else {
            return execSync(
                "git describe --tags --abbrev=0",
                {
                    cwd: config.getProjectBasePath(),
                }
            ).toString()
        }
    }

    static getLatestVersion() {
        let done = false;
        let latestTag = "";

        https.get(`https://api.github.com/repos/${global.__owner}/${global.__repo}/tags`, {
            headers: { "User-Agent": "Node.js" },
        }, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                try {
                    const tags = JSON.parse(data);
                    latestTag = tags.length > 0 ? tags[0].name : "";
                } catch (error) {
                    latestTag = "";
                }
                done = true;
            });
        }).on("error", () => {
            latestTag = "";
            done = true;
        });

        deasync.loopWhile(() => !done); // Block execution until done
        return latestTag;
    }

    static update() {
        if (process.env.NODE_ENV === "development") {
            console.log(path.join(config.getScriptPath(), "update.sh"));
        } else {
            exec(
                path.join(config.getScriptPath(), "update.sh"),
                {
                    cwd: config.getProjectBasePath(),
                }
            )
        }
    }

    static execute(command) {
        if (process.env.NODE_ENV === "development") {
            console.log(command);
        } else {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(stderr);
                }
                console.log(stdout);
            });
        }
    }
}

module.exports = System