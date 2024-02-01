const exec = require('child_process').exec;

function shutdown() {
    execute("sudo shutdown now");
}

function reboot() {
    execute("sudo shutdown -r now");
}

function displayOn() {
    execute("vcgencmd display_power 1");
}

function displayOff() {
    execute("vcgencmd display_power 0");
}

function execute(command) {
    if (process.env.NODE_ENV === "development") {
        console.log(command);
    } else {
        exec(command);
    }
}

module.exports = {
    shutdown,
    reboot,
    displayOn,
    displayOff,
}
