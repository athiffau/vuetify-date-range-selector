'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var moment = _interopDefault(require('moment'));
var __vue_normalize__ = _interopDefault(require('vue-runtime-helpers/dist/normalize-component.js'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

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
function dateFromStr(strDate) {
  var deltaDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var deltaMonth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var deltaYear = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (typeof strDate === 'string') {
    var yr = parseInt(strDate.substring(0, 4));
    var mon = parseInt(strDate.substring(5, 8));
    var dt = parseInt(strDate.substring(8, 10));
    var d = new Date(yr, mon - 1, dt ? dt : 1);

    if (deltaDay !== 0) {
      d.setDate(d.getDate() + deltaDay);
    }

    if (deltaMonth !== 0) {
      d.setMonth(d.getMonth() + deltaMonth);
    }

    if (deltaYear !== 0) {
      d.setFullYear(d.getFullYear() + deltaYear);
    }

    return d;
  }

  return null;
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

function dateRangeText() {
  var _dates = [];
  var _long = null;
  var _sort = null;
  var _locale = null;

  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  params.forEach(function (_p) {
    if (Array.isArray(_p) && !_dates.length) {
      _dates = _p;

      if (_dates.length > 2) {
        _dates = [_dates[0], _dates[_dates.length - 1]];
      }
    } else if (typeof _p === 'boolean') {
      if (_long !== null) {
        _long = _p;
      } else if (_sort !== null) {
        _sort = _p;
      }
    } else if (typeof _p === 'string' && !_locale) {
      _locale = _p;
    }
  });

  if (_long === null) {
    _long = true;
  }

  if (_sort === null) {
    _sort = true;
  } //console.log(`DateHelper.dateRangeText( ${_dates}, ${_long}, ${_sort}, ${_locale})`)


  if (_dates && Array.isArray(_dates)) {
    if (_sort) _dates.sort();

    if (_dates.length === 2) {
      return dateRangeToStr(_dates[0], _dates[1], _long, _locale || this.browserLocale);
    } else if (_dates.length === 1) {
      return dateRangeToStr(_dates[0], '', _long, _locale || this.browserLocale);
    }
  }

  return '';
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

function dateRangeToStr(rangeStart, rangeEnd) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var locale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'en-US';

  //console.log(`DateHelper.dateRangeToStr( ${rangeStart}, ${rangeEnd}, ${options}, ${locale})`)
  var _rangeStart = validateDate(rangeStart);

  var _rangeEnd = validateDate(rangeEnd);

  var _long = typeof options === 'boolean' ? options : true;

  var _format = _typeof(options) === 'object' ? options : _long ? {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  } : {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  };

  var _cin = rangeStart ? dateToStr(rangeStart, _format, locale) : null;

  var _cout = rangeEnd ? dateToStr(rangeEnd, _format, locale) : null;

  return "".concat(_cout ? _cin ? _cin + ' - ' + _cout : ' - ' + _cout : _cin ? _cin + ' - ' : '');
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

function dateToStr(date) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var locale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'en-US';

  //console.log(`DateHelper.dateToStr( ${date}, ${format}, ${locale})`)
  if (date !== undefined && typeof date.toLocaleDateString === 'function') {
    return date.toLocaleDateString(locale, format);
  } else if (date !== undefined && typeof date === 'string') {
    return new Date(date).toLocaleDateString(locale, format);
  }

  return null;
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

function dateToISOStr(date) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (date && typeof date.toISOString === 'function') {
    return date.toISOString().substr(0, len);
  } else if (date && typeof date === 'string') {
    var _d = dateFromStr(date);

    if (_d && typeof _d.toISOString === 'function') {
      return dateToISOStr(_d, len);
    } else {
      return null;
    }
  }

  return null;
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

function dateToMonthYear(date) {
  if (this.formatters && typeof this.formatters.titleMonthYear === 'function ') {
    if (date && typeof date.toISOString === 'function') {
      return this.formatters.titleMonthYear(date.toISOString().substr(0, 10));
    } else if (date && typeof date === 'string') {
      return this.formatters.titleMonthYear(date);
    }
  }

  return null;
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


function validateDate(date) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var _d = null;

  if (date && typeof date === 'number') {
    _d = dateFromStr(date.toString());
  } else if (date && typeof date === 'string') {
    _d = dateFromStr(date);
  } else if (date && typeof date.toISOString === 'function') {
    if (typeof date.toDate === 'function') {
      _d = date.toDate();
    } else {
      _d = date;
    }
  } else {
    _d = fallback !== null ? fallback : new Date();
  }

  return _d;
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

function deltaDate(date1, date2) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (Array.isArray(date1)) {
    date1 = date1[0];
  }

  if (Array.isArray(date2)) {
    date2 = date2[0];
  }

  var _first = validateDate(date1).setHours(0, 0, 0, 0);

  var _second = validateDate(date2).setHours(0, 0, 0, 0);

  if (callback && typeof callback === 'function') {
    return callback(_first, _second);
  } //console.log(`Delta is: ${_second - _first}`)


  var _delta = _second - _first;

  return _delta;
}
var DateHelper = {
  methods: {
    dateFromStr: dateFromStr,
    dateRangeText: dateRangeText,
    dateRangeToStr: dateRangeToStr,
    dateToStr: dateToStr,
    dateToISOStr: dateToISOStr,
    dateToMonthYear: dateToMonthYear,
    validateDate: validateDate,
    deltaDate: deltaDate
  }
};

/**
 * Use moment.js to return quarter based on a date
 * 
 * @param  {String | null}  date    Return the quarter for a specific date
 *                                  If string is invalid or date is null will
 *                                  return current quarter
 * 
 * @return {Numeric}                Returns an integer between 1 and 4
 */

/*private*/

function momentCurrentQuarter() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (date !== null && typeof date === 'string') {
    return moment(date, format).utc().quarter();
  }

  return moment().quarter();
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

/*prvate*/


function momentWeekNumbers(date) {
  var _d = validateDate(date);

  var _dy = _d ? _d.getFullYear() : moment().year();

  var _data = [];

  var _weeks = moment().weeksInYear([_dy]);

  _data[0] = {
    year: _dy
  };

  for (var _x = 1; _x <= _weeks; _x++) {
    var _wStart = moment([_dy]).week(_x).startOf('week');

    var _wEnd = moment([_dy]).week(_x).endOf('week').subtract(1, 'days'); //TODO: test with .utc() instead of .subtract()


    _data[_x] = {
      start: _wStart,
      end: _wEnd
    };
  }

  return _data;
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

/*private*/


function momentMonthNumbers(date) {
  var _d = validateDate(date);

  var _dy = _d ? _d.getFullYear() : moment().year();

  var _data = [];
  _data[0] = {
    year: _dy
  };

  for (var _x = 0; _x < 12; _x++) {
    var _wStart = moment([_dy]).month(_x).startOf('month');

    var _wEnd = moment([_dy]).month(_x).endOf('month').subtract(1, 'days'); //TODO: test with .utc() instead of .subtract()


    _data[_x] = {
      start: _wStart,
      end: _wEnd
    };
  }

  return _data;
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

/*pirvate*/


function momentQuarterNumbers(year) {
  var _year = parseInt(year) || moment().year();

  var _data = [];
  _data[0] = {
    year: _year
  };

  for (var _x = 1; _x <= 4; _x++) {
    var _wStart = moment([_year]).quarter(_x).startOf('quarter');

    var _wEnd = moment([_year]).quarter(_x).endOf('quarter').subtract(1, 'days'); //TODO: test with .utc() instead of .subtract()


    _data[_x] = {
      start: _wStart,
      end: _wEnd
    };
  }

  return _data;
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

/*private*/


function momentPeriodNumbers() {
  var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _year = parseInt(year) || moment().year();

  var _data = [];
  _data[0] = {
    year: _year
  };

  var _weeks = momentWeekNumbers(year);

  var _pn = 0;

  for (var _x = 1; _x <= 52; _x += 4) {
    _pn++;

    var _wStart = _pn === 1 ? dateToISOStr(_weeks[_x].start) : dateToISOStr(moment(_weeks[_x].start).add(1, 'days'));

    var _wEnd = dateToISOStr(moment(_weeks[_x + 3].end).add(1, 'days')); //TODO: test with .utc() instead of .add()


    _data[_pn] = {
      start: _wStart,
      end: _wEnd
    };
  }

  return _data;
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

/*private*/


function momentStartOf(opt, date) {
  var _d = validateDate(date); //returns null or validate date


  var _date = _d ? _d : moment();

  return moment(_date).startOf(opt);
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

/*private*/


function momentEndOf(opt, date) {
  var _d = validateDate(date); //returns null or validate date


  var _date = _d ? _d : moment();

  return moment(_date).endOf(opt);
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

/*private*/


function momentGetQuarterDates(year, quarterNumber) {
  //console.log(`DateAPI.moment->momentGetQuarterDates(${year}, ${quarterNumber})`)
  var _qn = 1;

  if (quarterNumber === 0) {
    _qn = momentCurrentQuarter(year); // console.log(`Quarter requested was 0 for ${year} which returned ${_qn}`)
  } else if (quarterNumber === -1) {
    _qn = momentCurrentQuarter(year); // console.log(`Quarter requested was -1 for ${year} and since we are currently Q${_qn} we need to roll back to previous year, Q4`)

    if (_qn === 1) {
      return momentGetQuarterDates(dateToISOStr(moment().year(year).subtract(1, 'years')), 4);
    }
  } else {
    _qn = parseInt(quarterNumber) || 1;
  }

  var _data = momentQuarterNumbers(year);

  if (_data[_qn]) {
    return [dateToISOStr(_data[_qn].start), dateToISOStr(_data[_qn].end)];
  }

  return [];
}


var DateAPI = {
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
    dateStartPrevWeek: function dateStartPrevWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _d = validateDate(date); //let _date = _d ? _d : moment()


      var _dw = this.dateStartOfWeek(dateToISOStr(_d));

      _dw.subtract(7, 'days');

      return _dw;
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
    dateEndPrevWeek: function dateEndPrevWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _d = validateDate(date);

      var _dw = this.dateEndOfWeek(dateToISOStr(_d));

      _dw.subtract(7, 'days');

      return _dw;
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
    dateStartOfWeek: function dateStartOfWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _t = momentStartOf('week', date);

      return _t;
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
    dateEndOfWeek: function dateEndOfWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _t = momentEndOf('week', date).subtract(1, 'days'); //TODO: test with .utc() instead of .subtract()


      return _t;
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
    dateStartOfMonth: function dateStartOfMonth() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _t = momentStartOf('month', date);

      return _t;
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
    dateEndOfMonth: function dateEndOfMonth(date) {
      var _d = validateDate(date);

      var _t = momentEndOf('month', _d.toISOString()).subtract(1, 'days'); //TODO: test with .utc() instead of .subtract()


      return _t;
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
    getWeekNumbers: function getWeekNumbers() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return momentWeekNumbers(date);
    },

    /**
     * getMonthShortNames returns a localized list of abreviated month names
     * 
     * @param  {String}     locale  String corresponding to the requested language
     * @return {String[]}           Array of strings 
     */
    getMonthShortNames: function getMonthShortNames(locale) {
      if (!locale) locale = 'en';
      return Array.apply(0, Array(12)).map(function (_, i) {
        return moment().locale(locale).month(i).format('MMM');
      });
    },

    /**
     * getMonthLongNames returns a localized list of month names
     * 
     * @param  {String}     locale  String corresponding to the requested language
     * @return {String[]}           Array of strings
     */
    getMonthLongNames: function getMonthLongNames(locale) {
      if (!locale) locale = 'en'; //console.log('DateAPI.moment.getMonthLongNames: ',locale)

      return Array.apply(0, Array(12)).map(function (_, i) {
        return moment().locale(locale).month(i).format('MMMM');
      });
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
    getWeekDates: function getWeekDates() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var weekNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var _wn = parseInt(weekNumber) || 1;

      var _data = momentWeekNumbers(date);

      return [dateToISOStr(_data[_wn].start), dateToISOStr(_data[_wn].end)];
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
    getPeriodDates: function getPeriodDates() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var periodNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var _pn = parseInt(periodNumber, 10) || 1;

      var _data = momentPeriodNumbers(date);

      return [dateToISOStr(_data[_pn].start), dateToISOStr(_data[_pn].end)];
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
    getMonthDates: function getMonthDates() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var monthNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var _mn = parseInt(monthNumber) || 1;

      var _data = momentMonthNumbers(date);

      return [dateToISOStr(_data[_mn].start), dateToISOStr(_data[_mn].end)];
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
    getQuarterDates: function getQuarterDates() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var quarterNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var _qn = parseInt(quarterNumber) || 1;

      return momentGetQuarterDates(date, _qn);
    },

    /**
     * getCurrentDate returns the day of the month based on a moment in time pointing to the requeste date
     * 
     * @param  {Object | String}     date     Javascript Date object or string matching 
     *                                        known ISO 8601 formats. If omitted, the current
     *                                        date will be used.
     * @return {Number}                       Date of the month
     */
    getCurrentDate: function getCurrentDate() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _mit = moment(date ? date : undefined);

      return _mit.date();
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
    getCurrentWeek: function getCurrentWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var _mit = moment(date ? date : undefined, format);

      return _mit.week();
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
    getCurrentPeriod: function getCurrentPeriod() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var _data = null;

      var _now = moment();

      if (date !== null && typeof date === 'string') {
        _data = momentPeriodNumbers(moment(date, format).year());
      } else {
        _data = momentPeriodNumbers();
      }

      var _index = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var period = _step.value;

          if (_index !== 0) {
            if (deltaDate(period.start, dateToISOStr(_now)) > 0 && deltaDate(dateToISOStr(_now), period.end) > 0) {
              break;
            }
          }

          _index++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return _index;
    },

    /**
     * getCurrentMonth returns the month number based on a moment in time pointing to the requested date
     * 
     * @param  {Object | String}    date    Javascript Date object or string matching
     *                                      known ISO 8601 formats. If omitted, the current
     *                                      date will be used.
     * @return {Number}                     Month number
     */
    getCurrentMonth: function getCurrentMonth() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _mit = moment(date ? date : undefined);

      return _mit.month();
    },

    /**
     * getCurrentQuarter returns the quarter number based on a moment in time pointing to the requested date
     * 
     * @param  {Object | String}    date    Javascript Date object or string matching
     *                                      known ISO 8601 formats. If omitted, the current
     *                                      date will be used.
     * @return {Number}                     Quarter number
     */
    getCurrentQuarter: function getCurrentQuarter() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return momentCurrentQuarter(date);
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
    getCurrentYear: function getCurrentYear() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      //console.log('DateAPI.moment -> getCurrentYear()', date)
      var _mit;

      if (typeof date === 'string') {
        if (date.includes('-')) {
          _mit = moment(date);
        } else {
          _mit = moment(date + '-01-01');
        }
      } else if (typeof date === 'number') {
        _mit = moment(date + '-01-01');
      } else {
        //console.log(typeof date)
        _mit = moment(date ? date : undefined);
      } //console.log(`getCurrentYear(${typeof date}: ${date}) is ${_mit.year()}`)


      return _mit.year();
    },

    /**
     * getDayOfWeek returns the day of the week based on a moment in time pointing to the requested date
     * 
     * @param  {Object | String}    date    Javascript Date object or string matching
     *                                      known ISO 8601 formats. If omitted, the current
     *                                      date will be used.
     * @return {Number}                     The day of the week where 0 = sunday
     */
    getDayOfWeek: function getDayOfWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _mit = moment(date ? date : undefined);

      return _mit.day();
    }
  }
};

/**
 * Borrowed from vuetifyjs until component is ported to TypeScript (if ever)
 */
function createMessage(message, vm, parent) {
  if (parent) {
    vm = {
      _isVue: true,
      $parent: parent,
      $options: vm
    };
  }

  if (vm) {
    // Only show each message once per instance
    vm.$_alreadyWarned = vm.$_alreadyWarned || [];
    if (vm.$_alreadyWarned.includes(message)) return;
    vm.$_alreadyWarned.push(message);
  }

  return "[Vuetify] " + message + (vm ? generateComponentTrace(vm) : '');
}
/**
 * Shamelessly stolen from vuejs/vue/blob/dev/src/core/util/debug.js
 */


var classifyRE = /(?:^|[-_])(\w)/g;

var classify = function classify(str) {
  return str.replace(classifyRE, function (c) {
    return c.toUpperCase();
  }).replace(/[-_]/g, '');
};

function formatComponentName(vm, includeFile) {
  if (vm.$root === vm) {
    return '<Root>';
  }

  var options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm || {};
  var name = options.name || options._componentTag;
  var file = options.__file;

  if (!name && file) {
    var match = file.match(/([^/\\]+)\.vue$/);
    name = match && match[1];
  }

  return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
}

function generateComponentTrace(vm) {
  if (vm._isVue && vm.$parent) {
    var tree = [];
    var currentRecursiveSequence = 0;

    while (vm) {
      if (tree.length > 0) {
        var last = tree[tree.length - 1];

        if (last.constructor === vm.constructor) {
          currentRecursiveSequence++;
          vm = vm.$parent;
          continue;
        } else if (currentRecursiveSequence > 0) {
          tree[tree.length - 1] = [last, currentRecursiveSequence];
          currentRecursiveSequence = 0;
        }
      }

      tree.push(vm);
      vm = vm.$parent;
    }

    return '\n\nfound in\n\n' + tree.map(function (vm, i) {
      return "" + (i === 0 ? '---> ' : ' '.repeat(5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
    }).join('\n');
  } else {
    return "\n\n(found in " + formatComponentName(vm) + ")";
  }
}

function consoleInfo(message, vm, parent) {
  var newMessage = createMessage(message, vm, parent);
  newMessage != null && console.info(newMessage);
}
function consoleWarn(message, vm, parent) {
  var newMessage = createMessage(message, vm, parent);
  newMessage != null && console.warn(newMessage);
}
function consoleError(message, vm, parent) {
  var newMessage = createMessage(message, vm, parent);
  newMessage != null && console.error(newMessage);
}

var Events = {
  props: {
    consoleMessage: {
      type: Boolean,
      default: false
    },
    consoleFilter: {
      type: String,
      default: ''
    }
  },
  methods: {
    /**
     * [emitConsoleInfo description]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    emitConsoleInfo: function emitConsoleInfo(msg) {
      this.$emit('info', msg);

      if (this.consoleMessage) {
        consoleInfo(msg, this);
      }
    },

    /**
     * [emitConsoleWarning description]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    emitConsoleWarning: function emitConsoleWarning(msg) {
      this.$emit('warning', msg);

      if (this.consoleMessage) {
        consoleWarn(msg, this);
      }
    },

    /**
     * [emitConsoleError description]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    emitConsoleError: function emitConsoleError(msg) {
      this.$emit('error', msg);

      if (this.consoleMessage) {
        consoleError(msg, this);
      }
    }
  }
};

var DateRangePlugin = {
  mixins: [Events],
  data: function data() {
    return {
      currentAction: null,
      pauseWatcher: false,
      mru: []
    };
  },
  props: {
    dateRange: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    updateDateRange: {
      type: Function,
      default: function _default() {
        return {};
      }
    },
    multiRange: {
      type: Boolean,
      default: false
    }
  },
  inject: ['pickerConfig'],
  watch: {
    dateRange: {
      handler: function handler(val, prev) {
        var _this = this;

        //console.log(`DateRangePlugin -> dateRange wathcer: [val]${val}, [prev]${prev}, [paused]${this.pauseWatcher}`)
        if (!this.pauseWatcher && Array.isArray(val) && Array.isArray(prev)) {
          if (val.length === 0 && prev.length !== 0) {
            //console.log(`val.length=${val.length}, prev.length=${prev.length}`)
            //this.clearCurrentAction()
            this.clearSelection();
            this.btnGroup = null;
          }
        } else {
          this.$nextTick(function () {
            _this.pauseWatcher = false;
          });
        }
      }
    }
  },
  methods: {
    /**
     * setDateRange wraps the DateRangePicker updateDateRange function and allows for some
     * plugin house keeping before changing the parent's state.
     * 
     * @param {String[]} _dates  Array of strings each formatted as YYYY-MM-DD
     */
    setDateRange: function setDateRange(
    /* String[] */
    _dates) {
      this.clearPrevAction();

      if (!_dates.length) {
        this.pauseWatcher = true;
      }

      this.updateDateRange(_dates);
    },

    /**
     * In support of quick selection helpers
     * 
     * buildSelectionList calls a function by string 
     * 
     * @param  {String}         fnName  Name of function to invoke
     * 
     * @return {Any | null}             Result of function if found or `null`
     */
    buildSelectionList: function buildSelectionList(fnName) {
      var _fn = this[fnName];
      if (_fn) return _fn();
    },

    /**
     * In support of the plugin form builder
     * 
     * evaluate is called from a click event handler if trivial reject
     * tests (TRTs) have been set for that action.
     * 
     * @param  {Array | String}    conditions   Name of TRT(s) to execute
     * @param  {...Array}          params       Parameters to pass to the TRT
     * 
     * @return {Boolean}                        TRT result
     */
    evaluate: function evaluate(conditions) {
      var _this2 = this;

      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      //console.log('DateRangePlugin.evalute() ', conditions, params)
      var _result = [];

      if (!this.allowBackInTime) {
        if (typeof conditions === 'string') conditions = [conditions];

        if (Array.isArray(conditions)) {
          conditions.forEach(function (condition, index) {
            if (condition === undefined) {
              _result.push(true);
            }

            var _params = null;

            if (conditions.length === params.length) {
              _params = params[index]; //TODO: should we have this assumption ?
            } else {
              _params = Array.isArray(params) ? params.length === 0 ? null : params : params;
            }

            var _fn = _this2[condition];

            if (_fn) {
              if (!_fn(_params)) _result.push(false); //TODO: we should push the result of the _fn directly ?
            } else {
              _result.push(false);
            }
          });
        }
      }

      return _result.every(function (_r) {
        return _r === true;
      });
    },

    /**
     * In support of allowBackInTime flag
     * 
     * processMode is an extension of the allowBackInTime flag and adds three modes of
     * operation given the failure of a TRT.  
     * 
     * processMode() is called when a date requested is found
     * to be invalid. Validity is based on the following settings:
     * - startDate
     * - allowBackInTime
     * - currentDate
     * 
     * This function is typically called as a result of failing a trivial 
     * rejection test on an attempt to set a date range.
     * 
     * Three modes of error resolution are supported:
     * 1. strict:   date range is reset if any of the trivial reject rules fail
     * 2. fuzzy:    works in conjuction with an MRU where the last user selection is
     *              tested against the current date. If the date falls within it will 
     *              be allowed or else [only] the last selection will be rejected
     * 3. lazy:     the date range as per the last user selection will be tested against
     *              the current date. if the date falls within it the range will be allowed; 
     *              else the range will be rejected. 
     * 
     * @param  {String[] || string} dates String or array of strings each formated as YYYY-MM-DD
     * @param  {String}             mode  Means of overriding the date range picker's mode
     * @return {void}
     */
    processMode: function processMode(dates) {
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      //console.log(`processMode (${dates}, ${mode})`)
      if ((mode || this.pickerConfig.mode) === 'strict') {
        this.clearCurrentAction();
        this.clearPrevAction();
        this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.rangeNotAllowed'));
      } else if ((mode || this.pickerConfig.mode) === 'lazy') {
        if (this.todayIsInRange(dates)) {
          this.setDateRange(dates);
          this.emitConsoleWarning(this.$vuetify.t('$vuetify.dateRangePicker.rangeIncludesPastDates'));
        } else {
          this.clearCurrentAction();
          this.clearSelection();
          this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.rangeNotAllowed'));
        }
      } else if ((mode || this.pickerConfig.mode) === 'fuzzy') {
        //console.log('Using fuzzy...')
        if (this.todayIsInRange(dates)) {
          this.setDateRange(dates);
          this.emitConsoleWarning(this.$vuetify.t('$vuetify.dateRangePicker.rangeIncludesPastDates'));
        } else {
          this.clearMRU();
          this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.selectionRefused'));
        }
      } else if (mode === 'bully') {
        this.clearMRU();
        this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.selectionRefused'));
      }
    },

    /**
     * Private Helper function
     * 
     * getItemText is a Getter for the text property of the 
     * supplied object
     *  
     * @param  {Object}      item   The object to inspect
     * @return {Any | null}         Returns the object property or 
     *                              `null` if it does not exist  
     */
    getItemText: function getItemText(item) {
      return item ? item.text ? item.text : null : null;
    },

    /**
     * Private Helper function
     * 
     * getItemValue is a Getter for the value property of the 
     * supplied object
     * 
     * @param  {Object}     item    The object to inspect
     * @return {Any | null}         Returns the object property or
     *                              `null` if it does not exist
     */
    getItemValue: function getItemValue(item) {
      return item.value;
    },

    /**
     * In support of quick selection helpers; obtains value from UI  
     * required to execute the requested helper
     * 
     * Getter function 
     * 
     * getSiblingData parses the helper's data object to extract the
     * model of the requested component 
     * 
     * @param  {Object}             data    The helper's data object
     * @param  {String | Array}     fields  The name of the model(s) to extract
     * @return {Array}                      The corresponding field(s) if found
     */
    getSiblingData: function getSiblingData() {
      var results = [];

      for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      var data = params[0],
          fields = params[1];

      if (data.hasOwnProperty('options') && Array.isArray(data.options)) {
        data.options.forEach(function (item) {
          if (Array.isArray(fields)) {
            fields.split(',').map(function (f) {
              if (item.ref === f) {
                results.push(item.value);
              }
            });
          } else if (typeof fields === 'string') {
            if (item.ref === fields) {
              results = [item.value];
            }
          }
        });
      }

      return results;
    },

    /**
     * In support of quick selection helpers; provides support for
     * multi-step user selection 
     * 
     * setCurrentAction parses helpers defined in the selected
     * mixin to identify the helpers `actionName` and identify
     * dependencies. the actionName and its dependencies are 
     * tracked to properly support UI refresh as the user
     * navigrates the quick selection options.
     * 
     * @param {String} actionName Name of the quick selection helper as 
     *                          defined in the pickerOptions->action 
     *                          property
     * 
     * @return {void}
     */
    setCurrentAction: function setCurrentAction(actionName) {
      //console.log(`setCurrentAction( ${actionName})`)
      var _actions = [];

      _actions.push(actionName);

      this.pickerOptions.forEach(function (item, index) {
        item.options.forEach(function (val, index) {
          if (val.action === actionName && val.needs !== undefined) {
            _actions.push(val.needs);
          }
        });
      }); //console.log(`setting current action to `,_actions)

      this.currentAction = _actions; //console.log(`system currentAction was set to`, this.currentAction)
    },

    /**
     * In support of the 'fuzzy' mode of preventing the user from
     * selecting dates that are past
     * 
     * mruAction adds a user action to the MRU.  The MRU is limited to
     * 100 entries. If that amount is passed, the oldest entry will be
     * removed.
     * 
     * @param  {Object} actionObject Describes the user action
     * @return {void}
     */
    mruAction: function mruAction(actionObject) {
      if (this.mru.length === 100) {
        this.mru.shift();
      }

      this.mru.push(actionObject);
    },

    /**
     * In support of quick seleciton helpers;
     * 
     * clearCurrentAction resets the action tracking
     * mechanism
     * 
     * @return {void}
     */
    clearCurrentAction: function clearCurrentAction() {
      //console.log(`Action was: ${this.currentAction}`)
      this.currentAction = null;
    },

    /**
     * In support of quick selection helpers;
     * 
     * clearSelection clears previous user selections
     *  
     * @return {void}
     */
    clearSelection: function clearSelection() {
      //console.log('DateRangePlugin.clearSelection()')
      this.mru = [];
      this.clearPrevAction();
    },

    /**
     * In support of quick selection helpers;
     * 
     * clearPrevAction resets the UI after a user chooses a
     * second shortcut.
     * 
     * @return {void}
     */
    clearPrevAction: function clearPrevAction() {
      var _this3 = this;

      //console.log('DateRangePlugin.clearPrevAction()')
      var _ca = this.currentAction; //console.log(_ca)
      //reset group models

      this.pickerOptions.forEach(function (item) {
        if (item.type && item.type === 'group') {
          var _obj = item.options.find(function (o) {
            return o.action === _ca;
          });

          if (!_obj) {
            item.groupModel = null;
          }
        }
      }); //reset individual component models

      this.pickerOptions.forEach(function (item, index) {
        item.options.forEach(function (val, index) {
          if (_ca === null || !_ca.includes(val.ref) && !_ca.includes(val.action) && val.value !== undefined) {
            _this3.$nextTick(function () {
              val.value = [];
            }, val);
          }
        });
      });
    },

    /**
     * In support of quick selection helpers;
     * 
     * clearMRU removes the last user selection from the date range
     * 
     * @return {void}
     */
    clearMRU: function clearMRU() {
      var _this4 = this;

      //console.log('clearMRU ()')       
      this.$nextTick(function () {
        var _mru = _this4.mru.pop(); //console.log(`mru is: ${_mru}`)


        _this4.pickerOptions.forEach(function (item, index) {
          item.options.forEach(function (val, index) {
            if (val.action === _mru && Array.isArray(val.value)) {
              if (val.value.length) {
                val.value.pop();
              }
            }
          });
        });
      });
    },

    /**
     * In support of quick selection helpers;
     * 
     * showHidePanel is used to control the visiblity of groups of components and
     * provides the expected behavior of horizontal expansion panels. To help
     * manage screen space, non expanded panels are also removed. If non of the panels
     * are expanded, all contracted panels are displayed.
     * 
     * @param  {Object} panel Object that defines a helper group having both
     *                        a `visible` and `show` boolean property
     * @return {void}
     */
    showHidePanel: function showHidePanel(panel) {
      // toggle the expand state of the panel
      panel.show = !panel.show;
      this.panel = panel; // hide other panels

      this.pickerOptions.forEach(function (option) {
        if (option.title !== panel.title) {
          option.visible = panel.show ? false : true;
        }
      });
    },

    /**
     * In support of quick selection helpers; 
     * 
     * onAction identifies and executes a click handler
     * based on its string name
     * 
     * @param  Object   event       Component event object
     * @param  String   fnName      The name of the handler
     * @param  Any      value       The data selected by the user
     * @param  Any      parameters  Function parameters || null
     * 
     * @return void
     */
    onAction: function onAction() {
      var _this5 = this;

      for (var _len3 = arguments.length, attributes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        attributes[_key3] = arguments[_key3];
      }

      this.$nextTick(function () {
        //console.log('Parameters array: ',attributes) 
        var date = attributes[0],
            event = attributes[1],
            fnName = attributes[2],
            value = attributes[3],
            siblingData = attributes[4],
            conditions = attributes.slice(5); //console.log(`onAction`, fnName)

        var _strDate = date;

        var _d = _this5.validateDate(_strDate);

        var _fn = null;
        _fn = _this5[fnName];

        if (_fn) {
          _this5.setCurrentAction(fnName);

          _this5.mruAction(fnName);

          _fn(_d, event, value, siblingData, _this5.allowBackInTime ? undefined : conditions);

          _this5.currentAction = null;
        }
      });
    },

    /**
     * ucFirst capitalizes the first letter of a string
     * 
     * @param  {String} str The string to process
     * @return {String}     The capitalized string
     */
    ucFirst: function ucFirst(
    /*String*/
    str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * With the date range picker in single range mode only the earliest and latest date in a range is 
     * persisted.  In support of shortcuts that offer multi-select [periods, months and quarters] the user
     * will receive a warning if there are non-consequtive selections.
     * 
     * warningSingleRangeMode emits a localized warning to parent when a multi-selection is not consequtive
     * 
     * @return {[type]} [description]
     */
    warningSingleRangeMode: function warningSingleRangeMode() {
      this.emitConsoleWarning(this.$vuetify.t('$vuetify.dateRangePicker.warningSingleRange'));
    }
  }
};

var FinanceShortcuts = {
  mixins: [DateHelper, DateAPI, DateRangePlugin],
  data: function data() {
    return {
      now: null,
      pickerOptions: [{
        active: false,
        groupModel: null,
        icon: 'fastfood',
        show: false,
        title: '$vuetify.dateRangeShortcuts.fastFood.title',
        visible: true,
        type: 'group',
        options: [{
          action: 'onClickYesterday',
          icon: '',
          if: 'allowsPastDates',
          loading: false,
          title: '$vuetify.dateRangeShortcuts.fastFood.yesterday',
          type: 'v-btn',
          value: '1'
        }, {
          action: 'onClickLastWeek',
          icon: '',
          if: 'allowsPastDates',
          loading: false,
          title: '$vuetify.dateRangeShortcuts.fastFood.lastWeek',
          type: 'v-btn',
          value: '2'
        }, {
          action: 'onClickThisWeek',
          icon: '',
          if: 'todayIsStartOfWeek',
          loading: false,
          title: '$vuetify.dateRangeShortcuts.fastFood.thisWeek',
          type: 'v-btn',
          value: '3'
        }, {
          action: 'onClickLastMonth',
          icon: '',
          if: 'allowsPastDates',
          loading: false,
          title: '$vuetify.dateRangeShortcuts.fastFood.lastMonth',
          type: 'v-btn',
          value: '4'
        }, {
          action: 'onClickThisMonth',
          icon: '',
          if: 'todayIsStartOfMonth',
          loading: false,
          title: '$vuetify.dateRangeShortcuts.fastFood.thisMonth',
          type: 'v-btn',
          value: '5'
        }, {
          action: 'onClickNext3Months',
          icon: '',
          loading: false,
          title: '$vuetify.dateRangeShortcuts.fastFood.next3Months',
          type: 'v-btn',
          value: '6'
        }]
      }, {
        active: false,
        groupModel: null,
        icon: 'calendar_today',
        show: false,
        title: '$vuetify.dateRangeShortcuts.calendar.title',
        visible: true,
        options: [{
          title: '$vuetify.dateRangeShortcuts.calendar.weeksByNumber',
          label: '$vuetify.dateRangeShortcuts.calendar.weekByNumber',
          type: 'v-select',
          multiple: true,
          items: 'weekNumbers',
          itemsReactive: [],
          icon: '',
          if: 'weekIsNotPast',
          isOpen: undefined,
          loading: false,
          action: 'onClickCalWeekSelect',
          ref: 'calWeekSelection',
          value: []
        }, {
          title: '$vuetify.dateRangeShortcuts.calendar.monthsByName',
          label: '$vuetify.dateRangeShortcuts.calendar.monthByName',
          type: 'v-select',
          multiple: true,
          items: 'monthNames',
          itemsReactive: [],
          icon: '',
          if: 'monthIsNotPast',
          isOpen: undefined,
          loading: false,
          action: 'onClickCalMonthSelect',
          ref: 'calMonthSelection',
          value: []
        }, {
          title: '$vuetify.dateRangeShortcuts.calendar.years',
          label: '$vuetify.dateRangeShortcuts.calendar.year',
          type: 'v-select',
          multiple: true,
          items: 'yearNumbers',
          itemsReactive: [],
          icon: '',
          if: 'todayIsStartOfYear',
          isOpen: undefined,
          loading: false,
          action: 'onClickCalYearSelect',
          ref: 'calYearlSelection',
          value: []
        }]
      }, {
        active: false,
        groupModel: null,
        icon: 'attach_money',
        show: false,
        title: '$vuetify.dateRangeShortcuts.finance.title',
        visible: true,
        options: [{
          title: '$vuetify.dateRangeShortcuts.year',
          label: '$vuetify.dateRangeShortcuts.finance.selYear',
          type: 'v-select',
          multiple: false,
          items: 'yearNumbers',
          itemsReactive: [],
          icon: 'looks_one',
          isOpen: undefined,
          loading: false,
          action: 'onClickFinanceYearSelected',
          ref: 'financeYearChoice',
          value: []
        }, {
          title: '$vuetify.dateRangeShortcuts.quarter',
          label: '$vuetify.dateRangeShortcuts.finance.selQuarters',
          type: 'v-select',
          multiple: true,
          items: 'quarterList',
          itemsReactive: [],
          icon: 'looks_two',
          if: 'quarterIsNotPast',
          isOpen: undefined,
          loading: false,
          action: 'onClickFinanceQuarterSelected',
          ref: 'financeQuarterChoice',
          needs: 'financeYearChoice',
          value: []
        }, {
          title: '$vuetify.dateRangeShortcuts.period',
          label: '$vuetify.dateRangeShortcuts.finance.selPeriods',
          type: 'v-select',
          multiple: true,
          items: 'periodList',
          itemsReactive: [],
          icon: 'looks_two',
          if: 'periodIsNotPast',
          isOpen: undefined,
          loading: false,
          action: 'onClickFinancePeriodSelected',
          ref: 'financePeriodChoice',
          needs: 'financeYearChoice',
          value: []
        }]
      }]
    };
  },
  methods: {
    /** ============================== Toggle button handlers ============================== */

    /**
     * Event handler
     * 
     * onClickYesterday (re)sets the date range to yesterday's date leaving the end date to be
     * manually chosen by the user. This event handler implements the `IShortcutAction` interface
     * for compatiblity with the shortcuts form builder event. 
     * 
     * @param  {Object} dateInView Indicates what month is currently displayed in the master picker 
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated  
     *                             This also could be `undefined`
     * @return {void}
     */
    onClickYesterday: function onClickYesterday(dateInView, event, value) {
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.validateDate(this.startDate ? dateInView : null);

        _d.setDate(_d.getDate() - 1);

        _dates.push(this.dateToISOStr(_d));
      }

      this.setDateRange(_dates);
    },

    /**
     * Event handler
     * 
     * onClickLastWeek (re)sets the date range to last week's dates setting both the start and 
     * end date of the range. This event handler implements the `IShortcutAction` interface
     * for compatiblity with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     *  
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void}
     */
    onClickLastWeek: function onClickLastWeek(dateInView, event, value) {
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.validateDate(this.startDate ? dateInView : null);

        _dates.push(this.dateToISOStr(this.dateStartPrevWeek(_d)));

        _dates.push(this.dateToISOStr(this.dateEndPrevWeek(_d)));

        for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          params[_key - 3] = arguments[_key];
        }

        var action = params[0],
            conditions = params[1];

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates);
        } else {
          this.processMode(_dates);
        }
      } else {
        this.setDateRange(_dates);
      }
    },

    /**
     * Event handler
     * 
     * onClickThisWeek (re)sets the date range to this week's dates setting both the start and
     * end date of the range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void}
     */
    onClickThisWeek: function onClickThisWeek(dateInView, event, value) {
      // console.log(dateInView, event, value, params)
      // console.log('btnGroup: ',this.btnGroup)
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.validateDate(this.startDate ? dateInView : null);

        var _start = this.dateToISOStr(this.dateStartOfWeek(_d));

        _dates.push(_start);

        var _end = this.dateToISOStr(this.dateEndOfWeek(_d));

        _dates.push(_end);

        for (var _len2 = arguments.length, params = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
          params[_key2 - 3] = arguments[_key2];
        }

        var action = params[0],
            conditions = params[1];

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates);
        } else {
          this.processMode(_dates);
        }
      } else {
        this.setDateRange(_dates);
      }
    },

    /**
     * Event Handler
     * 
     * onClickNextMonth (re)sets the date range to next month's dates setting both the start
     * and end dates of the range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     *   
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void}    
     */
    onClickNextMonth: function onClickNextMonth(dateInView, event, value) {
      // console.log(dateInView, event, value, params)
      // console.log('btnGroup: ', this.btnGroup)
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.validateDate(this.startDate ? dateInView : null);

        var _start = this.dateToISOStr(this.dateStartOfMonth(_d).add(1, 'months'));

        var _end = this.dateToISOStr(this.dateEndOfMonth(_start));

        _dates.push(_start);

        _dates.push(_end);

        for (var _len3 = arguments.length, params = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
          params[_key3 - 3] = arguments[_key3];
        }

        var action = params[0],
            conditions = params[1];

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates);
        } else {
          this.processMode(_dates);
        }
      } else {
        this.setDateRange(_dates);
      }
    },

    /**
     * Event Handler
     * 
     * onClickLastMonth (re)sets the date range to last month's dates setting both the start
     * and end dates of the range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void}  
     */
    onClickLastMonth: function onClickLastMonth(dateInView, event, value) {
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.validateDate(this.startDate ? dateInView : null);

        var _start = this.dateToISOStr(this.dateStartOfMonth(_d).subtract(1, 'months'));

        var _end = this.dateToISOStr(this.dateEndOfMonth(_start));

        _dates.push(_start);

        _dates.push(_end);

        for (var _len4 = arguments.length, params = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
          params[_key4 - 3] = arguments[_key4];
        }

        var action = params[0],
            conditions = params[1];

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates);
        } else {
          this.processMode(_dates);
        }
      } else {
        this.setDateRange(_dates);
      }
    },

    /**
     * Event Handler
     * 
     * onClickThisMonth (re)sets the date range to this month's dates setting both the start
     * and end dates of the range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickThisMonth: function onClickThisMonth(dateInView, event, value) {
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.validateDate(this.startDate ? dateInView : null);

        _dates.push(this.dateToISOStr(this.dateStartOfMonth(_d)));

        _dates.push(this.dateToISOStr(this.dateEndOfMonth(_d)));

        for (var _len5 = arguments.length, params = new Array(_len5 > 3 ? _len5 - 3 : 0), _key5 = 3; _key5 < _len5; _key5++) {
          params[_key5 - 3] = arguments[_key5];
        }

        var action = params[0],
            conditions = params[1];

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates);
        } else {
          this.processMode(_dates);
        }
      } else {
        this.setDateRange(_dates);
      }
    },

    /**
     * Event Handler
     * 
     * onClickNext3Month (re)sets the date range to the next three (3) month's dates setting both the start
     * and end dates of the range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickNext3Months: function onClickNext3Months(dateInView, event, value) {
      var _dates = [];

      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        var _d = this.dateStartOfMonth(this.validateDate(this.startDate ? dateInView : null)).add(1, 'months');

        _dates.push(this.dateToISOStr(_d));

        _d.add(2, 'months');

        _dates.push(this.dateToISOStr(this.dateEndOfMonth(_d)));

        for (var _len6 = arguments.length, params = new Array(_len6 > 3 ? _len6 - 3 : 0), _key6 = 3; _key6 < _len6; _key6++) {
          params[_key6 - 3] = arguments[_key6];
        }

        var action = params[0],
            conditions = params[1];

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates);
        } else {
          this.processMode(_dates);
        }
      } else {
        this.setDateRange(_dates);
      }
    },

    /** ============================== Select handlers ============================== */
    //The following functions are not based on today's date

    /**
     * Event Handler
     * 
     * onClickCalWeekSelect (re)sets the date range to the selected week's dates setting both the start
     * and end dates of the range. If the previous action was a week selection, the new selection is added
     * to the existing date range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickCalWeekSelect: function onClickCalWeekSelect(dateInView, event, value) {
      var _this = this;

      //console.log('DateRangeShortcutsFinance.onClickCalWeekSelect()', {date: dateInView, event:event, value: value, params: params})
      var _dates = [];
      event.map(function (val, index) {
        _dates.push.apply(_dates, _toConsumableArray(_this.getWeekDates(null, val)));
      }); //with mutli-select we can find out what has been added to the list like this...
      //let _diff = event.filter(elem => !value.includes(elem))

      for (var _len7 = arguments.length, params = new Array(_len7 > 3 ? _len7 - 3 : 0), _key7 = 3; _key7 < _len7; _key7++) {
        params[_key7 - 3] = arguments[_key7];
      }

      var action = params[0],
          conditions = params[1];

      if (typeof conditions === 'undefined' || event.every(function (week) {
        return week > _this.currentWeek();
      }) || this.evaluate(conditions, event)) {
        this.setDateRange(_dates);
      } else {
        this.processMode(_dates); //, event.length > 1 ? 'bully' : null
      }
    },

    /**
     * Event Handler
     * 
     * onClickCalMonthSelect (re)sets the date range to the selected months's dates setting both the start
     * and end dates of the range. If the previous action was a month selection, the new selection is added
     * to the existing date range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickCalMonthSelect: function onClickCalMonthSelect(dateInView, event, value) {
      var _this2 = this;

      var _dates = [];
      event.map(function (val, index) {
        _dates.push.apply(_dates, _toConsumableArray(_this2.getMonthDates(null, val)));
      });

      for (var _len8 = arguments.length, params = new Array(_len8 > 3 ? _len8 - 3 : 0), _key8 = 3; _key8 < _len8; _key8++) {
        params[_key8 - 3] = arguments[_key8];
      }

      var action = params[0],
          conditions = params[1];

      if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
        this.setDateRange(_dates);
      } else {
        this.processMode(_dates); //, event.length > 1 ? 'bully' : null
      }
    },

    /**
     * Event Handler
     * 
     * onClickCalYearSelect (re)sets the date range to the selected years's dates setting both the start
     * and end dates of the range. If the previous action was a year selection, the new selection is added
     * to the existing date range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickCalYearSelect: function onClickCalYearSelect(dateInView, event, value) {
      var _this3 = this;

      //console.log(`DateRangeShortcutsFinance.onClickCalYearSelect()`, {date: dateInView, event:event, value:value, params:params})           
      var _dates = [];
      event.map(function (val, index) {
        var _dStart = _this3.dateToISOStr("".concat(val, "-01-01"));

        var _dEnd = _this3.dateToISOStr("".concat(val, "-12-31"));

        _dates.push(_dStart);

        _dates.push(_dEnd);
      });

      if (!this.multiRange && Array.isArray(event) && event.length > 1) {
        var _ev = event.slice();

        _ev.sort();

        var _sequentail = _ev.every(function (num, i) {
          var _test = i === _ev.length - 1 || _ev[i + 1] === num + 1;

          return _test;
        });

        if (!_sequentail) this.warningSingleRangeMode();
      }

      for (var _len9 = arguments.length, params = new Array(_len9 > 3 ? _len9 - 3 : 0), _key9 = 3; _key9 < _len9; _key9++) {
        params[_key9 - 3] = arguments[_key9];
      }

      var action = params[0],
          conditions = params[1];

      if (typeof conditions === 'undefined' || event.every(function (year) {
        return year > _this3.currentYear();
      }) || this.evaluate(conditions, event)) {
        this.setDateRange(_dates);
      } else {
        this.processMode(_dates);
      }
    },

    /**
     * Event Handler
     * 
     * onClickFinanceYearSelected resets the range picker removing any previous selections and
     * stores the user's requested year for use as parameter in subsequent events.
     * 
     * @return {void} 
     */
    onClickFinanceYearSelected: function onClickFinanceYearSelected() {
      this.clearPrevAction();
    },

    /**
     * Event Handler
     * 
     * onClickFinanceQuarterSelected (re)sets the date range to the selected quarter's dates setting both the start
     * and end dates of the range. If the previous action was a quarter selection, the new selection is added
     * to the existing date range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickFinanceQuarterSelected: function onClickFinanceQuarterSelected(dateInView, event, value) {
      var _this4 = this;

      //console.log(`DateRangeShortcustsFinance.onClickFinanceQuarterSelected( )`, {dateInView: dateInView, event: event, value: value , params: params})
      var _dates = [];

      var _d = this.validateDate(dateInView);

      for (var _len10 = arguments.length, params = new Array(_len10 > 3 ? _len10 - 3 : 0), _key10 = 3; _key10 < _len10; _key10++) {
        params[_key10 - 3] = arguments[_key10];
      }

      var action = params[0],
          conditions = params[1];
      action.map(function (year, index) {
        event.map(function (val, index) {
          var _qdates = _this4.getQuarterDates(year, val);

          _dates.push.apply(_dates, _toConsumableArray(_qdates));
        });
      });

      if (typeof conditions === 'undefined' || !action.length || action.every(function (year) {
        return year > _this4.currentYear();
      }) || this.evaluate(conditions, event)) {
        this.setDateRange(_dates);
      } else {
        this.processMode(_dates);
      }
    },

    /**
     * Event Handler
     * 
     * onClickFinancePeriodSelected (re)sets the date range to the selected period's dates setting both the start
     * and end dates of the range. If the previous action was a period selection, the new selection is added
     * to the existing date range. The event handler implements the `IShortcutAction` interface for
     * compatibility with the shortcuts form builder event.
     * 
     * Depending on the schema provided to the form builder, the resulting date range will be validated against one or
     * more trivial rejections tests. For more information see the `evaluate()` function
     * 
     * If the validation is set, and the date range fails validation, the date range will be
     * further analyzed depending on the picker's mode before being rejected, partially applied or fully applied.  
     * See `processMode()` for additonal information.
     * 
     * @param  {Object} dateInView Master picker's current view
     * @param  {Any}    event      Vue event object
     * @param  {Any}    value      Component's value
     * @param  {Any}    params     On or more additional parameters as configured via the form builder
     *                             This could be additional data required for validation or further processing
     *                             This also could be a method name that needs to be evaluated
     *                             This also could be `undefined`
     * @return {void} 
     */
    onClickFinancePeriodSelected: function onClickFinancePeriodSelected(dateInView, event, value) {
      var _this5 = this;

      var _dates = [];

      var _d = this.validateDate(dateInView);

      for (var _len11 = arguments.length, params = new Array(_len11 > 3 ? _len11 - 3 : 0), _key11 = 3; _key11 < _len11; _key11++) {
        params[_key11 - 3] = arguments[_key11];
      }

      var actions = params[0],
          conditions = params[1];
      actions.map(function (year, index) {
        var _yr = _this5.validateDate(year);

        event.map(function (val, index) {
          _dates.push.apply(_dates, _toConsumableArray(_this5.getPeriodDates(year, val)));
        });
      });

      if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
        this.setDateRange(_dates);
      } else {
        this.processMode(_dates); //, event.length > 1 ? 'bully' : null
      }
    },

    /** ============================== Validation functions ============================== */

    /**
     * Trivial Rejec Test (TRT)
     * 
     * allowsPastDates returns true if the picker is configured to allow for the selection of
     * past dates.
     * 
     * @param  {[type]}  [description]
     * @return {[type]}  [description]
     */
    allowsPastDates: function allowsPastDates() {
      return this.allowBackInTime;
    },

    /**
     * Trivial Reject Test (TRT)
     * 
     * todayIsStartOfWeek returns true if the current date corresponds to the start of the
     * current week.
     * 
     * @param  {Any}        date
     * @return {Boolean}
     */
    todayIsStartOfWeek: function todayIsStartOfWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (date === null && this.pickerConfig.mode !== 'strict') return true;

      var _dayNum = this.dayNum(date);

      return _dayNum === 0;
    },

    /**
     * Trivial Reject Test (TRT)
     * 
     * todayIsStartOfMonth returns true if the current date corresponds to the start of the
     * current month.
     * 
     * @param  {Any}        date
     * @return {Boolean}
     */
    todayIsStartOfMonth: function todayIsStartOfMonth() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (date === null && this.pickerConfig.mode !== 'strict') return true;

      var _dayNum = this.now.getDate();

      return _dayNum === 1;
    },

    /**
     * Trivial Reject Test (TRT)
     * 
     * todayIsStartOfYear returns true if the current date corresponds to the sart of the
     * current (date is null) or provided year(s).
     * 
     * @param  {String[] | String}  date    String or Array of Strings each formatted as YYYY-MM-DD    
     * @return {Boolean}
     */
    todayIsStartOfYear: function todayIsStartOfYear() {
      var _this6 = this;

      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      //console.log(`DateRangeShortcutsFinance.todayOsStartOfYear( ${date })`, date)
      if (date === null || Array.isArray(date) && date.length === 0) {
        return true;
      }

      if ((typeof date === 'string' || typeof date === 'number') && this.currentYear(date) > this.currentYear(this.dateToISOStr(this.now))) {
        return true;
      }

      if (Array.isArray(date)) {
        if (date.length === 1) {
          return this.todayIsStartOfYear(date[0]);
        } else {
          var _results = [];

          if (this.pickerConfig.mode === 'strict') {
            date.map(function (_dt) {
              return _results.push(_this6.todayIsStartOfYear(_dt));
            });
            return _results.every(function (_yr) {
              return _yr === true;
            });
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.todayIsStartOfYear(date[date.length - 1]);
          }
        }
      }

      var _result = this.currentMonth() === 0 && this.currentDate() === 1; //console.log(`DateRangeShortcutsFinance.todayisStartOfYear( ${date} ) = ${_result}`)


      return _result;
    },

    /**
     * Trivial Regject Test (TRT)
     * 
     * weekIsNotPast returns true if the week number(s) provided do not include dates that are
     * earlier than today's date.
     * 
     * Issues: Warnings
     * 
     * When an array of week numbers is provided, and the mutliRange flag is not set, the tests will 
     * issue a warning if the week numbers are not sequential. 
     * 
     * @param  {Array | Numeric} week  Integer or Array of integers corresponding to the week numbers
     *                                 to test. Week numbers should be between 1 and 52 (inclusive)
     * 
     * @return {Boolean}
     */
    weekIsNotPast: function weekIsNotPast() {
      var _this7 = this;

      var week = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      //console.log(`weekIsNotPast( ${week}, ${this.pickerConfig.mode})`, week)
      if (week === null && this.pickerConfig.mode !== 'strict') return true;

      if (week === null || Array.isArray(week) && week.length === 0) {
        return true;
      }

      if (!this.multiRange && Array.isArray(week) && week.length > 1) {
        var _wkcopy = week.slice(0);

        _wkcopy.sort();

        var _sequentail = _wkcopy.every(function (num, i) {
          var _test = i === _wkcopy.length - 1 || _wkcopy[i + 1] === num + 1;

          return _test;
        });

        if (!_sequentail) this.warningSingleRangeMode();
      }

      var _week = null;

      if (Array.isArray(week)) {
        if (week.length === 1) {
          _week = week[0];
        } else {
          var _results = [];

          if (this.pickerConfig.mode === 'strict') {
            week.map(function (_wk) {
              return _results.push(_this7.weekIsNotPast(_wk));
            });
            return _results.every(function (val) {
              return val === true;
            });
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.weekIsNotPast(week[week.length - 1]);
          }
        }
      } else {
        _week = week;
      } //console.log({currentWeek: this.currentWeek(), selectedWeek: _week})


      return this.currentWeek() - parseInt(_week, 10) < 0;
    },

    /**
     * Trivial Reject Test (TRT)
     * 
     * monthIsNotPast returns true if the month number(s) provided do not include dates that are earlier 
     * that today's date.
     * 
     * Issues: Warnings
     * 
     * When an array of month numbers is provided, and the mutliRange flag is not set, the tests will 
     * issue a warning if the month numbers are not sequential. 
     * 
     * @param  {Array | Numeric} month  Integer or Array of integers corresponding to the month numbers
     *                                  to test. Month numbers should be between 1 and 12 (inclusive)
     * @return {Boolean}
     */
    monthIsNotPast: function monthIsNotPast() {
      var _this8 = this;

      var month = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      //console.log(`monthIsNotPast( ${month}, ${this.pickerConfig.mode})`, month)
      if (month === null && this.pickerConfig.mode !== 'strict') {
        return true;
      }

      if (month === null || Array.isArray(month) && month.length === 0) {
        return true;
      }

      if (!this.multiRange && Array.isArray(month) && month.length > 1) {
        var _mncopy = month.slice(0);

        _mncopy.sort();

        var _sequential = _mncopy.every(function (num, i) {
          var _test = i === _mncopy.length - 1 || _mncopy[i + 1] === num + 1;

          return _test;
        });

        if (!_sequential) this.warningSingleRangeMode();
      }

      var _month = null;

      if (Array.isArray(month)) {
        if (month.length === 1) {
          _month = month[0];
        } else {
          var _results = [];

          if (this.pickerConfig.mode === 'strict') {
            month.map(function (_mn) {
              return _results.push(_this8.monthIsNotPast(_mn));
            });
            return _results.every(function (val) {
              return val === true;
            });
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.monthIsNotPast(month[month.length - 1]);
          }
        }
      } else {
        _month = month;
      }

      return this.currentMonth() - parseInt(_month, 10) < 0;
    },

    /**
     * Trivial Reject Test (TRT)
     * 
     * periodIsNotPast returns true if the period numbers(s) provided do not include dates that are earlier
     * that today's date.
     * 
     * Issues: Warnings
     * 
     * When an array of period numbers is provided, and the mutliRange flag is not set, the tests will 
     * issue a warning if the period numbers are not sequential.
     * 
     * @param  {Array | Numeric} period Integer or Array of integers corresponding to the period numbers
     *                                  to test. Period numbers should be between 1 and 13 (inclusive)
     * @return {Boolean}
     */
    periodIsNotPast: function periodIsNotPast() {
      var _this9 = this;

      var period = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (period === null && this.pickerConfig.mode === 'strict') {
        return true;
      }

      if (period === null || Array.isArray(period) && period.length === 0) {
        return true;
      }

      if (!this.multiRange && Array.isArray(period) && period.length > 1) {
        var _pcopy = period.slice(0);

        _pcopy.sort();

        var _sequential = _pcopy.every(function (num, i) {
          var _test = i === _pcopy.length - 1 || _pcopy[i + 1] === num + 1;

          return _test;
        });

        if (!_sequential) this.warningSingleRangeMode();
      }

      var _period = null;

      if (Array.isArray(period)) {
        if (period.length === 1) {
          _period = period[0];
        } else {
          var _results = [];

          if (this.pickerConfig.mode === 'strict') {
            period.map(function (_pn) {
              return _results.push(_this9.periodIsNotPast(_pn));
            });
            return _results.every(function (val) {
              return val === true;
            });
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.periodIsNotPast(period[period.length - 1]);
          }
        }
      } else {
        _period = period;
      }

      return this.currentPeriod() - parseInt(_period, 10) < 0;
    },

    /**
     * Trivial Reject Test (TRT)
     * 
     * quarterIsNotPast returns true if the quarter number(s) provided do not include dates that are earlier
     * than today's date.
     * 
     * Issues: Warnings
     * 
     * When an array of quater numbers is provided, and the mutliRange flag is not set, the tests will 
     * issue a warning if the quarter numbers are not sequential. 
     * 
     * @param  {Array | Numeric} quarter Integer or Array of integers corresponding to the quarter numbers
     *                                   to test. Quarter numbers should be between -1 and 4 (inclusive) where
     *                                   -1 corresponds to the previous quarter
     *                                    0 corresponds to the current quarter
     *                                    1-4 corresponds to a quarter number 
     * @return {Boolean}
     */
    quarterIsNotPast: function quarterIsNotPast() {
      var _this10 = this;

      var quarter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      //console.log('DateRangeShortcutsFinance.quarterIsNotPast()', quarter)
      if (quarter === null && this.pickerConfig.mode === 'strict') {
        return true;
      }

      if (quarter === null || Array.isArray(quarter) && quarter.length === 0) {
        return true;
      }

      if (!this.multiRange && Array.isArray(quarter) && quarter.length > 1) {
        var _qrcopy = quarter.slice(0);

        _qrcopy.sort();

        var _sequential = _qrcopy.every(function (num, i) {
          var _test = i === _qrcopy.length - 1 || _qrcopy[i + 1] === num + 1;

          return _test;
        });

        if (!_sequential) this.warningSingleRangeMode();
      }

      var _quarter = null;

      if (Array.isArray(quarter)) {
        if (quarter.length === 1) {
          _quarter = quarter[0];
        } else {
          var _results = [];

          if (this.pickerConfig.mode === 'strict') {
            quarter.map(function (_qn) {
              return _results.push(_this10.quarterIsNotPast(_qn));
            });
            return _results.every(function (_qr) {
              return _qr === true;
            });
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.quarterIsNotPast(quarter[quarter.length - 1]);
          }
        }
      } else {
        _quarter = quarter;
      }

      return this.currentQuarter() - parseInt(_quarter, 10) < 0;
    },

    /**
     * Tivial Reject Test (TRT)
     * 
     * todayIsInRange returns true if today's date falls within the range provided.
     * 
     * @param  {String[]} dates Array of strings each formatted as YYYY-MM-DD
     * @return {Boolean}
     */
    todayIsInRange: function todayIsInRange() {
      var dates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      //console.log('todayIsInRange', dates)
      var _now = this.dateToISOStr(this.now);

      if (Array.isArray(dates) && dates.length >= 2) {
        if (dates.length === 2) {
          return this.deltaDate(dates[0], _now) >= 0 && this.deltaDate(_now, dates[1]) >= 0;
        } else if (this.multiRange && dates.length % 2 === 0) ; else {
          var _dtcopy = dates.slice(0);

          if (this.pickerConfig.mode === 'strict') {
            _dtcopy.sort();

            return this.todayIsInRange([_dtcopy[0], _dtcopy[_dtcopy.length - 1]]);
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.todayIsInRange([_dtcopy[_dtcopy.length - 2], _dtcopy[_dtcopy.length - 1]]);
          }
        }
      }

      return false;
    },

    /** ============================== Date API ==============================
     * The following are wrappers over the date API that should implement the
     * `IDateAPI` interface. 
     */

    /**
     * dayNum returns the day of the week where sunday = 0
     * 
     * @param  {Any}        date    A Date object, a string or numeric representation of a date
     *                              If `null` returns today's day of the week
     * @return {Numeric}            An integer between 0 and 6 corresponding to a day of the week
     */
    dayNum: function dayNum() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getDayOfWeek(date);
    },

    /**
     * currentDate returns the day of the month
     * 
     * @param  {Any}        date    A Date object, a string or numeric representation of a date
     *                              If `null` returns today's date
     * @return {Numeric}            An integer between 0 and 31 corresponding to the day of the month
     */
    currentDate: function currentDate() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getCurrentDate(date);
    },

    /**
     * currentWeek returns the week of the year
     * 
     * @param  {Any}        date    A Date object, a string or numeric representation of a date
     *                              if `null` returns current week
     * @return {Numeric}            An integer between 1 and 52 corresponding to the week number 
     */
    currentWeek: function currentWeek() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getCurrentWeek(date);
    },

    /**
     * weekNumbers returns an array of localized labels composed from the start and end dates for the 52 weeks of the year
     * 
     * @param  {Any}        date    A Date object, a string or numeric representation of a date
     *                              If `null` returns the current year's dates
     * @return {Array of Objects}   Array should contain 52 objects each with a `text` and `value` element.
     *                              The `text` element corresponds to a label describing the week
     *                              The `value` element is the week number for futher processing
     */
    weekNumbers: function weekNumbers(date) {
      var result = [];
      var data = this.getWeekNumbers(date); //console.log(`Week data for ${date}: `, data)

      for (var x = 1; x < data.length; x++) {
        result.push({
          text: "".concat(this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.week')), " #").concat(x, " [").concat(data[x].start.utc().format('MMM Do'), " - ").concat(data[x].end.utc().format('MMM Do'), "]"),
          value: x
        });
      }

      return result;
    },

    /**
     * currentWeekRange returns a date range for a week
     * 
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` uses today's date to identify week
     * @return {String[]}           Array of strings each formated as YYYY-MM-DD
     */
    currentWeekRange: function currentWeekRange() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _d = new Date(date);

      var _start = this.dateToISOStr(this.dateStartOfWeek(_d));

      var _end = this.dateToISOStr(this.dateEndOfWeek(_d));

      return [_start, _end];
    },

    /**
     * currentMonth returns an integer corresponding to a month
     * 
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` usses today's date to identify month
     * @return {Numeric}            Integer corresponding to the month
     */
    currentMonth: function currentMonth() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getCurrentMonth(date);
    },

    /**
     * currentPeriod returns an integer corresponding to a period
     * 
     * @param  {String | null} date A string describing a date foramtted as YYYY-MM-DD
     *                              If `null` uses today's date to identify period
     * @return {Numeric}            Integer corresponding to the period      
     */
    currentPeriod: function currentPeriod() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getCurrentPeriod(date) || 0;
    },

    /**
     * currentQuarter returns an integer correponding to a quarter
     * 
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` uses today's date to identify quarter
     * @return {Numeric}            Integer corresponding to the quarter
     */
    currentQuarter: function currentQuarter() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getCurrentQuarter(date) || 0;
    },

    /**
     * currentYear returns an integer corresponding to a year
     * 
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` uses today's date to identify year
     * @return {Numeric}            Integer corresponding to the year
     */
    currentYear: function currentYear() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.getCurrentYear(date);
    },

    /**
     * monthNames returns a list of localized month names
     * 
     * @return {Array of Objects}   Array should contain 12 objects each with a `text` and `value` element.
     *                              The `text` element corresponds to a months long name
     *                              The `value` element is the month number for futher processing 
     */
    monthNames: function monthNames() {
      return this.getMonthLongNames(this.$vuetify.lang.current).map(function (val, index) {
        return {
          text: val,
          value: index
        };
      });
    },

    /**
     * yearNumbers returns a list of years limited to:
     *  +/- 10 years from current date
     *  limited by min/max properties
     *  limited allowBackInTime flag
     * 
     * @return {Array of Objects}       Array should contain 12 objects each with a `text` and `value` element.
     *                                  The `text` element corresponds to the year
     *                                  The `value` element is the year for futher processing 
     */
    yearNumbers: function yearNumbers() {
      var result = [];

      var _date = new Date();

      var maxYear = this.max ? parseInt(this.max, 10) : _date.getFullYear() + 10;

      var _min = this.min || !this.allowBackInTime ? _date.getFullYear() : undefined;

      var minYear = this.min ? parseInt(this.min, 10) : this.allowBackInTime === false ? _date.getFullYear() : _date.getFullYear() - 10;

      for (var year = maxYear; year >= minYear; year--) {
        result.push(year);
      }

      result.sort();
      return result.map(function (val, index) {
        return {
          text: val,
          value: val
        };
      });
    },

    /**
     * periodList returns an array of localized labels for the 13 4-week periods of the year
     *   
     * @return {Array of Objects}       Array should contain 13 objects each with a `text` and `value` element.
     *                                  The `text` element corresponds to a localized label describing the period
     *                                  The `value` element is the period number for futher processing 
     */
    periodList: function periodList() {
      return [{
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p1')),
        value: 1
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p2')),
        value: 2
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p3')),
        value: 3
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p4')),
        value: 4
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p5')),
        value: 5
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p6')),
        value: 6
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p7')),
        value: 7
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p8')),
        value: 8
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p9')),
        value: 9
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p10')),
        value: 10
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p11')),
        value: 11
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p12')),
        value: 12
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p13')),
        value: 13
      }];
    },

    /**
     * quarterList returns an array of localized labels for the 4 quaters of the year as well as accelerators
     * for the current and last quater
     *  
     * @return {Array of Objects}       Array should contain 4 objects each with a `text` and `value` element.
     *                                  The `text` element corresponds to a localized table describing the quarter
     *                                  The `value` element is the quarter number for futher processing 
     */
    quarterList: function quarterList() {
      return [{
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q1')),
        value: 1
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q2')),
        value: 2
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q3')),
        value: 3
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q4')),
        value: 4
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.current')),
        value: 0
      }, {
        text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.last')),
        value: -1
      }];
    }
  },
  created: function created() {
    this.now = new Date();
  }
};

