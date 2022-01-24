
var express = require('express');
var multer = require('multer')
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config')

const upload = multer()

router.post('/off', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'power.sh shutdown');

    res.redirect('/');
});

router.post('/reboot', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'power.sh reboot');

    res.redirect('/');
});

module.exports = router;
