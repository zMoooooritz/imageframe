
const fetch = require('node-fetch');

const TIMEZONE_OFFSET = 1

class DateHelper {

    async getScheduleInformation(daily_start, daily_end, holiday_start, holiday_end) {
        var daily_dates = this.getNextDailyDates();
        var holiday_dates = await this.getNextHolidayDates();
        holiday_dates = holiday_dates.concat(this.getNextSundayDates());

        var start_dates = [];
        var end_dates = [];

        if (daily_start !== undefined && daily_end !== undefined) {
            daily_dates.forEach((day) => {
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), daily_start.hours + TIMEZONE_OFFSET, daily_start.minutes, 0, 0);
                start_dates.push(date);
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), daily_end.hours + TIMEZONE_OFFSET, daily_end.minutes, 0, 0);
                end_dates.push(date);
            });
        }
        if (holiday_start !== undefined && holiday_end !== undefined) {
            holiday_dates.forEach((day) => {
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), holiday_start.hours + TIMEZONE_OFFSET, holiday_start.minutes, 0, 0);
                start_dates.push(date);
                var date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), holiday_end.hours + TIMEZONE_OFFSET, holiday_end.minutes, 0, 0);
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
        today.setHours(TIMEZONE_OFFSET, 0, 0, 0);
        var dates = [today];
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(TIMEZONE_OFFSET, 0, 0, 0);
        dates.push(tomorrow);
        return dates;
    }

    async getNextHolidayDates() {
        var today = new Date();
        today.setHours(TIMEZONE_OFFSET, 0, 0, 0);

        const data = await fetch(getFeiertageURL());
        if (!data.ok) {
            return [];
        }
        var dates = [];
        var json = await data.json();
        for (const day of json["feiertage"]) {
            var date = new Date(this.convertStringToDate(day["date"]));
            date.setHours(TIMEZONE_OFFSET, 0, 0, 0);

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
        var today = new Date();
        today.setHours(TIMEZONE_OFFSET, 0, 0, 0);
        var dates = [];
        if (today.getDay() == 0) {
            dates.push(today);
        } 
        const daysUntilNextSunday = (7 - today.getDay()) % 7;
        today.setDate(today.getDate() + daysUntilNextSunday);
        dates.push(today);
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
