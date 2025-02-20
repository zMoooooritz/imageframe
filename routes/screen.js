const express = require('express');
const router = express.Router();
const system = require('../util/system');

router.post('/on', async function(req, res) {
    system.displayOn();
    res.redirect('/');
});

router.post('/off', async function(req, res) {
    system.displayOff();
    res.redirect('/');
});

module.exports = router;
