const os = require('os');
const path = require('path');

class Config {
    constructor() {
        this.basepath = os.homedir();
    }

    getScriptPath() {
        return path.join(this.basepath, "scripts");
    }

    getImagePath() {
        return path.join(this.basepath, "images");
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
        return path.join(this.basepath, "settings");
    }

    getKVStorePath() {
        return path.join(this.getSettingsPath(), "kvstore.json");
    }
}

const config = new Config();
module.exports = config;
