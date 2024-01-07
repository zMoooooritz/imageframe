const express = require('express');
const multer = require('multer');
const router = express.Router();
const schedule = require("../util/schedule");
const system = require("../util/system");
const Time = require('../util/time');

const upload = multer();

router.get('/', async function(req, res, next) {
    var { dstart, dend } = await schedule.getDailySchedule();
    var { hstart, hend } = await schedule.getHolidaySchedule();
    res.locals = {
        daily_start_time: new Time(dstart).toString(),
        daily_end_time: new Time(dend).toString(),
        holiday_start_time: new Time(hstart).toString(),
        holiday_end_time: new Time(hend).toString(),
    };

    res.render('screen', { title: 'Bildschirm' });
});

router.post('/on', upload.none(), function(req, res, next) {
    schedule.executeEvent(true);

    res.redirect('/screen');
});

router.post('/off', upload.none(), function(req, res, next) {
    schedule.executeEvent(false);

    res.redirect('/screen');
});

router.post('/dailyschedule', upload.none(), async function(req, res, next) {
    var startTime = req.body.dstime;
    var endTime = req.body.detime;

    const start = new Time(startTime.split(":")[0], startTime.split(":")[1]);
    const end = new Time(endTime.split(":")[0], endTime.split(":")[1]);
    await schedule.setDailySchedule(start, end);

    res.redirect('/screen');
});

router.post('/holidayschedule', upload.none(), async function(req, res, next) {
    var startTime = req.body.hstime;
    var endTime = req.body.hetime;

    const start = new Time(startTime.split(":")[0], startTime.split(":")[1]);
    const end = new Time(endTime.split(":")[0], endTime.split(":")[1]);
    await schedule.setHolidaySchedule(start, end);

    res.redirect('/screen');
});

router.post('/noschedule', upload.none(), async function(req, res, next) {
    await schedule.clear();

    res.redirect('/screen');
});

module.exports = router;
