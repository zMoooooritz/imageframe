
var express = require('express');
var multer = require('multer')
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config')

const upload = multer()

router.get('/', async function(req, res, next) {
    res.render('screen', { title: 'Bildschirm' });
});

router.post('/on', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'display.sh on');

    res.redirect('/screen');
});

router.post('/off', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'display.sh off');

    res.redirect('/screen');
});

router.post('/schedule', upload.none(), function(req, res, next) {
    var startTime = req.body.fstime;
    var endTime = req.body.fetime;

    exec(config.scriptPath + 'display.sh schedule ' + startTime + ' ' + endTime);

    res.redirect('/screen');
});

router.post('/noschedule', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'display.sh noschedule');

    res.redirect('/screen');
});

module.exports = router;
