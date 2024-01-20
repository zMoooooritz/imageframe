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
            estart: await this.getTime(ScheduleType.EVERYDAY, EventType.START),
            eend: await this.getTime(ScheduleType.EVERYDAY, EventType.END),
            wstart: await this.getTime(ScheduleType.WORKDAY, EventType.START),
            wend: await this.getTime(ScheduleType.WORKDAY, EventType.END),
            hstart: await this.getTime(ScheduleType.HOLIDAY, EventType.START),
            hend: await this.getTime(ScheduleType.HOLIDAY, EventType.END),
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

    async getTime(scheduleType, eventType) {
        const scheduleData = kvstore.get(scheduleType);

        if (scheduleData === undefined) {
            return undefined;
        }

        return scheduleData[eventType];
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
        kvstore.set(schedule, {
            [EventType.START]: start_time,
            [EventType.END]: end_time
        })
        await kvstore.save();

        await this.integrateChanges();
    }

    async getSchedule(schedule) {
        await kvstore.load();
        const scheduleData = kvstore.get(schedule);

        if (scheduleData === undefined) {
            return { start: undefined, end: undefined };
        }

        const start = kvstore.get(schedule)[EventType.START]
        const end = kvstore.get(schedule)[EventType.END]
        return { start: start, end: end };
    }

    async clearSchedule(schedule) {
        kvstore.del(schedule)
        await kvstore.save();
    }

    async clear() {
        await kvstore.load();
        Object.values(ScheduleType).forEach((stype) => {
            kvstore.del(stype);
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
