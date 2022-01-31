
var express = require('express');
var multer = require('multer');
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var config = require('../config');
var util = require('../util');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, config.imagePath);
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
});

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

router.get('/', async function(req, res, next) {
    res.locals = {
        dirs: await util.loadDirs(),
        imgs: await util.loadImgs()
    };

    res.render('image', { title: 'Bilder' });
});

router.post('/upload', upload.array('fimgn'), function(req, res, next) {
    var dir = req.body.fdirn;

    exec(config.scriptPath + 'image.sh fixmv ' + dir);

    res.redirect('/image')
});

router.post('/delete', upload.none(), function(req, res, next) {
    var dir = req.body.fdird;
    var imgs = req.body.fimgd;
    if (typeof imgs === 'string') {
        imgs = [imgs];
    }
    var str_imgs = imgs.join(' ');

    exec(config.scriptPath + 'image.sh del ' + dir + ' ' + str_imgs);

    res.redirect('/image')
});

module.exports = router;
