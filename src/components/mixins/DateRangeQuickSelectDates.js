import DateHelper from '../../mixins/DateHelper.js'
import DateAPI from './DateAPIs/DateAPI.moment.js'

//temporary
import moment from 'moment'

export default {
    mixins: [DateHelper, DateAPI],
    data: () => ({
        now: null,
        pickerOptions: [ 
            { 
                title: 'Helpers', 
                icon: 'fastfood',
                visible: true,
                show: false,
                options: [
                    {
                        title: 'Yesterday',
                        type: 'v-btn',
                        icon: '',
                        if: 'allowsPastDates',
                        action:'onClickYesterday',
                        value: false
                    },
                    {
                        title: 'Last Week',
                        type: 'v-btn',
                        icon: '',
                        if: 'allowsPastDates',
                        action: 'onClickLastWeek',
                        value: false
                    },
                    {
                        title: 'This Week',
                        type: 'v-btn',
                        icon: '',
                        if: 'todayIsStartOfWeek', 
                        action: 'onClickThisWeek',
                        value: false
                    },
                    {
                        title: 'Last Month',
                        type: 'v-btn',
                        icon: '',
                        if: 'allowsPastDates',
                        action: 'onClickLastMonth',
                        value: false
                    },
                    {
                        title: 'This Month',
                        type: 'v-btn',
                        icon: '',
                        if: 'todayIsStartOfMonth',
                        action: 'onClickThisMonth',
                        value: false
                    },
                    {
                        title: 'Next 3 Months',
                        type: 'v-btn',
                        icon: '',
                        action: 'onClickNext3Months',
                        value: false
                    }
                ] 
            },
            { 
                title: 'Calendar', 
                icon: 'calendar_today',
                visible: true,
                show: false,
                options: [
                    {
                        title: 'Week by number',
                        label: 'Week by number',
                        type: 'v-select',
                        multiple: true,
                        items: 'weekNumbers',
                        icon: '',
                        if: 'weekIsNotPast',
                        isOpen: undefined,
                        loading: false,
                        action: 'onClickCalWeekSelect',
                        ref: 'calWeekSelection',
                        value: []
                    },
                    {
                        title: 'Months by name',
                        label: 'Month by name',
                        type: 'v-select',
                        multiple: true,
                        items: 'monthNames',
                        icon: '',
                        if: 'monthIsNotPast',
                        isOpen: undefined,
                        loading: false,
                        action: 'onClickCalMonthSelect',
                        ref: 'calMonthSelection',
                        value: []
                    },
                    {
                        title: 'Years',
                        label: 'Year',
                        type: 'v-select',
                        multiple: true,
                        items: 'yearNumbers',
                        icon: '',
                        if: 'todayIsStartOfYear',
                        isOpen: undefined,
                        loading: false,
                        action: 'onClickCalYearSelect',
                        ref: 'calYearlSelection',
                        value: []
                    }
                ] 
            },
            {
                title: 'Financial',
                icon: 'attach_money',
                visible: true,
                show: false,
                options: [
                    {
                        title: 'Year',
                        label: 'Select year',
                        type: 'v-select',
                        attributes: {
                            outline: true
                        },
                        multiple: false,
                        items: 'yearNumbers',
                        icon: 'looks_one',
                        isOpen: undefined,
                        loading: false,
                        action: 'onClickFinanceYearSelected',
                        ref: 'financeYearChoice',
                        value: []
                    },
                    {
                        title: 'Quarter',
                        label: 'Select quarter(s)',
                        type: 'v-select',
                        multiple: true,
                        items: 'quarterList',
                        icon: 'looks_two',
                        if: 'quarterIsNotPast',
                        isOpen: undefined,
                        loading: false,
                        action: 'onClickFinanceQuarterSelected',
                        ref: 'financeQuarterChoice',
                        needs: 'financeYearChoice',
                        value: []
                    },
                    {
                        title: 'Periods',
                        label: 'Select period(s)',
                        type: 'v-select',
                        multiple: true,
                        items: 'periodList',
                        icon: 'looks_two',
                        if: 'periodIsNotPast',
                        isOpen: undefined,
                        loading: false,
                        action: 'onClickFinancePeriodSelected',
                        ref: 'financePeriodChoice',
                        needs: 'financeYearChoice',
                        value: []
                    }
                ]                   
            }
        ],    
    }),
    props: {
        updateDateRange: {
            type: Function,
            default: () => ({})
        }
    },
    methods: {
        setDateRange (_dates) {
            this.clearSelection() 
            this.updateDateRange(_dates)
        },

        /** ============================== Toggle button handlers ============================== */

        /**
         * [onClickYesterday description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickYesterday (dateInView, event, value, params) {
            let _dates = []
            if (value === true) {
                let _d = new Date()
                _d.setDate(_d.getDate()-1)
                _dates.push(this.dateToISOStr(_d))
            }
            this.setDateRange(_dates)
        },

        /**
         * [onClickLastWeek description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickLastWeek (dateInView, event, value, params) {
            let _dates = []
            if (value === true) {
                let _d = new Date()
                _dates.push(this.dateToISOStr(this.dateStartPrevWeek( _d)) )
                _dates.push(this.dateToISOStr(this.dateEndPrevWeek(_d)) )
            }
            this.setDateRange(_dates)
        },

        /**
         * [onClickThisWeek description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickThisWeek (dateInView, event, value, ...params) {
            let _dates = []
            if (value === true) {
                let _d = new Date()
                let _start = this.dateToISOStr( this.dateStartOfWeek( _d ) )
                _dates.push( _start )
                let _end = this.dateToISOStr( this.dateEndOfWeek( _d ) )
                _dates.push( _end )
            }
            let [action, conditions] = params
            if (typeof conditions === 'undefined' || this.evaluate(conditions)) {
                this.setDateRange(_dates)
            } else {
                processMode(_dates)
            }
        },

        /**
         * [onClickNextMonth description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickNextMonth (dateInView, event, value, params) {
            let _dates = []
            if (value === true) {
                let _start = this.dateToISOStr( this.dateStartOfMonth().add(1, 'months') )
                let _end = this.dateToISOStr( this.dateEndOfMonth( _start ) )
                _dates.push( _start )
                _dates.push( _end )
            }
            this.setDateRange(_dates)
        },

        /**
         * [onClickLastMonth description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickLastMonth (dateInView, event, value, params) {
            let _dates =[]
            if (value === true) {
                let _start = this.dateToISOStr( this.dateStartOfMonth().subtract(1, 'months'))
                let _end = this.dateToISOStr( this.dateEndOfMonth( _start) )
                _dates.push( _start )
                _dates.push( _end )
            }
            this.setDateRange(_dates)
        },

        /**
         * [onClickThisMonth description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickThisMonth (dateInView, event, value, params) {
            let _dates = []
            if (value === true) {
                _dates.push( this.dateToISOStr(this.dateStartOfMonth() ))
                _dates.push( this.dateToISOStr(this.dateEndOfMonth() ))
            }
            this.setDateRange(_dates)
        },

        /**
         * [onClickNext3Months description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickNext3Months (dateInView, event, value, params) {
            let _dates = []
            if (value === true) {
                let _d = this.dateStartOfMonth().add(1, 'months')
                _dates.push( this.dateToISOStr( _d ))
                _d.add(2, 'months')
                _dates.push( this.dateToISOStr(this.dateEndOfMonth(_d)) )
            }
            this.setDateRange(_dates)
        },

        /** ============================== Select handlers ============================== */
        //The following functions are not based on today's date
        
        /**
         * [onClickCalWeekSelect description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickCalWeekSelect ( dateInView, event, value, ...params ) {
            let _dates = []
            event.map( (val, index) => { 
                _dates.push(...this.momentGetWeekDates( null, val )) 
            })
            
            //with mutli-select we can find out what has been added to the list like this...
            let _diff = event.filter(elem => !value.includes(elem))
            
            //test the results before applying
            let [action, conditions] = params
            if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
                this.setDateRange(_dates)
            } else {
                this.processMode(_dates)
            }
        },

        /**
         * [onClickCalMonthSelect description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickCalMonthSelect ( dateInView, event, value, ...params ) {
            console.log(`DateRangeFinance.onClickMonthSelect ( event: ${event}, value: ${value}, params: ${params}`)
            let _dates = []
            event.map( (val, index) => {
                _dates.push(...this.momentGetMonthDates( null, val ))
            })

            let [action, conditions] = params
            if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
                this.setDateRange(_dates)
            } else {
                this.processMode(_dates)
            }
        },

        /**
         * [onClickCalYearSelect description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickCalYearSelect ( dateInView, event, value, ...params ) {            
            let _dates = []
            event.map( (val, index) => {
                let _dStart = this.dateToISOStr(moment({year: val, month: 0, date: 1}))
                let _dEnd = this.dateToISOStr(moment({year: val, month: 11, date: 31}))
                _dates.push(_dStart)
                _dates.push(_dEnd)
            })

            let [action, conditions] = params
            if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
                this.setDateRange(_dates.sort())
            } else {
                this.processMode(_dates)
            }
        },
        
        /**
         * [onClickFinanceYearSelected description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickFinanceYearSelected ( dateInView, event, value, ...params ) {
            this.clearSelection()
        },

        /**
         * [onClickFinanceQuarterSelected description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickFinanceQuarterSelected ( dateInView, event, value, ...params ) {
            let _dates = []
            let _d = this.validateDate(dateInView)
            
            let [action, conditions] = params

            action.map( (year, index) => {
                let _yr = this.validateDate(year)
                event.map( (val, index) => {
                    _dates.push(...this.momentGetQuarterDates( year, val ))
                })
            })
            
            console.log({conditions: conditions})
            if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
                this.setDateRange( _dates.sort() )
            } else {
                this.processMode(_dates)
            }
        },

        /**
         * [onClickFinancePeriodSelected description]
         * @param  {[type]} dateInView [description]
         * @param  {[type]} event      [description]
         * @param  {[type]} value      [description]
         * @param  {[type]} params     [description]
         * @return {[type]}            [description]
         */
        onClickFinancePeriodSelected ( dateInView, event, value, ...params ) {
            console.log(`onClickFinancePeriodSelected( ${dateInView}, ${event}, ${value}, ${params})`)
            let _dates = []
            let _d = this.validateDate(dateInView)
            
            let [actions, conditions] = params
            console.log({actions: actions, conditions: conditions})

            actions.map( (year, index) => {
                let _yr = this.validateDate(year)
                event.map( (val, index) => {
                    _dates.push(...this.momentGetPeriodDates( year, val ))
                })
            })
            console.log({date: _dates})
            if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
                this.setDateRange( _dates.sort() )
            } else {
                this.processMode(_dates)
            }
        },

        /** ============================== Validation functions ============================== */

        allowsPastDates( ) {
            return this.allowBackInTime
        },

        todayIsStartOfWeek ( date = null ) { 
            let _dayNum = this.dayNum( date )
            return _dayNum === 0
        },

        todayIsStartOfMonth ( date = null ) {
            if ( this.now.getDate() !== 1 ) {
                return false
            }

            return true
        },

        todayIsInRange ( dates = null ) {
            let _now = this.dateToISOStr(this.now)
            if (Array.isArray(dates) && dates.length >= 2) {
                //TODO: support multi-rante
                if (dates.length === 2) {
                    return this.deltaDate(dates[0],_now) > 0 && this.deltaDate(_now, dates[1]) > 0
                }
            }
        },

        weekIsNotPast ( week = null ) {
            if (week === null || (Array.isArray(week) && week.length === 0)) {
                return true
            }

            let _week = null
            if (Array.isArray(week)) {
                if (week.length === 1) {
                    _week = week[0]
                } else {
                    let _results = []
                    week.map(_wk => _results.push(this.weekIsNotPast(_wk)))
                    return _results.every(val => val === true)
                }
            } else {
                _week = week
            }

            return this.currentWeek() - parseInt(_week,10) < 0
        },

        monthIsNotPast ( month = null ) {
            if (month === null || (Array.isArray(month) && month.length === 0)) {
                return true
            }

            let _month = null
            if (Array.isArray(month)) {
                if (month.length === 1) {
                    _month = month[0]
                } else {
                    let _results = []
                    month.map(_mn => _results.push(this.monthIsNotPast(_mn)))
                    return _results.every(val => val === true)
                }
            } else {
                _month = month
            }

            return this.currentMonth() - parseInt(_month, 10) < 0
        },

        periodIsNotPast ( period = null ) {
            if (period === null || (Array.isArray(period) && period.length === 0)) {
                return true
            }

            let _period = null
            if (Array.isArray(period)) {
                if (period.length === 1) {
                    _period = period[0]
                } else {
                    let _results = []
                    period.map(_pn => _results.push(this.periodIsNotPast(_pn)))
                    return _results.every(val => val === true)
                }
            } else {
                _period = period
            }

            return this.currentPeriod() - parseInt(_period,10) < 0
        },

        quarterIsNotPast (quarter = null) {
            if (quarter === null || (Array.isArray(quarter) && quarter.length === 0)) {
                return true
            }

            let _quarter = null
            if (Array.isArray(quarter)) {
                if (quarter.length === 1) {
                    _quarter = quarter[0]
                } else {
                    let _results = []
                    quarter.map(_qn => _results.push(this.quarterIsNotPast(_qn)))
                }
            } else {
                _quarter = quarter
            }

            return this.currentQuarter() - parseInt(_quarter,10) < 0
        },

        todayIsStartOfYear ( date = null ) {
            if (date === null || (Array.isArray(date) && date.length === 0)) {
                return true
            }
            if (this.currentYear(date) > this.currentYear(this.dateToISOStr(this.now))) {
                return true
            }
            let _result = this.currentMonth() === 0 && this.currentDate() === 1 

            return _result
        },

        /** ============================== Date API ============================== */

        /**
         * This is the day of the week... so sunday = 0
         * @param {*} date 
         */
        dayNum ( date = null ) {
            let _mit = moment(date ? date : undefined)
            return _mit.day()
        },

        currentDate ( date = null) {
            let _mit = moment(date ? date : undefined)
            return _mit.date()
        },

        currentWeek ( date = null) {
            let _mit = moment(date ? date : undefined)
            return _mit.week()
        },

        /**
         * [weekNumbers description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        weekNumbers (date) {
            let result = []
            let data = this.momentWeekNumbers(date)
            for(let x=1;x<data.length;x++) {
                result.push({ text: `Week #${x} [${data[x].start.format('MMM Do')} - ${data[x].end.format('MMM Do')}]`, value: x})
            }
            return result
        },

        currentMonth ( date = null ) {
            let _mit = moment(date ? date : undefined)
            return _mit.month()
        },

        currentPeriod ( date = null ) {
            return this.momentGetCurrentPeriod() || 0
        },

        currentQuarter ( date = null ) {
            return this.momentGetCurrentQuarter() || 0
        },

        currentYear ( date = null ) {
            let _mit = moment(date ? date : undefined)
            return _mit.year()
        },

        /**
         * [monthNames description]
         * @return {[type]} [description]
         */
        monthNames () {
            return this.momentMonthShortNames().map( (val, index) => { return {text: val, value: index}} )
        },

        /**
         * [yearNumbers description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        yearNumbers (date) {
            return this.momentYearNumbers(date).map( (val, index) => { return {text: val, value: val}} )
        },

        /**
         * [periodList description]
         * @return {[type]} [description]
         */
        periodList () {
            return [
                {text: 'P1', value: 1},
                {text: 'P2', value: 2},
                {text: 'P3', value: 3},
                {text: 'P4', value: 4},
                {text: 'P5', value: 5},
                {text: 'P6', value: 6},
                {text: 'P7', value: 7},
                {text: 'P8', value: 8},
                {text: 'P9', value: 9},
                {text: 'P10', value: 10},
                {text: 'P11', value: 11},
                {text: 'P12', value: 12},
                {text: 'P13', value: 13},
            ]
        },

        /**
         * [quarterList description]
         * @return {[type]} [description]
         */
        quarterList () {
            return [
                {text: 'Q1', value: 1},
                {text: 'Q2', value: 2},
                {text: 'Q3', value: 3},
                {text: 'Q4', value: 4},
                {text: 'Current', value: 0},
                {text: 'Last', value: -1}
            ]
        },

        /** ============================== Date API Implementation using moment.js ============================== */
        
        /**
         * [momentYearNumbers description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        momentYearNumbers (date, currentYear = null) {
            let result = []
            const _currentYear = date ? date : currentYear
            let _date = this.validateDate(_currentYear)
            const maxYear = this.max 
                                ? parseInt(this.max, 10) 
                                : _date 
                                    ? _date.getFullYear() + 10 
                                    : moment().year() + 10

            let _min = this.min || !this.allowBackInTime ? moment().year() : undefined

            const minYear = this.min 
                                ? parseInt(this.min, 10) 
                                : this.allowBackInTime === false
                                    ? moment().year()
                                    : _date 
                                        ? _date.getFullYear() - 10 
                                        : moment().year() - 10

            for (let year = maxYear; year >= minYear; year--) {
                result.push(year)
            }
            return result.sort()
        },

        /**
         * [momentWeekNumbers description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        momentWeekNumbers (date) {                
            let _d = this.validateDate(date)
            let _dy = _d ? _d.getFullYear() : moment().year()

            let _data = []
            let _weeks = moment().weeksInYear([_dy])
            _data[0] = {year: _dy}
            for (let _x=1; _x<=_weeks; _x++) {
                let _wStart = moment([_dy]).week(_x).startOf('week')
                let _wEnd = moment([_dy]).week(_x).endOf('week').subtract(1, 'days')
                _data[_x] = {start: _wStart, end: _wEnd}
            }
            return _data
        },

        /**
         * [momentMonthNumbers description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        momentMonthNumbers (date) {
            let _d = this.validateDate(date)
            let _dy = _d ? _d.getFullYear() : moment().year()

            let _data = []
            _data[0] = {year: _dy}
            for (let _x=0; _x<12; _x++) {
                let _wStart = moment([_dy]).month(_x).startOf('month')
                let _wEnd = moment([_dy]).month(_x).endOf('month').subtract(1, 'days')
                _data[_x] = {start: _wStart, end: _wEnd}
            }

            return _data
        },

        /**
         * [momentQuarterNumbers description]
         * @param  {[type]} year [description]
         * @return {[type]}      [description]
         */
        momentQuarterNumbers (year) {
            let _year = parseInt(year) || moment().year()
            let _data = []
            _data[0] = {year: _year}
            for (let _x=1; _x<=4; _x++) {
                let _wStart = moment([_year]).quarter(_x).startOf('quarter')
                let _wEnd = moment([_year]).quarter(_x).endOf('quarter').subtract(1, 'days')
                _data[_x] = {start: _wStart, end: _wEnd}
            }

            return _data
        },

        /**
         * [momentPeriodNumbers description]
         * 
         * @param  {Numeric} year Periods for the requested year. If omitted, will return
         *                        periods for the current year.
         * 
         * @return {Array}        Array of objects each containing a start and end element
         */
        momentPeriodNumbers (year = null) {
            let _year = parseInt(year) || moment().year()
            let _data = []
            _data[0] = {year: _year}
            let _weeks = this.momentWeekNumbers( year )
            let _pn = 0
            for (let _x=1; _x<=52; _x += 4) {
                _pn++
                let _wStart = _pn === 1 ? this.dateToISOStr(_weeks[_x].start) : this.dateToISOStr( moment(_weeks[_x].start).add(1,'days') )
                let _wEnd = this.dateToISOStr( moment(_weeks[_x+3].end).add(1,'days') )
                _data[_pn] = {start: _wStart, end: _wEnd}
            }

            return _data
        },

        /**
         * [momentMonthShortNames description]
         * @return {[type]} [description]
         */
        momentMonthShortNames () {
            return Array.apply(0, Array(12)).map(function(_,i){return moment().month(i).format('MMM')})
        },

        /**
         * [momentMonthLongNames description]
         * @return {[type]} [description]
         */
        momentMonthLongNames () {
            return Array.apply(0, Array(12)).map(function(_,i){return moment().month(i).format('MMMM')})
        },

        /**
         * [momentStartOf description]
         * @param  {[type]} opt  [description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        momentStartOf (opt, date) {
            let _d = this.validateDate(date)  //returns null of validate date
            let _date = _d ? _d : moment()
            return moment(_date).startOf(opt)
        },

        /**
         * [momentEndOf description]
         * @param  {[type]} opt  [description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        momentEndOf (opt, date) {
            let _d = this.validateDate(date)  //returns null or validate date
            let _date = _d ? _d : moment()               
            return moment(_date).endOf(opt)
        },

        /**
         * [dateStartPrevWeek description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        dateStartPrevWeek (date) {
            let _d = this.validateDate(date)
            let _date = _d ? _d : moment()
            let _dw = this.dateStartOfWeek(this.dateToISOStr(_date))
            _dw.subtract(7, 'days')
            return _dw
        },

        /**
         * [dateEndPrevWeek description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        dateEndPrevWeek (date) {
            let _d = this.dateEndOfWeek(this.dateToISOStr(date))
            _d.subtract(7, 'days')
            return _d
        },

        /**
         * [dateStartOfWeek description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        dateStartOfWeek (date) {
            let _t = this.momentStartOf('week', date)
            return _t
        },

        /**
         * [dateEndOfWeek description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        dateEndOfWeek (date) {
            let _t = this.momentEndOf('week', date).subtract(1, 'days')
            return _t
        },

        /**
         * [dateStartOfMonth description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        dateStartOfMonth (date) {
            let _t = this.momentStartOf('month', date)
            return _t
        },

        /**
         * [dateEndOfMonth description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        dateEndOfMonth (date) {
            let _d = this.validateDate(date)
            let _t = this.momentEndOf('month', _d.toISOString()).subtract(1,'days')
            return _t
        },

        /**
         * [momentGetWeekDates description]
         * @param  {[type]} date       [description]
         * @param  {[type]} weekNumber [description]
         * @return {[type]}            [description]
         */
        momentGetWeekDates (date, weekNumber) {
            let _wn = parseInt(weekNumber) || 1
            let _data = this.momentWeekNumbers(date)

            return  [ this.dateToISOStr(_data[_wn].start), this.dateToISOStr(_data[_wn].end) ]             
        },

        /**
         * [momentGetMonthDates description]
         * @param  {[type]} date        [description]
         * @param  {[type]} monthNumber [description]
         * @return {[type]}             [description]
         */
        momentGetMonthDates (date, monthNumber) {
            let _mn = parseInt(monthNumber) || 0
            let _data = this.momentMonthNumbers(date)

            return [ this.dateToISOStr(_data[_mn].start), this.dateToISOStr(_data[_mn].end) ]
        },

        /**
         * [momentGetYearDates description]
         * @param  {[type]} date       [description]
         * @param  {[type]} yearNumber [description]
         * @return {[type]}            [description]
         */
        momentGetYearDates (date, yearNumber) {
            let _yn = parseInt(yearNumber) || moment().year()
            return [ this.momentStartOf('year', _yn), this.momentEndOf('year',_yn)]
        },

        /**
         * [momentGetQuarterDates description]
         * @param  {[type]} date          [description]
         * @param  {[type]} quarterNumber [description]
         * @return {[type]}               [description]
         */
        momentGetQuarterDates (date, quarterNumber) {
            let _qn = 1
            if (quarterNumber === 0) {
                _qn = this.momentGetCurrentQuarter(date)
            } else if (quarterNumber === -1) {
                _qn = this.momentGetCurrentQuarter(date)
                if (_qn === 1) {
                    return this.momentGetQuarterDates( this.dateToISOStr( moment(date).subtract(1, 'years') ), 4)
                }
            } else {
                _qn = parseInt(quarterNumber) || 1
            }
            
            let _data = this.momentQuarterNumbers(date)

            if (_data[_qn]) {
                return [ this.dateToISOStr(_data[_qn].start), this.dateToISOStr(_data[_qn].end) ]
            }

            return []
        },

        momentGetCurrentWeek (date = null, format = '') {
            if (date !== null && typeof date === 'string') {
                return moment(date,format).week()
            }

            return moment().week()
        },

        momentGetCurrentPeriod (date = null, format = '') {
            let _data = null
            let _now = moment()

            if (date !== null && typeof date === 'string') {
                _data = this.momentPeriodNumbers(moment(date,format).year())
            } else {
                _data = this.momentPeriodNumbers()
            }

            let _index = 0
            for (let period of _data) {
                if (_index !== 0) {
                    if (this.deltaDate(period.start, this.dateToISOStr(_now)) > 0 && this.deltaDate(this.dateToISOStr(_now), period.end) > 0) {
                        break;
                    }
                }
                _index++
            }

            return _index
        },

        momentGetCurrentQuarter (date = null) {
            if (date !== null && typeof date === 'string') {
                return moment(date, format).utc().quarter()
            }

            return moment().quarter()
        },

        /**
         * [momentGetPeriodDates description]
         * @param  {[type]} date         [description]
         * @param  {[type]} periodNumber [description]
         * @return {[type]}              [description]
         */
        momentGetPeriodDates (date, periodNumber) {
            let _pn = parseInt(periodNumber) || 1
            let _data = this.momentPeriodNumbers(date)

            return [ this.dateToISOStr(_data[_pn].start), this.dateToISOStr(_data[_pn].end) ]
        },

    },
    created() {
        this.now = new Date()
    }
}