    /**
     * dateFromStr converts a string to a Javascript Date object with the
     * ability to add and subtract days, months and years to the supplied 
     * string date
     *  
     * @param  {String} strDate    A date expressed as a string having one of these
     *                             formats: 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'
     * @param  {Number} deltaDay   [optional] Add or subtract a number of days
     * @param  {Number} deltaMonth [optional] Add or subtract a number of months
     * @param  {Number} deltaYear  [optional] Add or subtract a number of years
     * @return {Date | null}       Javascript Date object or `null`
     */
    export function dateFromStr (strDate, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
        if (typeof strDate === 'string') {
            let yr  = parseInt(strDate.substring(0,4))
            let mon = parseInt(strDate.substring(5,8))
            let dt  = parseInt(strDate.substring(8,10))

            let d = new Date(yr, mon-1, dt ? dt : 1)

            if (deltaDay !== 0) {
                d.setDate(d.getDate()+deltaDay)
            }

            if (deltaMonth !== 0) {
                d.setMonth(d.getMonth()+deltaMonth)
            }

            if (deltaYear !== 0) {
                d.setFullYear(d.getFullYear()+deltaYear)
            }
            return d
        }

        return null
    }

    /**
     * dateFromYear converts a year as string or number to a Javascript Date object
     * set at midnight January 1st.
     * 
     * @param {String | Number} year    A year expressed as YYYY
     * 
     * @return {Date}                   Javascript Date object
     *                                  If year is invalid format, Date will be equivalent
     *                                  to now()
     *  
     */
    export function dateFromYear (year) {
        let _d

        if (typeof year === 'number') {
            _d = new Date(year.toString())
        }

        if (typeof year === 'string') {
            _d = new Date(year)
        }

        if (_d && typeof _d.toString === 'function') { 
            return _d
        } else {
            return new Date()
        } 
    }

    /**
     * dateRangeText accepts a set of dates (2) as an array and returns a hyphenated
     * string.
     * 
     * @param {String[]} dates      Array of date strings in YYYY-MM-DD format
     * @param {Boolean}  sort       Sort the array to ensure the dates are sequential. 
     *                              [Default]  True
     */
    //export function dateRangeText (dates, long = true, sort = true, locale = null) {
    export function dateRangeText (...params) {
        let _dates = []
        let _long = null
        let _sort = null
        let _locale = null
        params.forEach(_p => {
            if (Array.isArray(_p) && !_dates.length) {
                _dates = _p
                if (_dates.length > 2) {
                    _dates = [_dates[0], _dates[_dates.length-1]]
                }
            } else if (typeof _p === 'boolean') {
                if (_long !== null) {
                    _long = _p
                }
                else if (_sort !== null) {
                    _sort = _p
                }
            } else if (typeof _p === 'string' && !_locale) {
                _locale = _p
            }
        })

        if (_long === null) { _long = true }
        if (_sort === null) { _sort = true }

        //console.log(`DateHelper.dateRangeText( ${_dates}, ${_long}, ${_sort}, ${_locale})`)
        
        if (_dates && Array.isArray(_dates)) {
            if (_sort) _dates.sort()

            if (_dates.length === 2) {
                return dateRangeToStr(_dates[0], _dates[1], _long, _locale || this.browserLocale)
            } else if (_dates.length === 1) {
                return dateRangeToStr(_dates[0], '', _long, _locale || this.browserLocale)
            }                
        }
                
        return ''
    }

    /**
     * dateRangeToStr converts a set of dates to a hyphenated short-form localized date string
     *  
     * @param  {String}             rangeStart  'YYYY-MM-DD' string representing the start date
     * @param  {String}             rangeEnd    'YYYY-MM-DD' string representing the end date
     * @param  {Boolean | Object}   options     Boolean controls default long/short format, accepts a formatting
     *                                          object to override defaults 
     * @return {String}                         Hyphenated combination of start and end dates formatted
     *                                          using month and day short forms rather than numeric value.
     *                                          Automatically adds the year if the start and end dates 
     *                                          span years 
     */
    export function dateRangeToStr (rangeStart, rangeEnd, options = null, locale = 'en-US') {
        //console.log(`DateHelper.dateRangeToStr( ${rangeStart}, ${rangeEnd}, ${options}, ${locale})`)
        let _rangeStart = validateDate(rangeStart)
        let _rangeEnd = validateDate(rangeEnd)
        let _long = typeof options === 'boolean' ? options : true
        let _format = typeof options === 'object' 
                ? options 
                : _long 
                    ? {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'} 
                    : {month: 'short', day: 'numeric', timeZone: 'UTC'}

        const _cin = rangeStart ? dateToStr(rangeStart, _format, locale) : null
        const _cout = rangeEnd ? dateToStr(rangeEnd, _format, locale) : null

        return `${_cout 
                    ? _cin 
                        ? _cin + ' - ' + _cout
                        : ' - ' + _cout
                    : _cin 
                        ? _cin + ' - '
                        : ''       
                }`

    }

    /**
     * dateToStr converts a Javascript Date object to a string taking into account
     * the user's locale
     * 
     * @param  {Object}         date    Javascript Date object
     * @param  {Array | String} format  [optional] A string with a BCP 47 language tag, or
     *                                  array of such strings. See documenation 
     * @return {String}                 Date formatted as a string as per format requested                 
     */
    export function dateToStr (date, format = null, locale = 'en-US') {
        //console.log(`DateHelper.dateToStr( ${date}, ${format}, ${locale})`)
        if (date !== undefined && typeof date.toLocaleDateString === 'function') {
            return date.toLocaleDateString(locale, format)
        } else if (date !== undefined && typeof date === 'string') {
            return new Date(date).toLocaleDateString(locale, format)
        }

        return null
    }

    /**
     * Private Helper function
     * 
     * dateToISOStr converts a Date object to a string as specified by ISO format 8601
     * 
     * @param  {Object} date    Date object supporting a toISOString method such as the internal
     *                          Javascript or moment.js Date objects 
     * @param  {Number} len     [Defaults to 10] Number to limit the length of the resulting string
     * @return {String | null}  Returns the first `len` charachters of the converted string or 
     *                          `null` if the date object supplied is invalid
     */
    export function dateToISOStr (date, len = 10) {
        if (date && typeof date.toISOString === 'function') {
            return date.toISOString().substr(0,len)
        } else if (date && typeof date === 'string') {
            let _d = dateFromStr(date)
            if (_d && typeof _d.toISOString === 'function') {
                return dateToISOStr(_d, len)
            } else {
                return null
            }
        }

        return null
    }

    /**
     * Private Helper function
     * 
     * dateToMonthYear is a wrapper function around the Vuetify default date formatters. 
     * !!! Must be used as a mixin to DateRangePicker !!!
     * 
     * @param  {Object | String}    date    Date object supporting a toISOString method such as 
     *                                      the internal Javascript or moment.js Date objects;
     *                                      A date formated as YYYY-MM-DD
     * @return {String | null}              Returns the date object formatted as a string or `null`
     */
    function dateToMonthYear (date) {
        if (this.formatters && typeof this.formatters.titleMonthYear === 'function ') {
            if (date && typeof date.toISOString === 'function') {
                return this.formatters.titleMonthYear(date.toISOString().substr(0,10))      
            } else if (date && typeof date === 'string') {
                return this.formatters.titleMonthYear(date)
            }
        }
        return null          
    }

    /** 
     * validateDate inspects the supplied date and attempts to 
     * return a valid javascript Date object or null
     * 
     * @param  {Number | String | Date}     date     Date value to inspect. If date cannot
     *                                               be evaluated, today's date is returned
     * @param  {Date}                       fallback If provided, fallback date object to return
     * @return {Date | null}                         Javascript Date object
     * 
     */
    export function validateDate (date, fallback = null) {
        //console.log(`DateHelper.validateDate()`, date, fallback)
        let _d = null
        if (date && typeof date === 'number') {
            _d = dateFromYear(date)
        } else if (date && typeof date === 'string') {
            _d = dateFromStr(date)
        } else if (date && typeof date.toISOString === 'function') {
            if (typeof date.toDate === 'function') {
                _d = date.toDate()
            } else {
                _d = date
            }
        } else {
            _d = fallback !== null ? fallback : new Date()
        }
        return _d
    }

    /**
     * Private Helper function
     * 
     * deltaDate accepts two dates of any type, converts them to Date objects and executes
     * a call back function passing the Date objects as parameters
     * 
     * @param  {Any}        date1    A Date object, a string or numeric representation of a date
     * @param  {Any}        date2    A Date object, a string or numeric representation of a date
     * @param  {Function} callback   A function that will be executed using the converted dates
     *                               as parameters
     * @return {Numeric}             Returns the result of the callback, if enabled, or the time 
     *                               difference
     */
    export function deltaDate (date1, date2, callback = null) {
        if (Array.isArray(date1)) {
            date1 = date1[0]
        }
        if (Array.isArray(date2)) {
            date2 = date2[0]
        }

        let _first = validateDate(date1).setHours(0,0,0,0)
        let _second = validateDate(date2).setHours(0,0,0,0)
        
        if (callback && typeof callback === 'function') {
            return callback(_first, _second)
        }
        //console.log(`Delta is: ${_second - _first}`)
        let _delta = (_second - _first)
        return _delta
    }

export default {
    methods: {
        dateFromStr: dateFromStr,
        dateFromYear: dateFromYear,
        dateRangeText: dateRangeText,
        dateRangeToStr: dateRangeToStr,
        dateToStr: dateToStr,
        dateToISOStr: dateToISOStr,
        dateToMonthYear: dateToMonthYear,
        validateDate: validateDate,
        deltaDate: deltaDate
    }
}