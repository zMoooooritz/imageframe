const fs = require('fs');
const constants = require('constants');
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

        this.#startStatusReader();
    }

    restart(cfg) {
        this.stop();
        this.start(cfg);
    }

    start(cfg) {
        this.isActive = true;
        this.emit('slideStateChange', this.getState());

        this.#buildConfigFile(cfg.directories);

        const options = [
            `-nointeractive`,
            `-autozoom`,
            `-cachemem 100`,
            cfg.doRandom ? "-random" : "-norandom",
            `-timeout ${cfg.timePerSlide}`,
            `-blend ${cfg.transitionTime}`,
            cfg.showNames ? "-verbose" : "-noverbose",
            `-list ${config.getImageListFilePath()}`,
            `-status ${config.getFbiStatusPath()}`,
            `-commands ${config.getFbiCommandsPath()}`
        ].join(" ");

        setTimeout(() => {
            system.execute(`sudo fbi ${options}`);
        }, 1000);
    }

    stop() {
        this.isActive = false;
        this.status = {};
        this.emit('slideStateChange', this.getState() );
        system.execute(`sudo killall -q -KILL fbi`);
    }

    toggle_pause() {
        if (this.isActive) {
            this.#sendCommandToFbi("pause");
        }
    }

    next_image() {
        if (this.isActive) {
            this.#sendCommandToFbi("next");
        }
    }

    prev_image() {
        if (this.isActive) {
            this.#sendCommandToFbi("prev");
        }
    }

    toggle_statusline() {
        if (this.isActive) {
            this.#sendCommandToFbi("statusline");
        }
    }

    #sendCommandToFbi(command) {
        fs.open(config.getFbiCommandsPath(), constants.O_WRONLY | constants.O_NONBLOCK, (err, fd) => {
            if (err) {
            if (err.code === 'ENXIO')
                return;
            console.error('Pipe error:', err);
            return;
            }

            fs.write(fd, Buffer.from(command + '\n'), () => {
            fs.close(fd, () => {});
            });
        });
    }

    #startStatusReader() {
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
            setTimeout(() => this.#startStatusReader(), 1000);
        });

        stream.on('end', () => {
            setTimeout(() => this.#startStatusReader(), 1000);
        });
    }

    #buildConfigFile(directories) {
        let data = "";
        directories.forEach((directory) => {
            const images = storage.listImages(directory);
            images.forEach((image) => {
                const imgPath = path.join(config.getContainersPath(), directory, image);
                data += imgPath + "\n";
            });
        });
        fs.writeFileSync(config.getImageListFilePath(), data);
    }

    getState() {
        return { active: this.isActive, status: this.status };
    }
}

const slideshow = new Slideshow();
module.exports = slideshow;
