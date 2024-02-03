const express = require('express');
const multer = require('multer');
const router = express.Router();
const schedule = require('../util/scheduler');

const upload = multer();

router.get('/', async function(req, res, next) {
    res.render('screen', { title: 'Bildschirm' });
});

router.post('/on', upload.none(), async function(req, res, next) {
    await schedule.executeEvent(true);

    res.redirect('/screen');
});

router.post('/off', upload.none(), async function(req, res, next) {
    await schedule.executeEvent(false);

    res.redirect('/screen');
});

module.exports = router;
