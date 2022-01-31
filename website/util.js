
const { promisify } = require('util');
var exec = promisify(require('child_process').exec);
var config = require('./config');

async function loadDirs() {
    // return ['TestDir1', 'MyDir2', 'Directory'];

    const { stdout, stderr } = await exec(config.scriptPath + 'directory.sh load');
    return stdout.split(';');
}

async function loadImgs() {
    // return ['image01', 'image02', 'image03',
    //     'image04', '_', 'image05', 'image06', '_',
    //     'image07', 'image08', 'image09'].join(';')

    const { stdout, stderr } = await exec(config.scriptPath + 'image.sh load');
    return stdout;
}

module.exports = {
    loadDirs,
    loadImgs
}
