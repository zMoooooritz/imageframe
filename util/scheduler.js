var kvStore = require('./kvstore');
var system = require('./system');
var data = require('./data');
var CronJob = require('cron').CronJob;
var dateHelper = require('./datehelper');
var slideshow = require('./slideshow');

class Scheduler {

    constructor() {
        this.activeEvent = undefined;
    }

    async init() {
        await this.reschedule()
    }

    async reschedule() {
        await kvStore.load();
        var schedules = kvStore.getDefault("automation", []);

        const event = await dateHelper.getNextEvent(schedules);

        if (event.action === data.EventActions.NONE) {
            system.displayOff();
            return;
        }

        this.scheduleEvent(event);
    }

    async executeEvent(event) {
        var eventData = event.data;

        if (event.action == data.EventActions.START) {
            system.displayOn();
            if (eventData.mode == 'slide') {
                if (!slideshow.isActive) {
                    await slideshow.start(eventData.data);
                }
            }
        }

        if (event.action == data.EventActions.STOP) {
            system.displayOff();
            if (eventData.mode == 'slide') {
                await slideshow.stop();
            }
        }
    }

    async integrateChanges() {
        this.reset();
        await this.init();
    }

    reset() {
        if (this.activeEvent !== undefined)
            this.activeEvent.stop();
        this.activeEvent = undefined;
    }

    scheduleEvent(event) {
        console.log("Schedule at:", new Date(event.date).toISOString(), "- Event:", event.action);
        this.activeEvent = createNewJob(event);
    }

}

const scheduler = new Scheduler();

function createNewJob(event) {
    const job = new CronJob(
        event.date,
        async function() {
            console.log("Event:", event.action, "at", new Date(event.date).toISOString());
            scheduler.executeEvent(event);
            await scheduler.reschedule();
        },
        null,
        null
    );
    job.start();
    return job;
}

module.exports = scheduler
