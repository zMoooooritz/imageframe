const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: res.__('Imageframe') });
});

module.exports = router;
