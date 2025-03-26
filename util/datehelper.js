
const retryFetch = require('./fetcher');
const data = require('./data');

class DateHelper {

    async getCurrentAndNextEvent(schedules) {
        var holidayDates = await this.getNextHolidayDates();
        const noneEvent = new data.Event(new Date(), data.EventActions.NONE, {})

        if (Array.isArray(schedules)) {
            var events = [];
            for (const schedule of schedules) {
                var startDates = [];
                var endDates = [];

                const si = schedule.schedulingInformation;
                var startTime = si.startTime;
                var duration = si.hours * 60 + si.minutes;

                var endTime = {
                    "hours": (startTime.hours + si.hours) % 24,
                    "minutes": (startTime.minutes + si.minutes) % 60
                }
                var daysOffset = Math.ceil(duration / 60 / 24);

                var today = new Date();
                today.setHours(0, 0, 0, 0);
                startDates = this.calculatePossibleTimes(si, today, holidayDates, startTime);
                var date = new Date(today);
                date.setDate(date.getDate() - daysOffset);
                endDates = this.calculatePossibleTimes(si, date, holidayDates, endTime);

                for (const sd of startDates) {
                    events.push(new data.Event(sd, data.EventActions.START, {"mode": schedule.modeName, "data": schedule.modeData}))
                }
                for (const ed of endDates) {
                    events.push(new data.Event(ed, data.EventActions.STOP, {}))
                }
            }

            events.sort((e1, e2) => e1.date - e2.date);

            const now = new Date();

            var activeSchedules = 0;
            var lastStartEvent = noneEvent;
            for (const event of events) {
                if (event.date > now) {
                    if (activeSchedules > 0)
                        return [lastStartEvent, event]
                    else
                        return [noneEvent, event]
                }

                if (event.action == data.EventActions.START) {
                    activeSchedules += 1;
                    lastStartEvent = event;
                }
                if (event.action == data.EventActions.STOP)
                    activeSchedules = Math.max(activeSchedules-1, 0);
            }

            return [lastStartEvent, noneEvent];
        } else {
            return [noneEvent, noneEvent];
        }
    }

    calculatePossibleTimes(si, start, holidayDates, time) {
        var days = [];
        var end = new Date(start);
        end.setDate(end.getDate() + 7);
        for (let i = 0; i < 8; i++) {
            var dt = new Date(start)
            dt.setDate(dt.getDate() + i);
            var dayName = data.DAYS[dt.getDay()];
            if (dayName in si.days && si.days[dayName])
                days.push(dt);
        }

        var relevantHolidayDates = holidayDates.filter(function(el) {
            var dt = new Date(el);
            return start <= dt && dt <= end;
        });

        if (si.holidays == 'on') {
            days = relevantHolidayDates.concat(days)
                .map(function (date) { return date.getTime() })
                .filter(function (date, i, array) {
                    return array.indexOf(date) === i;
                })
                .map(function (time) { return new Date(time) });
        } else if (si.holidays == 'ignore') {
            // nothing todo
        } else if (si.holidays == 'off') {
            days = days.filter( function(el) {
                return relevantHolidayDates.map(Number).indexOf(+el) < 0;
            });
        }

        var times = [];
        for (var day of days) {
            times.push(this.constructDate(day, time));
        }
        return times;
    }

    async getNextHolidayDates() {
        const thisYear = new Date().getFullYear();
        const nextYear = thisYear + 1;
        const years = [ thisYear, nextYear ].join(",");

        return retryFetch(getFeiertageURL(years), {}, 3, 1000)
            .then((response) => response.json())
            .then(data => {
                return this.parseFeiertagData(data)
            })
            .catch(error => {
                console.error(error);
                return [];
            })
    }

    parseFeiertagData(data) {
        var dates = [];
        for (const day of data["feiertage"]) {
            var date = new Date(this.convertStringToDate(day["date"]));
            dates.push(date);
        }
        return dates;
    }

    convertStringToDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    constructDate(day, time) {
        return new Date(day.getFullYear(), day.getMonth(), day.getDate(), time.hours, time.minutes, 0, 0);
    }
}

function getFeiertageURL(yearSelector) {
    return `https://get.api-feiertage.de?years=${yearSelector}&states=bw`
}

var dateHelper = new DateHelper();
module.exports = dateHelper
