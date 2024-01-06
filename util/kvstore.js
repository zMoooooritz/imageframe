const fs = require('fs/promises');
const config = require('./config');

class KeyValueStore {

    constructor(filePath) {
        this.filePath = filePath;
        this.data = {};
    }

    async load() {
        try {
            const content = await fs.readFile(this.filePath, 'utf-8');
            this.data = JSON.parse(content);
        } catch (error) {
            this.data = {};
            console.log("Unable to load key-values ", error)
        }
    }

    async save() {
        try {
            const content = JSON.stringify(this.data, null, 2);
            await fs.writeFile(this.filePath, content, 'utf-8');
        } catch (error) {
            console.log("Unable to store key-values ", error)
        }
    }

    set(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }

    getDefault(key, def) {
        const val = this.data[key];
        if (val !== undefined) {
            return val;
        }
        return def;
    }

    has(key) {
        return key in this.data;
    }

    del(key) {
        delete this.data[key];
    }

    getAll() {
        return this.data;
    }

}

const kvStore = new KeyValueStore(config.getKVStorePath());
module.exports = kvStore;
