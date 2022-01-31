
var express = require('express');
var multer = require('multer');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config');

const upload = multer();

router.get('/', async function(req, res, next) {
    res.render('power', { title: 'Energie' });
});

router.post('/off', upload.none(), function(req, res, next) {
    console.log("Herunterfahren");
    // exec(config.scriptPath + 'power.sh shutdown');

    res.redirect('/');
});

router.post('/reboot', upload.none(), function(req, res, next) {
    console.log("Neustarten");
    // exec(config.scriptPath + 'power.sh reboot');

    res.redirect('/');
});

module.exports = router;
