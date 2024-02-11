const express = require('express');
const router = express.Router();
const schedule = require('../util/scheduler');

router.get('/', function(req, res, next) {
    res.render('screen', { title: res.__('Screen') });
});

router.post('/on', async function(req, res, next) {
    await schedule.executeEvent(true);

    res.redirect('/screen');
});

router.post('/off', async function(req, res, next) {
    await schedule.executeEvent(false);

    res.redirect('/screen');
});

module.exports = router;
