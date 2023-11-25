
module.exports = class Time {

    constructor(arg1, arg2) {
        if (arg1 === undefined) {
            this.hours = -1;
            this.minutes = -1;
        } else if (typeof arg1 === 'object') {
            this.hours = parseInt(arg1.hours)
            this.minutes = parseInt(arg1.minutes)
        } else {
            this.hours = parseInt(arg1)
            this.minutes = parseInt(arg2)
        }
    }

    toString() {
        if (this.hours == -1)
            return "";
        return String(this.hours).padStart(2, "0") + ":" + String(this.minutes).padStart(2, "0") + ":00"
    }
}
