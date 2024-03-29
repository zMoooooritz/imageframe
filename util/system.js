const exec = require('child_process').exec;
const path = require('path');
const config = require('./config');

class System {
    static shutdown() {
        execute("sudo shutdown now");
    }

    static reboot() {
        execute("sudo shutdown -r now");
    }

    static displayOn() {
        execute("vcgencmd display_power 1");
    }

    static displayOff() {
        execute("vcgencmd display_power 0");
    }

    static startSlideshow(options) {
        execute(`fbi -nointeractive -a -T 1 -cachemem 100 ${options}`);
    }

    static stopSlideshow() {
        execute(`killall -q -KILL fbi`);
    }

    static update() {
        execute(path.join(config.getScriptPath(), "update.sh") + " software");
    }
}

function execute(command) {
    if (process.env.NODE_ENV === "development") {
        console.log(command);
    } else {
        exec(command);
    }
}

module.exports = System