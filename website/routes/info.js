
var express = require('express');
var multer = require('multer')
var router = express.Router();
var exec = require('child_process').exec;
var config = require('../config')

const upload = multer()

router.get('/', function(req, res, next) {
    res.render('info', { title: 'Info-Modus' });
});

router.post('/start', upload.none(), function(req, res, next) {
    var hasDate = (req.body.fdate === 'on') ? 1 : 0;
    var hasJoke = (req.body.fjoke === 'on') ? 1 : 0;
    var wttr = 0;
    if (req.body.fwttr1 == 'on')
        wttr = 1;
    if (req.body.fwttr3 == 'on')
        wttr = 3;
    
    exec(config.scriptPath + 'infoscreen.sh DATE=' + hasDate + ' JOKE=' + hasJoke + ' WTTR=' + wttr);

    res.redirect('/');
});

module.exports = router;
