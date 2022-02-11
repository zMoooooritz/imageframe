
const { promisify } = require('util');
var exec = promisify(require('child_process').exec);
var config = require('./config');

async function loadDirs() {
    const { stdout, stderr } = await exec(config.scriptPath + 'directory.sh load');
    return stdout.split(';');
}

async function loadImgs() {
    const { stdout, stderr } = await exec(config.scriptPath + 'image.sh load');
    return stdout;
}

module.exports = {
    loadDirs,
    loadImgs
}
