const express = require('express');
const router = express.Router();
const system = require('../util/system');

router.post('/off', function(req, res, next) {
    system.shutdown();
    res.redirect('/');
});

router.post('/reboot', function(req, res, next) {
    system.reboot();
    res.redirect('/');
});

module.exports = router;
