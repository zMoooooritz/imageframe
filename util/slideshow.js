const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const config = require('./config');
const storage = require('./storage');
const kvstore = require('./kvstore');

class Slideshow {

    constructor() {
        this.isActive = false;
    }

    restart() {
        this.stop();
        this.start();
    }

    start() {
        this.isActive = true;

        const slideRandom = kvstore.getDefault("slide_random", true);
        const slideTime = kvstore.getDefault("slide_time", 30);
        const slideBlend = kvstore.getDefault("slide_blend", 200);
        const slideNames = kvstore.getDefault("slide_names", false);
        const slideDirs = kvstore.getDefault("slide_dirs", []);
        buildConfigFile(slideDirs);

        var options = "";
        options += slideRandom ? "-random " : "-norandom ";
        options += `-timeout ${slideTime} `;
        options += `-blend ${slideBlend} `;
        options += slideNames ? "-verbose " : "-noverbose ";
        options += `-list ${config.getImageListFilePath()}`;

        exec(`fbi -nointeractive -a -T 1 -cachemem 100 ${options} > /dev/null 2>&1 &`);
    }

    stop() {
        this.isActive = false;

        exec(`killall -q -KILL fbi`);
    }

}
function buildConfigFile(directories) {
    data = "";
    directories.forEach((directory) => {
        const images = storage.listImages(directory);
        images.forEach((image) => {
            const imgPath = path.join(config.getContainersPath(), directory, image);
            data += imgPath + "\n";
        });
    });
    fs.writeFileSync(config.getImageListFilePath(), data);
}

const slideshow = new Slideshow();
module.exports = slideshow;
