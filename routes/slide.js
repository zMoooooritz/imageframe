const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = require('../util/storage')
const kvStore = require('../util/kvstore');
const data = require('../util/data');
const slideshow = require('../util/slideshow');
const system = require('../util/system');

const upload = multer();

router.get('/', async function(req, res, next) {
    res.locals = {
        imageContainers: storage.listContainers(),
        data: await data.ModeSlide.Configuration(),
    };

    res.render('slide', { title: res.__('Slideshow') });
});

router.post('/save', upload.none(), async function(req, res, next) {
    var ms = data.ModeSlide.FromData(req.body);

    await kvStore.load();
    var defaults = kvStore.getDefault("defaults", {});
    defaults["slide"] = ms;
    kvStore.set("defaults", defaults);
    await kvStore.save();

    res.redirect('/slide');
});

router.post('/start', async function(req, res, next) {
    const cfg = await data.ModeSlide.Configuration();
    system.displayOn();
    slideshow.restart(cfg);

    res.redirect('/slide');
});

router.post('/stop', function(req, res, next) {
    slideshow.stop();
    system.displayOff();

    res.redirect('/slide');
});

module.exports = router;
