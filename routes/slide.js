const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = require('../util/storage')
const kvStore = require('../util/kvstore');
const data = require('../util/data');
const scheduler = require('../util/scheduler');
const slideshow = require('../util/slideshow');

const upload = multer();

router.get('/', async function(req, res) {
    res.locals = {
        imageContainers: storage.listContainers(),
        data: await data.ModeSlide.Configuration(),
    };

    res.render('slide', { title: res.__('Slideshow') });
});

router.get('/status', async (req, res) => {
    try {
        res.json({
            active: slideshow.isActive,
            status: slideshow.status,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch display information' });
    }
});

// Server-Sent Events endpoint for real-time status updates
router.get('/status/stream', (req, res) => {
    // Set SSE headers
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial state
    res.write(`data: ${JSON.stringify(slideshow.getState())}\n\n`);

    // Listen for state changes
    const stateChangeHandler = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    slideshow.on('slideStateChange', stateChangeHandler);

    // Handle client disconnect
    req.on('close', () => {
        slideshow.removeListener('slideStateChange', stateChangeHandler);
    });

    // Send heartbeat every 30 seconds to keep connection alive
    const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
    }, 30000);

    req.on('close', () => {
        clearInterval(heartbeat);
    });
});

router.post('/save', upload.none(), async function(req, res) {
    var ms = data.ModeSlide.FromData(req.body);

    await kvStore.load();
    var defaults = kvStore.getDefault("defaults", {});
    defaults["slide"] = ms;
    kvStore.set("defaults", defaults);
    await kvStore.save();

    res.json({ success: true, message: 'Settings saved successfully' });
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

    res.json({ success: true, message: 'Slideshow started successfully' });
});

router.post('/stop', function(req, res) {
    const stopEvent = new data.Event(new Date(), data.EventActions.STOP, {});
    scheduler.executeEvent(stopEvent);

    res.json({ success: true, message: 'Slideshow stopped successfully' });
});

router.post('/pause', function(req, res) {
    slideshow.toggle_pause();

    res.json({ success: true, message: 'Slideshow paused successfully' });
});

router.post('/next', function(req, res) {
    slideshow.next_image();

    res.json({ success: true, message: 'Slideshow went to next slide successfully' });
});

router.post('/prev', function(req, res) {
    slideshow.prev_image();

    res.json({ success: true, message: 'Slideshow went to previous slide successfully' });
});

module.exports = router;