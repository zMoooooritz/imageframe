const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const config = require('./config');
const storage = require('./storage');
const system = require('./system');

class Slideshow extends EventEmitter {

    constructor() {
        super();
        this.isActive = false;
        this.status = {};

        this.startStatusReader();
    }

    restart(cfg) {
        this.stop();
        this.start(cfg);
    }

    start(cfg) {
        this.isActive = true;
        this.emit('slideStateChange', this.getState());

        buildConfigFile(cfg.directories);

        var options = "";
        options += cfg.doRandom ? "-random " : "-norandom ";
        options += `-timeout ${cfg.timePerSlide} `;
        options += `-blend ${cfg.transitionTime} `;
        options += cfg.showNames ? "-verbose " : "-noverbose ";
        options += `-list ${config.getImageListFilePath()} `;
        options += `-status ${config.getFbiStatusPath()} `;
        options += `-commands ${config.getFbiCommandsPath()}`;

        setTimeout(function() {
            system.startSlideshow(options);
        }, 1000);
    }

    stop() {
        this.isActive = false;
        this.status = {};
        this.emit('slideStateChange', this.getState() );
        system.stopSlideshow();
    }

    startStatusReader() {
        const stream = fs.createReadStream(config.getFbiStatusPath(), { encoding: 'utf8' });

        let buffer = "";

        stream.on('data', (chunk) => {
            buffer += chunk;

            try {
                const status = JSON.parse(buffer);
                const statusChanged = JSON.stringify(this.status) !== JSON.stringify(status);
                this.status = status;
                
                if (statusChanged) {
                    this.emit('slideStateChange', this.getState());
                }
                
                buffer = "";
            } catch (e) {
                // Incomplete JSON received, waiting for more data
            }
        });

        stream.on('error', (err) => {
            setTimeout(() => this.startStatusReader(), 1000);
        });

        stream.on('end', () => {
            setTimeout(() => this.startStatusReader(), 1000);
        });
    }

    getState() {
        return { active: this.isActive, status: this.status };
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
