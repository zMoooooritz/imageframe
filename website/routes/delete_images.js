
const scriptPath = '/home/imageframe/scripts/'

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Hier sollte man nicht landen!');
});

router.post('/', function(req, res, next) {
  var exec = require('child_process').exec;
  exec(scriptPath + 'image.sh dela', { encoding: 'utf-8' });

  res.redirect('../')
});

module.exports = router;
