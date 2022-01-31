
var express = require('express');
var multer = require('multer');
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config');
var util = require('../util');

const upload = multer();

router.get('/', async function(req, res, next) {
    res.locals = {
        dirs: await util.loadDirs(),
    };

    res.render('directory', { title: 'Ordner' });
});

router.post('/create', upload.none(), function(req, res, next) {
    var dirName = req.body.fcreatedir;

    exec(config.scriptPath + 'directory.sh create ' + dirName);

    res.redirect('/directory')
});

router.post('/rename', upload.none(), function(req, res, next) {
    var dirOld = req.body.folddir;
    var dirNew = req.body.fnewdir;

    exec(config.scriptPath + 'directory.sh rename ' + dirOld + ' ' + dirNew);

    res.redirect('/directory')
});

router.post('/delete', upload.none(), function(req, res, next) {
    var dirName = req.body.fdeldir;

    exec(config.scriptPath + 'directory.sh delete ' + dirName);
    
    res.redirect('/directory')
});

module.exports = router;
