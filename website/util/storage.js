const fs = require('fs')
const path = require('path')
const config = require('./config')
const jo = require('jpeg-autorotate')

class Storage {

    getContainerPath(name) {
        return path.join(config.getContainersPath(), name);
    }

    createContainer(name) {
        fs.mkdirSync(this.getContainerPath(name));
    }

    renameContainer(name, newName) {
        const oldPath = this.getContainerPath(name);
        const newPath = this.getContainerPath(newName);
        fs.renameSync(oldPath, newPath);
    }

    deleteContainer(name) {
        fs.rmSync(this.getContainerPath(name), { recursive: true, force: true });
    }

    listContainers() {
        const contents = fs.readdirSync(config.getContainersPath());

        const directories = contents.filter((item) => {
            return fs.statSync(this.getContainerPath(item)).isDirectory();
        });

        return directories;
    }

    buildImageMap() {
        const data = {};
        const containers = this.listContainers();
        containers.forEach((container) => {
            data[container] = this.listImages(container);
        });
        return data;
    }

    listImages(container) {
        const containerPath = this.getContainerPath(container);
        const contents = fs.readdirSync(containerPath);

        const images = contents.filter((image) => {
            return fs.statSync(path.join(containerPath, image)).isFile();
        });

        return images;
    }

    fixAndMove(container) {
        const images = fs.readdirSync(config.getTmpImagePath());

        const jpegs = images.filter((image) => {
            const lower = image.toLowerCase();
            return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
        });
        jpegs.forEach((image) => {
            jo.rotate(path.join(config.getTmpImagePath(), image), {})
                .then(({buffer, orientation, dimensions, quality}) => {

                })
                .catch((error) => {
                    console.log("Auto-Rotate-Error: " + error)
                });
        });

        images.forEach((image) => {
            const oldPath = path.join(config.getTmpImagePath(), image);
            const newPath = path.join(this.getContainerPath(container), image);
            fs.renameSync(oldPath, newPath);
        });
    }

    deleteImages(container, images) {
        images.forEach((image) => {
            const imgPath = path.join(this.getContainerPath(container), image);
            fs.rmSync(imgPath);
        });
    }
}

const storage = new Storage();
module.exports = storage