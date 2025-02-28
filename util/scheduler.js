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
        await this.reschedule(true)
    }

    async reschedule(executeNow) {
        await kvStore.load();
        var schedules = kvStore.getDefault("automation", []);

        const [currEvent, nextEvent] = await dateHelper.getCurrentAndNextEvent(schedules);

        if (currEvent.action === data.EventActions.NONE) {
            system.displayOff();
        }
        
        if (executeNow) {
            this.executeEvent(currEvent);
        }

        if (nextEvent.action !== data.EventActions.NONE)
            this.scheduleEvent(nextEvent);
    }

    executeEvent(event) {
        var eventData = event.data;

        if (event.action == data.EventActions.START) {
            system.displayOn();
            if (eventData.mode == 'slide') {
                slideshow.restart(eventData.data);
            }
        }

        if (event.action == data.EventActions.STOP) {
            system.displayOff();
            slideshow.stop();
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
        this.activeEvent = createNewJob(event);
    }
}

const scheduler = new Scheduler();

function createNewJob(event) {
    const job = new CronJob(
        event.date,
        async function() {
            scheduler.executeEvent(event);
            await scheduler.reschedule(false);
        },
        null,
        null
    );
    job.start();
    return job;
}

module.exports = scheduler
