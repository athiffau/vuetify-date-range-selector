import moment from 'moment'
import { dateToISOStr, deltaDate, validateDate } from '../../../mixins/DateHelper.js'

/**
 * Use moment.js to return quarter based on a date
 * 
 * @param  {String | null}  date    Return the quarter for a specific date
 *                                  If string is invalid or date is null will
 *                                  return current quarter
 * 
 * @return {Numeric}                Returns an integer between 1 and 4
 */
/*private*/ function momentCurrentQuarter (date = null) {
    if (date !== null && typeof date === 'string') {
        return moment(date, format).utc().quarter()
    }

    return moment().quarter()
}

/**
 * Use moment.js to create an array of objects each containing the start and end date
 * of the 52 weeks of the year.
 * 
 * @param  {Any}    date Accepts a Date object, a string formatted as YYYY-MM-DD or a 
 *                       integer representing the year. If the date provided is invalid
 *                       the current date will be use.
 * 
 * @return {Array}       Array of 52 objects each having a `start` and `end` element 
 *                       representing the start and end date of the week.
 */
/*prvate*/ function momentWeekNumbers (date) {
    let _d = validateDate(date)
    let _dy = _d ? _d.getFullYear() : moment().year()

    let _data = []
    let _weeks = moment().weeksInYear([_dy])
    _data[0] = {year: _dy}
    for (let _x=1; _x<=_weeks; _x++) {
        let _wStart = moment([_dy]).week(_x).startOf('week')
        let _wEnd = moment([_dy]).week(_x).endOf('week').subtract(1, 'days')  //TODO: test with .utc() instead of .subtract()
        _data[_x] = {start: _wStart, end: _wEnd}
    }
    return _data
}

/**
 * Use moment.js to create an array of objects each containing the start and end date
 * of the 12 months of the year.
 * 
 * @param  {Any}    date Accepts a Date object, a string formatted as YYYY-MM-DD or a 
 *                       integer representing the year. If the date provided is invalid
 *                       the current date will be use.
 * 
 * @return {Array}       Array of 12 objects each having a `start` and `end` element
 *                       representing the start and end date of the month.
 */
/*private*/ function momentMonthNumbers (date) {
    let _d = validateDate(date)
    let _dy = _d ? _d.getFullYear() : moment().year()

    let _data = []
    _data[0] = {year: _dy}
    for (let _x=0; _x<12; _x++) {
        let _wStart = moment([_dy]).month(_x).startOf('month')
        let _wEnd = moment([_dy]).month(_x).endOf('month').subtract(1, 'days')  //TODO: test with .utc() instead of .subtract()
        _data[_x] = {start: _wStart, end: _wEnd}
    }

    return _data
}

/**
 * Use moment.js to create an array of objects each containing the start and end date
 * of the 4 quarters of the year.
 * 
 * @param  {Numeric}    year    Integer representing year. Will use current year if 
 *                              invalid or null.
 * 
 * @return {Array}              Array of 4 objects each having a `start` and `end` element
 *                              representing the start and end date of the quarter
 */
/*pirvate*/ function momentQuarterNumbers (year) {
    let _year = parseInt(year) || moment().year()
    let _data = []
    _data[0] = {year: _year}
    for (let _x=1; _x<=4; _x++) {
        let _wStart = moment([_year]).quarter(_x).startOf('quarter')
        let _wEnd = moment([_year]).quarter(_x).endOf('quarter').subtract(1, 'days') //TODO: test with .utc() instead of .subtract()
        _data[_x] = {start: _wStart, end: _wEnd}
    }

    return _data
}

/**
 * Use moment.js to create an array of objects each containing the start and end date
 * of teh 13 4-week periods of the year.
 * 
 * @param  {Numeric} year Periods for the requested year. If omitted, will return
 *                        periods for the current year.
 * 
 * @return {Array}        Array of 13 objects each containing a start and end element
 */
