const express = require('express');
const router = express.Router();
const system = require('../util/system');

router.post('/off', function(req, res, next) {
    res.render('static', {
            title: res.__('Imageframe'),
            header: res.__('ShutdownHeader'),
            description: res.__('ShutdownDesc'),
        }
    );

    setTimeout(() => {
        system.shutdown();
    }, 1000);
});

router.post('/reboot', function(req, res, next) {
    res.render('static', {
            title: res.__('Imageframe'),
            header: res.__('RebootHeader'),
            description: res.__('RebootDesc'),
        }
    );

    setTimeout(() => {
        system.reboot();
    }, 1000);
});

module.exports = router;
