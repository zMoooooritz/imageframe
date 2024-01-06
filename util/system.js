const exec = require('child_process').exec;

function shutdown() {
    exec("sudo shutdown now");
}

function reboot() {
    exec("sudo shutdown -r now");
}

function displayOn() {
    exec("vcgencmd display_power 1");
}

function displayOff() {
    exec("vcgencmd display_power 0");
}

module.exports = {
    shutdown,
    reboot,
    displayOn,
    displayOff,
}
