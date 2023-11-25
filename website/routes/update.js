const express = require('express');
const multer = require('multer');
const router = express.Router();
const exec = require('child_process').exec;
const path = require('path');
const config = require('../util/config');

const upload = multer();

router.get('/', async function(req, res, next) {
    res.render('update', { title: 'Updates' });
});

router.post('/software', upload.none(), function(req, res, next) {
    exec(path.join(config.getScriptPath(), "update.sh") + " software")

    res.redirect('/update');
});

module.exports = router;
