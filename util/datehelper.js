
const retryFetch = require('./fetcher');

const TIMEZONE_OFFSET = 1
// ugly as hell
// cron does handle the dates time zone aware
// my code does not, since the user is inputting time zone'd data I need to offset it here in order for the calculations to work
// quite possibly there is a proper and nice solution for this problem
// but I don't want to deal with time zone issues anymore...

class DateHelper {

    async getScheduleInformation(data) {
        var everyday_start = data.estart;
        var everyday_end = data.eend;
        var workday_start = data.wstart;
        var workday_end = data.wend;
        var holiday_start = data.hstart;
        var holiday_end = data.hend;

        var everyday_dates = this.getNextEverydayDates();
        var workday_dates = this.getNextWorkdayDates();
        var holiday_dates = await this.getNextHolidayDates();
        var sunday_dates = this.getNextSundayDates()
        holiday_dates = holiday_dates.concat(sunday_dates);

        var start_dates = [];
        var end_dates = [];

        if (everyday_start !== undefined && everyday_end !== undefined) {
            everyday_dates.forEach((day) => {
                const { startDate, endDate } = this.constructDates(day, everyday_start, everyday_end);
                start_dates.push(startDate);
                end_dates.push(endDate);
            });
        }
        if (workday_start !== undefined && workday_end !== undefined) {
            workday_dates.forEach((day) => {
                const { startDate, endDate } = this.constructDates(day, workday_start, workday_end);
                start_dates.push(startDate);
                end_dates.push(endDate);
            });
        }
        if (holiday_start !== undefined && holiday_end !== undefined) {
            holiday_dates.forEach((day) => {
                const { startDate, endDate } = this.constructDates(day, holiday_start, holiday_end);
                start_dates.push(startDate);
                end_dates.push(endDate);
            });
        }

        if (start_dates.length == 0) {
            return {
                nextEventTime: undefined,
                nextEventType: undefined,
            }
        }

        start_dates.sort((date1, date2) => date1 - date2);
        end_dates.sort((date1, date2) => date1 - date2);

        const now = new Date();
        now.setHours(now.getHours() + TIMEZONE_OFFSET);
        var counter = 0;
        var lastStart = -1;
        var lastEnd = -1;
        for (let i = 0; i < start_dates.length; i++) {
            if (start_dates[i] < now) {
                lastStart = i;
                counter += 1;
            }
            if (end_dates[i] < now) {
                lastEnd = i;
                counter -= 1;
            }
        }

        const start = start_dates[lastStart+1]
        const end = end_dates[lastEnd+1]

        if (start < end) {
            return {
                nextEventTime: start,
                nextEventType: "start",
            }
        }
        return {
            nextEventTime: end,
            nextEventType: "end",
        }
    }

    getNextEverydayDates() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var dates = [today];
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        dates.push(tomorrow);
        return dates;
    }

    isWorkday(day) {
        return day != 0 && day != 6;
    }

    getNextWorkdayDates() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var dates = [];
        while (dates.length < 2) {
            if (this.isWorkday(today.getDay())) {
                dates.push(new Date(today))
            }
            today.setDate(today.getDate() + 1);
        }
        return dates;
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
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var dates = [];
        for (const day of data["feiertage"]) {
            var date = new Date(this.convertStringToDate(day["date"]));
            date.setHours(0, 0, 0, 0);

            if ( today <= date ) {
                dates.push(date);
            }
            if ( today < date ) {
                break;
            }
        }
        return dates;
    }

    getNextSundayDates() {
        var sunday = new Date();
        sunday.setHours(0, 0, 0, 0);
        var dates = [];
        if (sunday.getDay() == 0) {
            dates.push(sunday);
        } 
        const daysUntilNextSunday = (7 - sunday.getDay()) % 7;
        var nextSunday = new Date();
        nextSunday.setHours(0, 0, 0, 0);
        nextSunday.setDate(nextSunday.getDate() + daysUntilNextSunday);
        dates.push(nextSunday);
        return dates;
    }

    convertStringToDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    constructDates(day, start, end) {
        const overlapsTwoDays = end.hours < start.hours || end.hours == start.hours && end.minutes < start.minutes;
        var endDay = new Date(day);
        if (overlapsTwoDays) {
            endDay.setDate(endDay.getDate() + 1);
        }
        return {
            "startDate": this.constructDate(day, start),
            "endDate": this.constructDate(endDay, end),
        };
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
