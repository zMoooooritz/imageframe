var kvstore = require('./kvstore');
var system = require('./system');
var CronJob = require('cron').CronJob;
var dateHelper = require('./datehelper');
var slideshow = require('./slideshow');

const EventType = Object.freeze({
    START: "start",
    END: "end",
})


const ScheduleType = Object.freeze({
    EVERYDAY: "everyday",
    WORKDAY: "workday",
    HOLIDAY: "holiday",
})

function toStorageKey(schedule, event) {
    if (event == EventType.START) {
        return schedule + "_start_time";
    } else {
        return schedule + "_end_time";
    }
}

class Schedule {

    constructor() {
        this.activeSchedules = [];
    }

    async init() {
        await this.scheduleNextEvent(true)
    }

    async scheduleNextEvent(executeNow) {
        await kvstore.load();
        var data = {
            estart: kvstore.get(toStorageKey(ScheduleType.EVERYDAY, EventType.START)),
            eend: kvstore.get(toStorageKey(ScheduleType.EVERYDAY, EventType.END)),
            wstart: kvstore.get(toStorageKey(ScheduleType.WORKDAY, EventType.START)),
            wend: kvstore.get(toStorageKey(ScheduleType.WORKDAY, EventType.END)),
            hstart: kvstore.get(toStorageKey(ScheduleType.HOLIDAY, EventType.START)),
            hend: kvstore.get(toStorageKey(ScheduleType.HOLIDAY, EventType.END)),
        }

        const { nextEventTime, nextEventType } = await dateHelper.getScheduleInformation(data);

        if (nextEventTime === undefined) {
            system.displayOff();
            return;
        }

        const shouldBeActive = nextEventType === "start"

        if (executeNow) {
            this.executeEvent(!shouldBeActive);
        }

        this.scheduleEvent(nextEventTime, shouldBeActive);
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

    async setSchedule(schedule, start_time, end_time) {
        await kvstore.load();
        kvstore.set(toStorageKey(schedule, EventType.START), start_time);
        kvstore.set(toStorageKey(schedule, EventType.END), end_time);
        await kvstore.save();

        await this.integrateChanges();
    }

    async getSchedule(schedule) {
        await kvstore.load();
        const start = kvstore.get(toStorageKey(schedule, EventType.START));
        const end = kvstore.get(toStorageKey(schedule, EventType.END));
        return { start: start, end: end };
    }

    async clearSchedule(schedule) {
        kvstore.del(toStorageKey(schedule, EventType.START));
        kvstore.del(toStorageKey(schedule, EventType.END));
        await kvstore.save();
    }

    async clear() {
        await kvstore.load();
        Object.values(ScheduleType).forEach((stype) => {
            kvstore.del(toStorageKey(stype, EventType.START));
            kvstore.del(toStorageKey(stype, EventType.END));
        });
        await kvstore.save();

        this.resetSchedules();
    }

    resetSchedules() {
        this.activeSchedules.forEach((job) => job.stop());
        this.activeSchedules = [];
    }

    scheduleEvent(date, shouldBeActive) {
        console.log("Schedule at:", new Date(date).toISOString(), "- Event:", shouldBeActive === true ? "ON" : "OFF");
        const job = createNewJob(date, shouldBeActive);
        this.activeSchedules.push(job);
    }

}

const schedule = new Schedule();

function createNewJob(date, shouldBeActive) {
    const job = new CronJob(
        date,
        async function() {
            console.log("Event:", shouldBeActive === true ? "ON" : "OFF", "at", new Date(date).toISOString());
            schedule.executeEvent(shouldBeActive);
            await schedule.scheduleNextEvent(false);
        },
        null,
        null
    );
    job.start();
    return job;
}

module.exports = {
    schedule,
    ScheduleType
}
