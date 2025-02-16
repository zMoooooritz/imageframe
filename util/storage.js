const fs = require('fs')
const path = require('path')
const config = require('./config')
const sharp = require('sharp')

const WIDTH = 1920;
const HEIGHT = 1080;

const FILE_SIZE_LIMIT = 16 * 1024 * 1024; // 16 MB

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

    async fixAndMove(container) {
        const images = fs.readdirSync(config.getTmpImagePath());
        sharp.cache(false);

        for (const image of images) {
            const oldPath = path.join(config.getTmpImagePath(), image);
            const escapedImageName = image.replace(/[^a-zA-Z0-9.]/g, '_');
            const newPath = path.join(this.getContainerPath(container), escapedImageName);
            const stats = fs.statSync(oldPath);
            if (stats.size > FILE_SIZE_LIMIT) {
                console.log("Dropping image since it is too big:", image);
                continue;
            }

            await sharp(oldPath)
                .rotate()
                .resize({
                    width: WIDTH,
                    height: HEIGHT,
                    fit: sharp.fit.contain,
                    background: { r: 0, g: 0, b: 0 },
                })
                .jpeg({quality: 100})
                .toFile(newPath)
                .catch(err => {console.log("Error while converting", image, err)});
        };

        images.forEach((image) => {
            fs.unlinkSync(path.join(config.getTmpImagePath(), image), (err) => {
                if (err) {
                    console.log("Unable to delete image:", image);
                }
            });
        })
    }

    deleteImages(container, images) {
        images.forEach((image) => {
            const imgPath = path.join(this.getContainerPath(container), image);
            fs.rmSync(imgPath);
        });
    }

    clearTmpDir() {
        const tmpDir = config.getTmpImagePath()
        fs.readdir(tmpDir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(tmpDir, file), (err) => {

                });
            }
        });
    }
}

const storage = new Storage();
module.exports = storage
