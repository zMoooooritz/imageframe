const os = require('os');
const path = require('path');

class Config {
    constructor() {
        this.homePath = os.homedir();
        this.rootPath = global.__basedir;
    }

    getScriptPath() {
        return path.join(this.rootPath, "scripts");
    }

    getImagePath() {
        return path.join(this.homePath, "images");
    }

    getTmpImagePath() {
        return path.join(this.getImagePath(), "tmp");
    }

    getContainersPath() {
        return path.join(this.getImagePath(), "containers");
    }

    getImageListFilePath() {
        return path.join(this.getImagePath(), "list");
    }

    getSettingsPath() {
        return path.join(this.homePath, "settings");
    }

    getKVStorePath() {
        return path.join(this.getSettingsPath(), "kvstore.json");
    }
}

const config = new Config();
module.exports = config;
