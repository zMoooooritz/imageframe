
const Time = require('../util/time');
const kvStore = require('../util/kvstore');

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

class Event {
    date
    action
    data

    constructor(date, action, data) {
        this.date = date;
        this.action = action;
        this.data = data;
    }
}

const EventActions = Object.freeze({
    START: "START",
    STOP: "STOP",
    NONE: "NONE"
})

class ModeSlide {
    directories
    doRandom
    showNames
    timePerSlide
    transitionTime

    constructor() {
        this.directories = [];
        this.doRandom = true;
        this.showNames = false;
        this.timePerSlide = 30;
        this.transitionTime = 200;
    }

    static async Configuration() {
        await kvStore.load();
        var data = kvStore.getDefault("defaults", []);
        data = data["slide"];
        var ms = new ModeSlide();
        if (data === undefined) {
            return ms;
        }
        ms.directories = parseArray(data, "directories");
        ms.doRandom = "doRandom" in data ? data["doRandom"] : false;
        ms.showNames = "showNames" in data ? data["showNames"] : false;
        ms.timePerSlide = parseInteger(data, "timePerSlide", 30);
        ms.transitionTime = parseInteger(data, "transitionTime", 200);
        return ms;
    }

    static FromData(data) {
        var ms = new ModeSlide();
        ms.directories = parseArray(data, "SLIDE_DIRS");
        ms.doRandom = "SLIDE_RANDOM" in data ? data["SLIDE_RANDOM"] == "on" : false;
        ms.showNames = "SLIDE_NAMES" in data ? data["SLIDE_NAMES"] == "on" : false;
        ms.timePerSlide = parseInteger(data, "SLIDE_IMAGE_TIME", 30);
        ms.transitionTime = parseInteger(data, "SLIDE_TRANSITION_TIME", 200);
        return ms;
    }

}

class SchedulingInformation {
    days
    holidays
    startTime
    hours
    minutes

    constructor() {
        this.days = {};
        this.holidays = "ignore";
        this.startTime = new Time(0, 0);
        this.hours = 0;
        this.minutes = 0;
        for (let day of DAYS) {
            this.days[day] = false;
        }
    }

    static FromData(data) {
        var si = new SchedulingInformation();
        for (let day of DAYS) {
            si.days[day] = containsValue(data, "DAYS_SELECTED", day);
        }
        si.holidays = "HOLIDAY_SELECTION" in data ? data["HOLIDAY_SELECTION"] : "ignore";
        si.startTime = parseTime(data, "START_TIME");
        si.hours = parseInteger(data, "DURATION_HOURS", 0);
        si.minutes = parseInteger(data, "DURATION_MINUTES", 0);
        return si;
    }
}

class Schedule {
    name
    schedulingInformation
    modeName
    modeData

    constructor(name, si, modeName, modeData) {
        this.name = name;
        this.schedulingInformation = si;
        this.modeName = modeName;
        this.modeData = modeData;
    }

    static Default() {
        return new Schedule("", new SchedulingInformation(), "", new ModeSlide());
    }

    static FromData(data) {
        var schedule = new Schedule();
        schedule.name = data["SCHEDULE_NAME"];
        schedule.schedulingInformation = SchedulingInformation.FromData(data);
        schedule.modeName = "SELECTED_MODE" in data ? data["SELECTED_MODE"] : "slide";
        schedule.modeData = ModeSlide.FromData(data);
        // if (schedule.modeName == "slide") {
        //     schedule.modeData = ModeSlide.FromData(data);
        // }
        return schedule;
    }
}

class SlideshowDuration {
    hours
    minutes

    static FromData(data) {
        var duration = new SlideshowDuration();
        duration.hours = parseInteger(data, "SLIDE_SHOW_HOURS", 0);
        duration.minutes = parseInteger(data, "SLIDE_SHOW_MINUTES", 0);
        return duration;
    }
}

function containsValue(data, entry, value) {
    return parseArray(data, entry).includes(value);
}

function parseArray(data, entry) {
    if (data === undefined || !(entry in data))
        return [];
    var dt = data[entry];
    if (dt === undefined)
        return [];
    if (typeof dt === 'string')
        dt = [dt];
    return dt
}

function parseTime(data, entry) {
    const def = new Time(0, 0);
    if (data === undefined || !(entry in data))
        return def;
    var time = data[entry];
    var hour = parseInt(time.split(":")[0], 10)
    var minute = parseInt(time.split(":")[1], 10)
    if (isNaN(hour) || isNaN(minute))
        return def;
    return new Time(hour, minute);
}

function parseInteger(data, entry, def) {
    if (data === undefined || !(entry in data))
        return def;
    var time = parseInt(data[entry], 10)
    if (isNaN(time) || time <= 0)
        return def;
    return time;
}

module.exports = {
    DAYS,
    Event,
    EventActions,
    ModeSlide,
    Schedule,
    SlideshowDuration
}
