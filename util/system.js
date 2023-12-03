const exec = require('child_process').exec;
const slideshow = require('./slideshow');

function shutdown() {
    exec("sudo shutdown now");
}

function reboot() {
    exec("sudo shutdown -r now");
}

function displayOn() {
    // exec("vcgencmd display_power 1"); // would be nice if this would work
    // in case the displayOff command has been invoked a long time ago it unfortunately does not 
    // there is probably a proper fix instead of rebooting that I don't know of
    reboot()
}

function displayOff() {
    slideshow.stop();
    exec("vcgencmd display_power 0");
}

module.exports = {
    shutdown,
    reboot,
    displayOn,
    displayOff,
}
