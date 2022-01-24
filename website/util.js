
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

module.exports = {
    loadDirs,
}
