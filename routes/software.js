const express = require('express');
const router = express.Router();
const system = require('../util/system');
const storage = require('../util/storage');

router.get('/', async function(req, res, next) {
    res.locals = {
        currTag: system.getInstalledTag(),
        newestTag: system.getLatestTag(),
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
