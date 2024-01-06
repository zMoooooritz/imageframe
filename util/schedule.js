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
        await this.scheduleNextEvent(true)
    }

    async scheduleNextEvent(executeNow) {
        await kvstore.load();
        const daily_start = kvstore.get("daily_start_time");
        const daily_end = kvstore.get("daily_end_time");
        const holiday_start = kvstore.get("holiday_start_time");
        const holiday_end = kvstore.get("holiday_end_time");

        const { nextEventTime, nextEventType, shouldBeActive } = await dateHelper.getScheduleInformation(daily_start, daily_end, holiday_start, holiday_end);

        if (nextEventTime === undefined) {
            system.displayOff();
            return;
        }

        if (executeNow) {
            this.executeEvent(shouldBeActive);
        }

        this.scheduleEvent(nextEventTime, nextEventType === "start");
    }

    executeEvent(shouldBeActive) {
        if (shouldBeActive) {
            system.displayOn();
            if (!slideshow.isActive) {
                slideshow.start();
            }
        } else {
            system.displayOff();
            slideshow.stop();
        }
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

    scheduleEvent(date, shouldBeActive) {
        console.log("Schedule at: " + new Date(date).toISOString(), "- Event:", shouldBeActive === true ? "ON" : "OFF");
        const job = new CronJob(
            date,
            async function() {
                console.log("Event:", shouldBeActive === true ? "ON" : "OFF", "at", new Date(date).toISOString());
                this.executeEvent(shouldBeActive);
                await this.scheduleNextEvent(false);
            },
            null,
            null
        );
        job.start();
        this.activeSchedules.push(job);
    }

}

const schedule = new Schedule();
module.exports = schedule;
