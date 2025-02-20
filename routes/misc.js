const express = require('express');
const router = express.Router();
const system = require('../util/system');
const storage = require('../util/storage');

router.get('/', function(req, res) {
    res.locals = {
        currVersion: system.getInstalledVersion().trim(),
        newestVersion: system.getLatestVersion().trim(),
        tmpFiles: storage.countFilesInTmpDir(),
    };

    res.render('misc', { title: res.__('Miscellaneous') });
});

router.post('/clear-tmp-dir', function(req, res) {
    storage.clearTmpDir();

    res.redirect('/misc');
});

module.exports = router;
