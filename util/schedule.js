var kvstore = require('./kvstore');
var system = require('./system');
var CronJob = require('cron').CronJob;
var dateHelper = require('./datehelper');
var slideshow = require('./slideshow');

class Schedule {

    constructor() {
        this.activeSchedules = [];
    }

    async init() {
        await kvstore.load();
        const daily_start = kvstore.get("daily_start_time");
        const daily_end = kvstore.get("daily_end_time");
        const holiday_start = kvstore.get("holiday_start_time");
        const holiday_end = kvstore.get("holiday_end_time");
        const show_on_startup = kvstore.getDefault("show_on_startup", false);
        kvstore.set("show_on_startup", false);
        await kvstore.save();

        const {nothingToDo, shouldBeActive, offTime, onTime} = await dateHelper.getScheduleInformation(daily_start, daily_end, holiday_start, holiday_end);

        if (show_on_startup) {
            slideshow.start();
        }

        if (nothingToDo) {
            system.displayOff();
            return;
        }

        if (shouldBeActive) {
            if (!slideshow.isActive) {
                slideshow.start();
            }
            this.scheduleDisplayOff(offTime);
        } else {
            if (!show_on_startup) {
                system.displayOff();
            }
        }
        this.scheduleDisplayOn(onTime);
    }

    async integrateChanges() {
        this.resetSchedules();
        await this.init();
    }

    async setDailySchedule(start_time, end_time) {
        await kvstore.load();
        kvstore.set("daily_start_time", start_time);
        kvstore.set("daily_end_time", end_time);
        await kvstore.save();

        await this.integrateChanges();
    }

    async getDailySchedule() {
        await kvstore.load();
        const start = kvstore.get("daily_start_time");
        const end = kvstore.get("daily_end_time");
        return { dstart: start, dend: end };
    }

    async setHolidaySchedule(start_time, end_time) {
        await kvstore.load();
        kvstore.set("holiday_start_time", start_time);
        kvstore.set("holiday_end_time", end_time);
        await kvstore.save();

        await this.integrateChanges();
    }

    async getHolidaySchedule() {
        await kvstore.load();
        const start = kvstore.get("holiday_start_time");
        const end = kvstore.get("holiday_end_time");
        return { hstart: start, hend: end };
    }

    async clear() {
        await kvstore.load();
        kvstore.del("daily_start_time");
        kvstore.del("daily_end_time");
        kvstore.del("holiday_start_time");
        kvstore.del("holiday_end_time");
        await kvstore.save();

        this.resetSchedules();
    }

    resetSchedules() {
        this.activeSchedules.forEach((job) => job.stop());
        this.activeSchedules = [];
    }

    scheduleDisplayOn(date) {
        console.log("Display schedule on at: " + new Date(date).toISOString());
        const job = new CronJob(
            date,
            function() {
                console.log("Display on at: " + new Date().toISOString());
                system.displayOn();
            },
            null,
            null
        )
        job.start()
        this.activeSchedules.push(job);
    }

    scheduleDisplayOff(date) {
        console.log("Display schedule off at: " + new Date(date).toISOString());
        const job = new CronJob(
            date,
            function() {
                console.log("Display off at: " + new Date().toISOString());
                system.displayOff();
            },
            null,
            null
        )
        job.start()
        this.activeSchedules.push(job);
    }
}

const schedule = new Schedule();
module.exports = schedule
