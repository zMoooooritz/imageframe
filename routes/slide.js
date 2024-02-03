const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const storage = require('../util/storage')
const kvStore = require('../util/kvstore');
const data = require('../util/data');
const slideshow = require('../util/slideshow');

router.get('/', async function(req, res, next) {
    res.locals = {
        imageContainers: storage.listContainers(),
        data: await data.ModeSlide.Configuration(),
    };

    res.render('slide', { title: 'Diashow' });
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

router.post('/start', upload.none(), async function(req, res, next) {
    const cfg = await data.ModeSlide.Configuration();
    slideshow.restart(cfg);

    res.redirect('/slide');
});

router.post('/stop', upload.none(), async function(req, res, next) {
    slideshow.stop();

    res.redirect('/slide');
});

module.exports = router;
