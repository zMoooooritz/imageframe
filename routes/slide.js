const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = require('../util/storage')
const kvstore = require('../util/kvstore');
const slideshow = require('../util/slideshow');
const upload = multer();

router.get('/', async function(req, res, next) {
    await kvstore.load();

    res.locals = {
        srandom: kvstore.getDefault("slide_random", true),
        stime: kvstore.getDefault("slide_time", 30),
        sblend: kvstore.getDefault("slide_blend", 200),
        snames: kvstore.getDefault("slide_names", false),
        sdirs: kvstore.getDefault("slide_dirs", []),
        dirs: storage.listContainers(),
    };

    res.render('slide', { title: 'Diashow' });
});

router.post('/start', upload.none(), async function(req, res, next) {
    await kvstore.load();
    kvstore.set("mode", "slideshow");
    kvstore.set("slide_random", (req.body.frandom === 'on') ? true : false);
    var slideTime = parseInt(req.body.ftime, 10)
    if (!isNaN(slideTime)) {
        kvstore.set("slide_time", slideTime)
    }
    var blendTime = parseInt(req.body.fblend, 10)
    if (!isNaN(blendTime)) {
        kvstore.set("slide_blend", blendTime)
    }
    kvstore.set("slide_names", (req.body.fname === 'on') ? true : false);
    var dirs = req.body.fdirs;
    if (typeof dirs === 'string') {
        dirs = [dirs];
    }
    kvstore.set("slide_dirs", dirs);
    await kvstore.save();

    slideshow.restart();

    res.redirect('/');
});

module.exports = router;
