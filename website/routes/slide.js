
var express = require('express');
var multer = require('multer')
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config')
var util = require('../util');

const upload = multer()

router.get('/', async function(req, res, next) {
    res.locals = {
        dirs: await util.loadDirs(),
    };

    res.render('slide', { title: 'Diashow' });
});

router.post('/start', upload.none(), function(req, res, next) {
    var isRandom = (req.body.frandom === 'on') ? 1 : 0;
    var imageTime = req.body.ftime;
    var blendTime = req.body.fblend;
    var showNames = (req.body.fname === 'on') ? 1 : 0;
    var dirs = req.body.fdirs;
    if (typeof dirs === 'string') {
        dirs = [dirs];
    }
    var str_dirs = dirs.join(';');

    exec(config.scriptPath + 'slideshow.sh RANDOM=' + isRandom + ' STIME=' + imageTime + ' BTIME=' + blendTime + ' NAMES=' + showNames + ' DIRS=' + str_dirs);

    res.redirect('/');
});

module.exports = router;
