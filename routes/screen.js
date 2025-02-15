const express = require('express');
const router = express.Router();
const system = require('../util/system');

router.get('/', function(req, res, next) {
    res.render('screen', { title: res.__('Screen') });
});

router.post('/on', async function(req, res, next) {
    system.displayOn();

    res.redirect('/screen');
});

router.post('/off', async function(req, res, next) {
    system.displayOff();

    res.redirect('/screen');
});

module.exports = router;
