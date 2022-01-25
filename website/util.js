
var exec = require('child_process').exec;

async function loadDirs() {
    const { stdout, stderr } = exec('ls');
    return ['TestDir1', 'MyDir2', 'Directory'];

    // const { promisify } = require('util');

    // const { stdout, stderr } = await exec(config.scriptPath + 'directory.sh list');
    // var files = stdout.split('\n');
    // files.pop()
    // return files;
}

async function loadImgs() {
    return [
        ['image01', 'image02', 'image03',
        'image04', '_', 'image05', 'image06', '_',
        'image07', 'image08', 'image09'],
    ]

    // const { promisify } = require('util');

    // const { stdout, stderr } = await exec(config.scriptPath + 'directory.sh list');
    // var files = stdout.split('\n');
    // files.pop()
    // return files;
}

module.exports = {
    loadDirs,
    loadImgs
}
