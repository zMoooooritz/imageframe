const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = require('../util/storage')
const kvStore = require('../util/kvstore');
const data = require('../util/data');
const scheduler = require('../util/scheduler');

const upload = multer();

router.get('/', async function(req, res) {
    res.locals = {
        imageContainers: storage.listContainers(),
        data: await data.ModeSlide.Configuration(),
    };

    res.render('slide', { title: res.__('Slideshow') });
});

router.post('/save', upload.none(), async function(req, res) {
    var ms = data.ModeSlide.FromData(req.body);

    await kvStore.load();
    var defaults = kvStore.getDefault("defaults", {});
    defaults["slide"] = ms;
    kvStore.set("defaults", defaults);
    await kvStore.save();

    res.redirect('/slide');
});

router.post('/start', upload.none(), async function(req, res) {
    const duration = data.SlideshowDuration.FromData(req.body);
    const cfg = await data.ModeSlide.Configuration();

    const startEvent = new data.Event(new Date(), data.EventActions.START, { mode: 'slide', data: cfg });
    scheduler.executeEvent(startEvent);
    if (duration.hours > 0 || duration.minutes > 0) {
        var stopDate = new Date();
        stopDate.setHours(stopDate.getHours() + duration.hours);
        stopDate.setMinutes(stopDate.getMinutes() + duration.minutes);
        const endEvent = new data.Event(stopDate, data.EventActions.STOP, {});
        scheduler.scheduleEvent(endEvent);
    }

    res.redirect(req.get('Referer') || req.get('Referrer') || "/");
});

router.post('/stop', function(req, res) {
    const stopEvent = new data.Event(new Date(), data.EventActions.STOP, {});
    scheduler.executeEvent(stopEvent);

    res.redirect(req.get('Referer') || req.get('Referrer') || "/");
});

module.exports = router;