/*private*/ function momentPeriodNumbers (year = null) {
    let _year = parseInt(year) || moment().year()
    let _data = []
    _data[0] = {year: _year}
    let _weeks = momentWeekNumbers( year )
    let _pn = 0
    for (let _x=1; _x<=52; _x += 4) {
        _pn++
        let _wStart = _pn === 1 ? dateToISOStr(_weeks[_x].start) : dateToISOStr( moment(_weeks[_x].start).add(1,'days') )
        let _wEnd = dateToISOStr( moment(_weeks[_x+3].end).add(1,'days') )  //TODO: test with .utc() instead of .add()
        _data[_pn] = {start: _wStart, end: _wEnd}
    }

    return _data
}

/**
 * Wrapper over the moment.js `startOf` function
 * 
 * @param  {String} opt  Moment supports the following mutators:
 *                       'year', 'month', 'quarter', 'week', 'isoweek'
 *                       'day', 'date', 'hour', 'minute', 'second'
 * @param  {String} date Specify the date to mutate from; if omitted will
 *                       use the current date
 * 
 * @return {Object}      Moment.js date object
 */
/*private*/ function momentStartOf (opt, date) {
    let _d = validateDate(date)  //returns null or validate date
    let _date = _d ? _d : moment()
    return moment(_date).startOf(opt)
}

/**
 * Wrapper over the moment.js `endOf` function
 * 
 * @param  {String} opt  Moment supports the following mutators:
 *                       'year', 'month', 'quarter', 'week', 'isoweek'
 *                       'day', 'date', 'hour', 'minute', 'second'
 * @param  {String} date Specify the date to mutate from; if omitted will
 *                       use the current date
 * 
 * @return {Object}      Moment.js date object
 */
/*private*/ function momentEndOf (opt, date) {
    let _d = validateDate(date)  //returns null or validate date
    let _date = _d ? _d : moment()               
    return moment(_date).endOf(opt)
}

/**
 * Wrapper over the momentGetQuarterNumbers function
 * 
 * momentGetQuarterDates retrieves the dates for the specified quarter
 * 
 * @param  {Numeric}    year          Integer representing the target year
 *                                    If omitted will return the current year
 * @param  {Numeric}    quarterNumber Integer representing the target quarter
 *                                    If omitted will return the current quarter
 *                                    Supports the following integers:
 *                                    -1 - previous quarter
 *                                     0 - current quarter
 *                                     1,2,3,4 - specific quarter
 * @return {String[]}                 Array of 2 strings representing the start
 *                                    and end dates of the requested year/quarter   
 */
/*private*/ function momentGetQuarterDates (year, quarterNumber) {
    //console.log(`DateAPI.moment->momentGetQuarterDates(${year}, ${quarterNumber})`)
    let _qn = 1
    if (quarterNumber === 0) {
        _qn = momentCurrentQuarter(year)
        // console.log(`Quarter requested was 0 for ${year} which returned ${_qn}`)
    } else if (quarterNumber === -1) {
        _qn = momentCurrentQuarter(year)
        // console.log(`Quarter requested was -1 for ${year} and since we are currently Q${_qn} we need to roll back to previous year, Q4`)
        if (_qn === 1) {
            return momentGetQuarterDates( dateToISOStr( moment().year(year).subtract(1, 'years') ), 4)
        }
    } else {
        _qn = parseInt(quarterNumber) || 1
    }
    
    let _data = momentQuarterNumbers(year)

    if (_data[_qn]) {
        return [ dateToISOStr(_data[_qn].start), dateToISOStr(_data[_qn].end) ]
    }

    return []
}

/**
 * Wrapper over the momentGetPeriodNumbers function
 * 
 * momentGetPeriodDates retrieves the dates for the specified period
 * 
 * @param  {String}             date         Allows for mutating the moment to a specific year
 * @param  {Numeric | String}   periodNumber Integer from 1-13 representing the target period
 *                                           
 * @return {String[]}                        Array of 2 strings representing the start
 *                                           and end dates of the requested year/period
 */
