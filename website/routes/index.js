
const scriptPath = '/home/imageframe/scripts/';

var express = require('express');
var router = express.Router();

async function loadImgs() {
  const { promisify } = require('util');
  var exec = promisify(require('child_process').exec);

  const { stdout, stderr } = await exec(scriptPath + 'image.sh load');
  var files = stdout.split('\n');
  files.pop()

  return files;
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.locals = {
    images: await loadImgs(),
    // images: [],
  };

  res.render('index', { title: 'Bilderrahmen-Steuerung' });
});

module.exports = router;
