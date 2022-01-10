
const scriptPath = '/home/imageframe/scripts/';

var express = require('express');
var multer = require('multer')
var router = express.Router();

const upload = multer()

router.get('/', function(req, res, next) {
  res.send('Hier sollte man nicht landen!');
});

router.post('/', upload.none(), function(req, res, next) {
  var hasDate = (req.body.fdate === 'on') ? 1 : 0;
  var hasJoke = (req.body.fjoke === 'on') ? 1 : 0;
  var wttr = 0;
  if (req.body.fwttr1 == 'on')
    wttr = 1;
  if (req.body.fwttr3 == 'on')
    wttr = 3;

  var exec = require('child_process').exec;
  exec(scriptPath + 'infoscreen.sh ' + hasDate + ' ' + hasJoke + ' ' + wttr, { encoding: 'utf-8' });

  res.redirect('../');
});

module.exports = router;
