const express = require('express');
const router = express.Router();
const system = require('../util/system');
const storage = require('../util/storage');

router.post('/update', function(req, res) {
    res.render('static', {
            title: res.__('Imageframe'),
            header: res.__('UpdateHeader'),
            description: res.__('UpdateDesc'),
            shouldReload: false,
        }
    );

    setTimeout(() => {
        system.update();
    }, 1000);
});

router.post('/restart', function(req, res) {
    res.render('static', {
            title: res.__('Imageframe'),
            header: res.__('RestartHeader'),
            description: res.__('RestartDesc'),
            shouldReload: true,
        }
    );

    setTimeout(() => {
        system.restartSoftware();
    }, 1000);
});


module.exports = router;