/*private*/ function momentGetPeriodDates (date, periodNumber) {
    let _pn = parseInt(periodNumber) || 1
    let _data = momentPeriodNumbers(date)

    return [ dateToISOStr(_data[_pn].start), dateToISOStr(_data[_pn].end) ]
}

//TODO: how to use interface with mixins ???

export default {
    methods: {
        /**
         * dateStartPrevWeek returns the date of the start of the previous week
         * from the week corresponding to the supplied date or the current date if omitted.
         * 
         * @param  {Any}    date Javascript Date object, string formatted as YYYY-MM-DD
         *                       or integer representing the year. If omitted, the current
         *                       date will be used.
         * @return {Object}      moment.js date object
         */
        dateStartPrevWeek (date = null) {
            let _d = validateDate(date)
            //let _date = _d ? _d : moment()
            let _dw = this.dateStartOfWeek(dateToISOStr(_d))
            _dw.subtract(7, 'days')
            return _dw
        },

        /**
         * dateEndPrevWeek returns the date of the end of the previous week from
         * the week corresponding to the supplied date or the current date if omitted.
         * 
         * @param  {Any}    date    Javascript Date object, string formatted as YYYY-MM-DD
         *                          or integer representing the year. If omitted, the current
         *                          date will be used.
         * @return {Object}         moment.js date object
         */
        dateEndPrevWeek (date = null) {
            let _d = validateDate(date)
            let _dw = this.dateEndOfWeek(dateToISOStr(_d))
            _dw.subtract(7, 'days')
            return _dw
        },

        /**
         * dateStartOfWeek returns the date of the start of the week for the supplied date.
         * If the date is omitted the current date will be used.
         * 
         * @param  {Any}     date    Javascript Date object, string formatted as YYYY-MM-DD
         *                           or integer representing the year. If omitted, the current
         *                           date will be used.
         * @return {Object}          moment.js date object  
         */
        dateStartOfWeek (date = null) {
            let _t = momentStartOf('week', date)
            return _t
        },

        /**
         * dateEndOfWeek returns the date of the end of the week for the supplied date.
         * If the date is omitted the current date will be used.
         * 
         * @param  {Any}    date    Javascript Date object, string formatted as YYYY-MM-DD
         *                          or integer representing the year. If omitted, the current
         *                          date will be used.
         * @return {Object}         moment.js date object
         */
        dateEndOfWeek (date = null) {
            let _t = momentEndOf('week', date).subtract(1, 'days')  //TODO: test with .utc() instead of .subtract()
            return _t
        },

        /**
         * dateStartOfMonth returns the date of the start of the month for the supplied date.
         * If the date is omitted the current date will be used.
         * 
         * @param  {Any}    date    Javascript Date object, string formatted as YYYY-MM-DD
         *                          or integer representing the year. If omitted, the current
         *                          date will be used.
         * @return {Object}         moment.js date object
         */
        dateStartOfMonth (date = null) {
            let _t = momentStartOf('month', date)
            return _t
        },

        /**
         * dateEndOfMonth returns the date of the end of the month for the supplied date.
         * If the date is omitted the current date will be used.
         * 
         * @param  {Any}    date    Javascript Date object, string formatted as YYYY-MM-DD
         *                          or integer representing the year. If omitted, the current
         *                          date will be used.
         * @return {Object}         moment.js date object
         */
        dateEndOfMonth (date) {
            let _d = validateDate(date)
            let _t = momentEndOf('month', _d.toISOString()).subtract(1,'days') //TODO: test with .utc() instead of .subtract()
            return _t
        },

        /**
         * getWeekNumbers is a wrapper for the momentWeekNumbers function.
         * 
         * @param  {Any}    date    Javascript Date object, string formatted as YYYY-MM-DD
         *                          or integer representing the year. If omitted, the current
         *                          date will be used.
         * @return {Array}          Array of 52 object each having a `start` and `end` element
         *                          representing the start and end date of the week      
         */
        getWeekNumbers (date = null) {                
            return momentWeekNumbers(date)
        },

        /**
         * getMonthShortNames returns a localized list of abreviated month names
         * 
         * @param  {String}     locale  String corresponding to the requested language
         * @return {String[]}           Array of strings 
         */
        getMonthShortNames (locale) {
            if (!locale) locale = 'en'
            return Array.apply(0, Array(12)).map(function(_,i){return moment().locale(locale).month(i).format('MMM')})
        },

        /**
         * getMonthLongNames returns a localized list of month names
         * 
         * @param  {String}     locale  String corresponding to the requested language
         * @return {String[]}           Array of strings
         */
        getMonthLongNames (locale) {
            if (!locale) locale = 'en'
            //console.log('DateAPI.moment.getMonthLongNames: ',locale)
            return Array.apply(0, Array(12)).map(function(_,i){return moment().locale(locale).month(i).format('MMMM')})
        },

        /**
         * getWeekDates returns the start and end dates for the specified year/week number
         * 
         * @param  {Any}                date        Javascript Date object, string formatted as YYYY-MM-DD
         *                                          or integer representing the year. If omitted, the current
         *                                          date will be used.
         * @param  {String | Numeric}   weekNumber  The requested week
         * @return {String[]}                       Array of 2 strings representing the start and end date of the week
         */
        getWeekDates (date = null, weekNumber = 1) {
            let _wn = parseInt(weekNumber) || 1
            let _data = momentWeekNumbers(date)

            return  [ dateToISOStr(_data[_wn].start), dateToISOStr(_data[_wn].end) ]             
        },

        /**
         * getPeriodDates returns the start and end date of the specified year/period number
         * 
         * @param {Any}                 date        Javascript Date object, string formatted as YYYY-MM-DD
         *                                          or integer representing the year. If omitted, the current
         *                                          date will be used. 
         * @param {String | Numeric}    periodNumber    The requested period 
         * @return {String[]}                       Array of 2 strings representing the start and end date of the period
         */
        getPeriodDates (date = null, periodNumber = 1) {
            let _pn = parseInt(periodNumber, 10) || 1
            let _data = momentPeriodNumbers(date)

            return [ dateToISOStr(_data[_pn].start), dateToISOStr(_data[_pn].end) ]
        },

        /**
         * getMonthDates returns the start and end date of the speicified year/month number
         * 
         * @param  {Any}                date        Javascript Date object, string formatted as YYYY-MM-DD
         *                                          or integer representing the year. If omitted, the current
         *                                          date will be used.
         * @param  {String | Numeric}   monthNumber The requested month
         * @return {String[]}                       Array of 2 strings representing the start and end date of the month           
         */
        getMonthDates (date = null, monthNumber = 1) {
            let _mn = parseInt(monthNumber) || 1
            let _data = momentMonthNumbers(date)

            return [ dateToISOStr(_data[_mn].start), dateToISOStr(_data[_mn].end) ]
        },

        /**
         * getQuarterDates returns the start and end date of the specified year/quarter
         * 
         * @param  {Any}                date        Javascript Date object, string formatted as YYYY-MM-DD
         *                                          or integer representing the year. If omitted, the current
         *                                          date will be used.
         * @param  {String | Numeric}   quarterNumber   The requested quarter
         * @return {String[]}                       Array of 2 strings representing the start and end date of the month
         */
        getQuarterDates (date = null, quarterNumber = 1) {
            let _qn = parseInt(quarterNumber) || 1
            return momentGetQuarterDates(date, _qn)
        },

        /**
         * getCurrentDate returns the day of the month based on a moment in time pointing to the requeste date
         * 
         * @param  {Object | String}     date     Javascript Date object or string matching 
         *                                        known ISO 8601 formats. If omitted, the current
         *                                        date will be used.
         * @return {Number}                       Date of the month
         */
        getCurrentDate (date = null) {
            let _mit = moment(date ? date : undefined)
            return _mit.date()
        },

        /**
         * getCurrentWeek returns the week number based on a moment in time pointing to the requested date
         * 
         * @param  {Object | String}    date    Javascript Date object or string matching
         *                                      known ISO 8601 formats. If omitted, the current
         *                                      date will be used.
         * @param  {String}             format  Specifies the format of the date if a string is provided.
         * @return {Number}                     Week number
         */
        getCurrentWeek (date = null, format = '') {
            let _mit = moment(date ? date : undefined, format)
            return _mit.week()
        },

        /**
         * getCurrentPeriod returns the period number based on a moment in time pointing to the requested date
         * 
         * @param  {Object | String}    date    Javascript Date object or string matching
         *                                      known ISO 8601 formats. If omitted, the current
         *                                      date will be used.
         * @param  {String}             format  Specifies the format of the date if a string is provided.
         * @return {Number}                     Period number
         */
        getCurrentPeriod (date = null, format = '') {
            let _data = null
            let _now = moment()

            if (date !== null && typeof date === 'string') {
                _data = momentPeriodNumbers(moment(date,format).year())
            } else {
                _data = momentPeriodNumbers()
            }

            let _index = 0
            for (let period of _data) {
                if (_index !== 0) {
                    if (deltaDate(period.start, dateToISOStr(_now)) > 0 && deltaDate(dateToISOStr(_now), period.end) > 0) {
                        break;
                    }
                }
                _index++
            }

            return _index
        },

        /**
         * getCurrentMonth returns the month number based on a moment in time pointing to the requested date
         * 
         * @param  {Object | String}    date    Javascript Date object or string matching
         *                                      known ISO 8601 formats. If omitted, the current
         *                                      date will be used.
         * @return {Number}                     Month number
         */
        getCurrentMonth (date = null) {
            let _mit = moment(date ? date : undefined)
            return _mit.month()
        },

        /**
         * getCurrentQuarter returns the quarter number based on a moment in time pointing to the requested date
         * 
         * @param  {Object | String}    date    Javascript Date object or string matching
         *                                      known ISO 8601 formats. If omitted, the current
         *                                      date will be used.
         * @return {Number}                     Quarter number
         */
        getCurrentQuarter (date = null) {
            return momentCurrentQuarter(date)
        },

        /**
         * getCurrentYear returns a year after attempting to validate the supplied date defaulting to the current
         * year if the supplied date is invalid.
         * 
         * @param  {Any}        date    Javascript Date object, string formatted as YYYY-MM-DD
         *                              or integer representing the year. If omitted, the current
         *                              date will be used.
         * @return {Number}             Year number
         */
        getCurrentYear (date = null) {
            //console.log('DateAPI.moment -> getCurrentYear()', date)
            let _mit
            if (typeof date === 'string') {
                if (date.includes('-')) {
                    _mit = moment(date)
                } else {
                    _mit = moment(date+'-01-01')
                }
            } else if (typeof date === 'number') {
                _mit = moment(date+'-01-01')
            } else {
                //console.log(typeof date)
                _mit = moment(date ? date : undefined)
            }
            //console.log(`getCurrentYear(${typeof date}: ${date}) is ${_mit.year()}`)
            return _mit.year()
        },

        /**
         * getDayOfWeek returns the day of the week based on a moment in time pointing to the requested date
         * 
         * @param  {Object | String}    date    Javascript Date object or string matching
         *                                      known ISO 8601 formats. If omitted, the current
         *                                      date will be used.
         * @return {Number}                     The day of the week where 0 = sunday
         */
        getDayOfWeek (date = null) {
            let _mit = moment(date ? date : undefined)
            return _mit.day()
        }
    }
}