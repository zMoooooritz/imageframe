const fs = require('fs');
const path = require('path');
const config = require('./config');
const storage = require('./storage');
const system = require('./system');

class Slideshow {

    constructor() {
        this.isActive = false;
    }

    async restart(cfg) {
        this.stop();
        this.start(cfg);
    }

    async start(cfg) {
        this.isActive = true;

        buildConfigFile(cfg.directories);

        var options = "";
        options += cfg.doRandom ? "-random " : "-norandom ";
        options += `-timeout ${cfg.timePerSlide} `;
        options += `-blend ${cfg.transitionTime} `;
        options += cfg.showNames ? "-verbose " : "-noverbose ";
        options += `-list ${config.getImageListFilePath()}`;

        setTimeout(function() {
            system.startSlideshow(options);
        }, 1000);
    }

    async stop() {
        this.isActive = false;

        system.stopSlideshow();
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
