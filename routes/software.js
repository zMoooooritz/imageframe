const express = require('express');
const router = express.Router();
const system = require('../util/system');
const storage = require('../util/storage');

router.get('/', function(req, res, next) {
    res.locals = {
        currVersion: system.getInstalledVersion().trim(),
        newestVersion: system.getLatestVersion().trim(),
        tmpFiles: storage.countFilesInTmpDir(),
    };

    res.render('software', { title: res.__('Settings') });
});

router.post('/update', function(req, res, next) {
    system.update();

    res.redirect('/software');
});

router.post('/clear-tmp-dir', function(req, res, next) {
    storage.clearTmpDir();

    res.redirect('/software');
});

module.exports = router;
