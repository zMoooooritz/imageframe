const express = require('express');
const router = express.Router();
const system = require('../util/system');

router.get('/', async function(req, res, next) {
    res.render('update', { title: res.__('Updates') });
});

router.post('/software', function(req, res, next) {
    system.update();

    res.redirect('/update');
});

module.exports = router;
