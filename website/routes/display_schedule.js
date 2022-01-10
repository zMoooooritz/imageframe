
const scriptPath = '/home/imageframe/scripts/';

var express = require('express');
var multer = require('multer')
var router = express.Router();

const upload = multer()

router.get('/', function(req, res, next) {
  res.send('Hier sollte man nicht landen!');
});

router.post('/', upload.none(), function(req, res, next) {
  var startTime = req.body.fstime;
  var endTime = req.body.fetime;

  var exec = require('child_process').exec;
  exec(scriptPath + 'display.sh schedule ' + startTime + ' ' + endTime, { encoding: 'utf-8' });

  res.redirect('../');
});

module.exports = router;
