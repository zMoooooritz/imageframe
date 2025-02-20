const express = require('express');
const router = express.Router();
const multer = require('multer');
const kvStore = require('../util/kvstore');
const storage = require('../util/storage');
const Time = require('../util/time');
const scheduler = require('../util/scheduler');
const data = require('../util/data');

const upload = multer();

router.get('/', async function(req, res) {
    await kvStore.load();
    var scheduleData = kvStore.getDefault("automation", [])
    for (var i = 0; i < scheduleData.length; i++) {
        scheduleData[i]["schedulingInformation"]["startTime"] = convertTime(scheduleData[i]["schedulingInformation"], "startTime");
    }
    var empSchedule = data.Schedule.Default();
    empSchedule["schedulingInformation"]["startTime"] = convertTime(empSchedule["schedulingInformation"], "startTime");

    res.locals = {
        imageContainers: storage.listContainers(),
        scheduleData: scheduleData,
        emptySchedule: empSchedule,
    };

    res.render('automation', { title: res.__('Automation') });
});

function convertTime(data, entry) {
    if (entry in data) {
        return new Time(data[entry]).toString();
    } else {
        return new Time(0, 0).toString();
    }
}

router.post('/save', upload.none(), async function(req, res) {
    var reqData = req.body;
    await kvStore.load();

    var schedules = [];
    if ("SCHEDULE_NAME" in reqData) {
        for (const [index, v] of Object.entries(reqData.SCHEDULE_NAME)) {
            var extractedData = {};
            for (const [category, categoryData] of Object.entries(reqData)) {
                extractedData[category] = index in categoryData ? categoryData[index] : undefined;
            }
            schedules.push(data.Schedule.FromData(extractedData));
        }
    }

    kvStore.set("automation", schedules);
    await kvStore.save();

    res.redirect('/automation');
});

router.post('/apply', async function(req, res) {
    await scheduler.reschedule(true);
    res.redirect('/automation');
});

module.exports = router;
