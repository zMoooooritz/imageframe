
var express = require('express');
var multer = require('multer')
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config')

const upload = multer()

router.get('/', async function(req, res, next) {
    res.render('update', { title: 'Updates' });
});

router.post('/software', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'update.sh software');

    res.redirect('/update');
});

router.post('/system', upload.none(), function(req, res, next) {
    exec(config.scriptPath + 'update.sh system');

    res.redirect('/update');
});

module.exports = router;
