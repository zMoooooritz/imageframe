
const scriptPath = '/home/imageframe/scripts/';

var express = require('express');
var multer = require('multer')
var router = express.Router();

const upload = multer()

router.get('/', function(req, res, next) {
  res.send('Hier sollte man nicht landen!');
});

router.post('/', upload.none(), function(req, res, next) {
  var isRandom = (req.body.frandom === 'on') ? 1 : 0;
  var imageTime = req.body.ftime;
  var blendTime = req.body.fblend;
  var showNames = (req.body.fname === 'on') ? 1 : 0;

  var exec = require('child_process').exec;
  exec(scriptPath + 'slideshow.sh ' + isRandom + ' ' + imageTime + ' ' + blendTime + ' ' + showNames, { encoding: 'utf-8' });

  res.redirect('../');
});

module.exports = router;
