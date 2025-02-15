const express = require('express');
const router = express.Router();
const system = require('../util/system');

router.get('/', async function(req, res, next) {
    res.locals = {
        currTag: system.getInstalledTag(),
        newestTag: system.getLatestTag(),
    };

    res.render('software', { title: res.__('Software') });
});

router.post('/update', function(req, res, next) {
    system.update();

    res.redirect('/software');
});

module.exports = router;
