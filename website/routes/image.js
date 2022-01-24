
var express = require('express');
var multer = require('multer')
var router = express.Router();
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var config = require('../config')
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
    };

    res.render('image', { title: 'Bilder' });
});

router.post('/upload', upload.none(), function(req, res, next) {
    var dirName = req.body.fcreatedir;

    exec(scriptPath + 'image.sh fixmv');

    res.redirect('/images')
});

router.post('/delete', upload.none(), function(req, res, next) {
    var dirOld = req.body.folddir;
    var dirNew = req.body.fnewdir;

    exec(config.scriptPath + 'directory.sh rename ' + dirOld + ' ' + dirNew);

    res.redirect('/images')
});

module.exports = router;