//
var script = {
  name: 'VDateRangePanel',
  mixins: [FinanceShortcuts],
  data: function data() {
    return {
      btnGroup: null
    };
  },
  props: {
    allowBackInTime: {
      type: Boolean,
      default: true
    }
  }
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('v-item-group',{staticClass:"hidden-lg-and-down",attrs:{"value":"false"}},[_c('v-layout',{staticClass:"overflow-hidden; pl-3 pt-1",attrs:{"align-center":"","justify-start":"","row":"","fill-height":""}},_vm._l((_vm.pickerOptions),function(option,pindex){return _c('v-item',{key:pindex},[(option.visible)?_c('div',{attrs:{"slot-scoped":"{ active }"}},[_vm._v("\n                "+_vm._s(_vm.$vuetify.t(option.title))+"\n                "),_c('v-btn',{staticClass:"mr-2",attrs:{"slot":"activator","flat":"","fab":"","small":""},on:{"click":function($event){return _vm.showHidePanel(option)}},slot:"activator"},[_c('v-icon',[_vm._v(_vm._s(option.show ? 'unfold_less' : 'unfold_more'))])],1),_vm._v(" "),_c('v-btn-toggle',{staticClass:"mx-2",attrs:{"value":"true"},model:{value:(_vm.btnGroup),callback:function ($$v) {_vm.btnGroup=$$v;},expression:"btnGroup"}},[(option.type === 'group' && option.show)?[_vm._l((option.options),function(compo,cindex){return [((_vm.allowBackInTime || _vm.evaluate(compo.if)))?_c(compo.type,{key:cindex,tag:"component",attrs:{"block":"","dense":"","flat":"","loading":compo.loading},on:{"change":function($event){_vm.onAction(
                                            _vm.pickerConfig.pickerDate,
                                            $event, 
                                            compo.action, 
                                            compo.value, 
                                            _vm.getSiblingData(option, compo.needs) || null,
                                            compo.if
                                        );}}},[(compo.icon)?_c('v-icon',[_vm._v(_vm._s(compo.icon))]):_vm._e(),_vm._v(" "),_c('template',{slot:"default"},[_vm._v("\n                                    "+_vm._s(_vm.$vuetify.t(compo.title))+"\n                                ")])],2):_vm._e()]})]:(option.show)?_vm._l((option.options),function(compo,cindex){return [((_vm.allowBackInTime || _vm.evaluate(compo.if)))?_c(compo.type,{key:cindex,ref:compo.ref,refInFor:true,tag:"component",staticClass:"ma-0 mx-1 pa-0 px-1",staticStyle:{"max-width":"220px"},attrs:{"clearable":_vm.multiRange || compo.multiple,"deletable-chips":true,"dense":true,"flat":true,"hide-details":true,"items":_vm.buildSelectionList(compo.items),"item-text":_vm.getItemText,"item-value":_vm.getItemValue,"label":_vm.$vuetify.t(compo.label),"loading":compo.loading,"multiple":compo.multiple,"no-data-text":_vm.$vuetify.t(compo.label),"prepend-icon":compo.icon,"single-line":true,"small-chips":true,"value":compo.isOpen,"compo":compo},on:{"change":function($event){_vm.onAction(
                                        _vm.pickerConfig.pickerDate,
                                        $event, 
                                        compo.action, 
                                        typeof compo.value === 'boolean' ? !compo.value : compo.value, 
                                        _vm.getSiblingData(option, compo.needs) || null,
                                        compo.if
                                    );}},scopedSlots:_vm._u([{key:"selection",fn:function(ref){
                                    var item = ref.item;
                                    var index = ref.index;
return [(item.text.length > 5)?[(compo.value.length === 1)?[(index === 0)?_c('v-chip',{attrs:{"small":true}},[_c('span',[_vm._v(_vm._s(item.text))])]):_vm._e()]:[(index === 0)?_c('span',{staticClass:"grey--text"},[_vm._v("\n                                            "+_vm._s(compo.value.length)+" selected\n                                        ")]):_vm._e()]]:[(index === 0)?_c('v-chip',{attrs:{"small":true}},[_c('span',[_vm._v(_vm._s(item.text))])]):_vm._e(),_vm._v(" "),(index === 1)?_c('span',{staticClass:"grey--text caption"},[_vm._v("(+"+_vm._s(compo.value.length - 1)+" others)")]):_vm._e()]]}}]),model:{value:(compo.value),callback:function ($$v) {_vm.$set(compo, "value", $$v);},expression:"compo.value"}},[_vm._v(" "),_c('template',{slot:"default"},[_vm._v("\n                                "+_vm._s(_vm.$vuetify.t(compo.title))+"\n                            ")])],2):_vm._e()]}):_vm._e()],2)],1):_c('div',{attrs:{"slot-scoped":"{action}"}})])}),1)],1)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var DateRangeShortcutPanel = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

module.exports = DateRangeShortcutPanel;
