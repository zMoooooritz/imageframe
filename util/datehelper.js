
const fetch = require('node-fetch');

const TIMEZONE_OFFSET = 1
// ugly as hell
// cron does handle the dates time zone aware
// my code does not, since the user is inputting time zone'd data I need to offset it here in order for the calculations to work
// quite possibly there is a proper and nice solution for this problem
// but I don't want to doeal with time zone issues anymore...

class DateHelper {

    async getScheduleInformation(daily_start, daily_end, holiday_start, holiday_end) {
        var daily_dates = this.getNextDailyDates();
        var holiday_dates = await this.getNextHolidayDates();
        holiday_dates = holiday_dates.concat(this.getNextSundayDates());

        var start_dates = [];
        var end_dates = [];

        if (daily_start !== undefined && daily_end !== undefined) {
            daily_dates.forEach((day) => {
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), daily_start.hours, daily_start.minutes, 0, 0);
                start_dates.push(date);
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), daily_end.hours, daily_end.minutes, 0, 0);
                end_dates.push(date);
            });
        }
        if (holiday_start !== undefined && holiday_end !== undefined) {
            holiday_dates.forEach((day) => {
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), holiday_start.hours, holiday_start.minutes, 0, 0);
                start_dates.push(date);
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), holiday_end.hours, holiday_end.minutes, 0, 0);
                end_dates.push(date);
            });
        }
        if (start_dates.length == 0) {
            return {
                nothingToDo: true,
                shouldBeActive: false,
                offTime: undefined,
                onTime: undefined
            };
        }

        start_dates.sort((date1, date2) => date1 - date2);
        end_dates.sort((date1, date2) => date1 - date2);

        const now = new Date();
        now.setHours(now.getHours() + TIMEZONE_OFFSET);
        var counter = 0;
        var lastStart = -1;
        for (let i = 0; i < start_dates.length; i++) {
            if (start_dates[i] < now) {
                lastStart = i;
                counter += 1;
            }
            if (end_dates[i] < now) {
                counter -= 1;
            }
        }

        return {
            nothingToDo: false,
            shouldBeActive: counter > 0,
            offTime: end_dates[lastStart],
            onTime: start_dates[lastStart+1]
        }
    }

    getNextDailyDates() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var dates = [today];
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        dates.push(tomorrow);
        return dates;
    }

    async getNextHolidayDates() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        const data = await fetch(getFeiertageURL());
        if (!data.ok) {
            return [];
        }
        var dates = [];
        var json = await data.json();
        for (const day of json["feiertage"]) {
            var date = new Date(this.convertStringToDate(day["date"]));
            date.setHours(0, 0, 0, 0);

            if ( today == date ) {
                dates.push(today);
            }
            if ( today < date ) {
                dates.push(date);
                break;
            }
        };
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

}

function getFeiertageURL() {
    const year = new Date().getFullYear();
    return `https://get.api-feiertage.de?years=${year}&states=bw`
}

var dateHelper = new DateHelper();
module.exports = dateHelper
