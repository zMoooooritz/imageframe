
const imagesPath = '/home/imageframe/images/tmp'
const scriptPath = '/home/imageframe/scripts/';

var express = require('express');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imagesPath);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})

function fileFilter(req, file, cb) {
  var ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.get('/', function(req, res, next) {
  res.send('Hier sollte man nicht landen!');
});

router.post('/', upload.array('fnimages'), function (req, res, next) {
  var exec = require('child_process').exec;
  exec(scriptPath + 'image.sh fixmv', { encoding: 'utf-8' });

  res.redirect('../')
});

module.exports = router;
