const express = require('express');
const multer = require('multer');
const router = express.Router();
const {schedule, ScheduleType} = require('../util/schedule');
const Time = require('../util/time');

const upload = multer();

router.get('/', async function(req, res, next) {
    var { start, end } = await schedule.getSchedule(ScheduleType.EVERYDAY);
    var estart = new Time(start).toString(), eend = new Time(end).toString();
    var { start, end } = await schedule.getSchedule(ScheduleType.WORKDAY);
    var wstart = new Time(start).toString(), wend = new Time(end).toString();
    var { start, end } = await schedule.getSchedule(ScheduleType.HOLIDAY);
    var hstart = new Time(start).toString(), hend = new Time(end).toString();

    res.locals = {
        everyday_start_time: estart,
        everyday_end_time: eend,
        workday_start_time: wstart,
        workday_end_time: wend,
        holiday_start_time: hstart,
        holiday_end_time: hend
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

async function handleSchedule(scheduleType, mode, startTime, endTime) {
    if (mode == 'set') {
        const start = new Time(startTime.split(":")[0], startTime.split(":")[1]);
        const end = new Time(endTime.split(":")[0], endTime.split(":")[1]);
        await schedule.setSchedule(scheduleType, start, end);
    }
    if (mode == 'clear') {
        await schedule.clearSchedule(scheduleType);
    }
}

router.post('/everydayschedule', upload.none(), async function(req, res, next) {
    await handleSchedule(ScheduleType.EVERYDAY, req.body.mode, req.body.estime, req.body.eetime);
    res.redirect('/screen');
});

router.post('/workdayschedule', upload.none(), async function(req, res, next) {
    await handleSchedule(ScheduleType.WORKDAY, req.body.mode, req.body.wstime, req.body.wetime);
    res.redirect('/screen');
});

router.post('/holidayschedule', upload.none(), async function(req, res, next) {
    await handleSchedule(ScheduleType.HOLIDAY, req.body.mode, req.body.hstime, req.body.hetime);
    res.redirect('/screen');
});

router.post('/resetschedules', upload.none(), async function(req, res, next) {
    await schedule.clear();

    res.redirect('/screen');
});

module.exports = router;
