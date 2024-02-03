
const retryFetch = require('./fetcher');
const data = require('./data');

const TIMEZONE_OFFSET = 1

// ugly as hell
// cron does handle the dates time zone aware
// my code does not, since the user is inputting time zone'd data I need to offset it here in order for the calculations to work
// quite possibly there is a proper and nice solution for this problem
// but I don't want to deal with time zone issues anymore...

class DateHelper {

    async getNextEvent(schedules) {
        var holidayDates = await this.getNextHolidayDates();

        if (Array.isArray(schedules)) {
            var events = [];
            for (const schedule of schedules) {
                var startDates = [];
                var endDates = [];

                const si = schedule.schedulingInformation;
                var startTime = si.startTime;
                var duration = si.duration;

                var durationHours = duration / 60;
                var durationMinutes = duration % 60;
                var endTime = {
                    "hours": (startTime.hours + durationHours) % 24,
                    "minutes": (startTime.minutes + durationMinutes) % 60
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
            now.setHours(now.getHours() + TIMEZONE_OFFSET);
            for (const event of events) {
                if (event.date > now)
                    return event
            }

            return new data.Event(new Date(), data.EventActions.NONE, {})
        } else {
            return new data.Event(new Date(), data.EventActions.NONE, {})
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
