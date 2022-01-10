
const scriptPath = '/home/imageframe/scripts/'

var express = require('express');
var multer = require('multer')
var router = express.Router();

const upload = multer()

router.get('/', function(req, res, next) {
  res.send('Hier sollte man nicht landen!');
});

router.post('/', upload.none(), function(req, res, next) {
  var imgs = req.body.fdimages;
  if(typeof imgs === 'string') {
    imgs = [imgs];
  }
  var str_imgs = imgs.join(' ');
  var exec = require('child_process').exec;
  exec(scriptPath + 'image.sh del ' + str_imgs, { encoding: 'utf-8' });

  res.redirect('../');
});

module.exports = router;
