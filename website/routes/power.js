const express = require('express');
const multer = require('multer');
const router = express.Router();
const system = require('../util/system');

const upload = multer();

router.get('/', async function(req, res, next) {
    res.render('power', { title: 'Energie' });
});

router.post('/off', upload.none(), function(req, res, next) {
    system.shutdown();

    res.redirect('/');
});

router.post('/reboot', upload.none(), function(req, res, next) {
    system.reboot();

    res.redirect('/');
});

module.exports = router;
