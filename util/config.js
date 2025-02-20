const path = require('path');

class Config {
    constructor() {
        this.dataBase = global.__dataBase;
        this.projectBase = global.__projectBase;
    }

    getProjectBasePath() {
        return this.projectBase;
    }

    getScriptPath() {
        return path.join(this.projectBase, "scripts");
    }

    getImagePath() {
        return path.join(this.dataBase, "images");
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
        return path.join(this.dataBase, "settings");
    }

    getKVStorePath() {
        return path.join(this.getSettingsPath(), "kvstore.json");
    }

    getLogsPath() {
        if (process.env.NODE_ENV === "development") {
            return path.join(this.dataBase, "imageframe.log");
        } else {
            return path.join("/", "var", "log", "imageframe.log");
        }
    }
}

const config = new Config();
module.exports = config;
