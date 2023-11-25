const exec = require('child_process').exec;

function shutdown() {
    exec("sudo shutdown now");
}

function reboot() {
    exec("sudo shutdown -r now");
}

function displayOn() {
    // exec("vcgencmd display_power 1"); // would be nice if this would work, but it does not
    // it doesn't work if the off command has been invoked a long time ago
    reboot()
}

function displayOff() {
    exec("killall -q -KILL fbi; vcgencmd display_power 0");
}

module.exports = {
    shutdown,
    reboot,
    displayOn,
    displayOff,
}
