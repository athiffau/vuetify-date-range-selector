import DateHelper from '../../mixins/DateHelper.js'
import DateAPI from './DateAPIs/DateAPI.moment.js'
import DateRangePlugin from './DateRangePlugin.js'

export default {
  mixins: [DateHelper, DateAPI, DateRangePlugin],
  data: () => ({
    now: null,
    pickerOptions: [
      {
        groupModel: null,
        icon: 'fastfood',
        show: false,
        title: '$vuetify.dateRangeShortcuts.fastFood.title',
        visible: true,
        type: 'group',
        options: [
          {
            action: 'onClickYesterday',
            icon: '',
            if: 'allowsPastDates',
            loading: false,
            title: '$vuetify.dateRangeShortcuts.fastFood.yesterday',
            type: 'v-btn',
            value: '1'
          },
          {
            action: 'onClickLastWeek',
            icon: '',
            if: 'allowsPastDates',
            loading: false,
            title: '$vuetify.dateRangeShortcuts.fastFood.lastWeek',
            type: 'v-btn',
            value: '2'
          },
          {
            action: 'onClickThisWeek',
            icon: '',
            if: 'todayIsStartOfWeek',
            loading: false,
            title: '$vuetify.dateRangeShortcuts.fastFood.thisWeek',
            type: 'v-btn',
            value: '3'
          },
          {
            action: 'onClickLastMonth',
            icon: '',
            if: 'allowsPastDates',
            loading: false,
            title: '$vuetify.dateRangeShortcuts.fastFood.lastMonth',
            type: 'v-btn',
            value: '4'
          },
          {
            action: 'onClickThisMonth',
            icon: '',
            if: 'todayIsStartOfMonth',
            loading: false,
            title: '$vuetify.dateRangeShortcuts.fastFood.thisMonth',
            type: 'v-btn',
            value: '5'
          },
          {
            action: 'onClickNext3Months',
            icon: '',
            if: undefined,
            loading: false,
            title: '$vuetify.dateRangeShortcuts.fastFood.next3Months',
            type: 'v-btn',
            value: '6'
          }
        ]
      },
      {
        groupModel: null,
        icon: 'calendar_today',
        show: false,
        title: '$vuetify.dateRangeShortcuts.calendar.title',
        visible: true,
        options: [
          {
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
          },
          {
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
          },
          {
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
          }
        ]
      },
      {
        groupModel: null,
        icon: 'attach_money',
        show: false,
        title: '$vuetify.dateRangeShortcuts.finance.title',
        visible: true,
        options: [
          {
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
          },
          {
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
          },
          {
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
          }
        ]
      }
    ]
  }),
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
    onClickYesterday (dateInView /*, event, value, ...params*/) {
      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        let _d = this.validateDate(this.startDate ? dateInView : null)
        _d.setDate(_d.getDate() - 1)
        _dates.push(this.dateToISOStr(_d))
      }
      this.setDateRange(_dates)
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
    onClickLastWeek (dateInView, event, value, ...params) {
      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        let _d = this.validateDate(this.startDate ? dateInView : null)
        _dates.push(this.dateToISOStr(this.dateStartPrevWeek(_d)))
        _dates.push(this.dateToISOStr(this.dateEndPrevWeek(_d)))

        let [actions, conditions] = params

        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates)
        } else {
          this.processMode(_dates)
        }

        this.processActions(actions)
      } else {
        this.setDateRange(_dates)
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
    onClickThisWeek (dateInView, event, value, ...params) {
      // console.log(dateInView, event, value, params)
      // console.log('btnGroup: ',this.btnGroup)

      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        let _d = this.validateDate(this.startDate ? dateInView : null)
        let _start = this.dateToISOStr(this.dateStartOfWeek(_d))
        _dates.push(_start)
        let _end = this.dateToISOStr(this.dateEndOfWeek(_d))
        _dates.push(_end)

        let [actions, conditions] = params
        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates)
        } else {
          this.processMode(_dates)
        }

        this.processActions(actions)
      } else {
        this.setDateRange(_dates)
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
    onClickNextMonth (dateInView, event, value, ...params) {
      // console.log(dateInView, event, value, params)
      // console.log('btnGroup: ', this.btnGroup)
      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        let _d = this.validateDate(this.startDate ? dateInView : null)
        let _start = this.dateToISOStr(this.dateStartOfMonth(_d).add(1, 'months'))
        let _end = this.dateToISOStr(this.dateEndOfMonth(_start))
        _dates.push(_start)
        _dates.push(_end)

        let [actions, conditions] = params
        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates)
        } else {
          this.processMode(_dates)
        }

        this.processActions(actions)
      } else {
        this.setDateRange(_dates)
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
    onClickLastMonth (dateInView, event, value, ...params) {
      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        let _d = this.validateDate(this.startDate ? dateInView : null)
        let _start = this.dateToISOStr(this.dateStartOfMonth(_d).subtract(1, 'months'))
        let _end = this.dateToISOStr(this.dateEndOfMonth(_start))
        _dates.push(_start)
        _dates.push(_end)

        let [actions, conditions] = params
        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates)
        } else {
          this.processMode(_dates)
        }

        this.processActions(actions)
      } else {
        this.setDateRange(_dates)
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
    onClickThisMonth (dateInView, event, value, ...params) {
      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        let _d = this.validateDate(this.startDate ? dateInView : null)
        _dates.push(this.dateToISOStr(this.dateStartOfMonth(_d)))
        _dates.push(this.dateToISOStr(this.dateEndOfMonth(_d)))

        let [actions, conditions] = params
        if (typeof conditions === 'undefined' || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates)
        } else {
          this.processMode(_dates)
        }

        this.processActions(actions)
      } else {
        this.setDateRange(_dates)
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
    onClickNext3Months (dateInView, event, value, ...params) {
      // console.log('onClickNext3Months', dateInView, event, value, params)
      let _dates = []
      if (this.btnGroup !== undefined && this.btnGroup !== null) {
        // console.log('btnGroup: ', this.btnGroup)
        let _d = this.dateStartOfMonth(this.validateDate(this.startDate ? dateInView : null)).add(1, 'months')
        _dates.push(this.dateToISOStr(_d))
        _d.add(2, 'months')
        _dates.push(this.dateToISOStr(this.dateEndOfMonth(_d)))

        let [actions, conditions] = params
        if (typeof conditions === 'undefined' || (Array.isArray(conditions) && conditions.every(val => val === undefined)) || this.evaluate(conditions, _dates)) {
          this.setDateRange(_dates)
        } else {
          this.processMode(_dates)
        }

        this.processActions(actions)
      } else {
        this.setDateRange(_dates)
      }
    },

    /** ============================== Select handlers ============================== */
    // The following functions are not based on today's date

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
    onClickCalWeekSelect (dateInView, event, value, ...params) {
      // console.log('DateRangeShortcutsFinance.onClickCalWeekSelect()', {date: dateInView, event:event, value: value, params: params})
      let _dates = []
      event.map((val) => {
        _dates.push(...this.getWeekDates(null, val))
      })

      // with mutli-select we can find out what has been added to the list like this...
      // let _diff = event.filter(elem => !value.includes(elem))

      if (!this.multiRange && Array.isArray(event) && event.length > 1) {
        let _ev = event.slice()
        _ev.sort()
        let _sequentail = _ev.every((num, i) => {
          let _test = i === _ev.length - 1 || _ev[i + 1] === num + 1
          return _test
        })
        if (!_sequentail) this.warningSingleRangeMode()
      }

      let [actions, conditions] = params
      if (typeof conditions === 'undefined' || event.every(week => week > this.currentWeek()) || this.evaluate(conditions, event)) {
        this.setDateRange(_dates)
      } else {
        this.processMode(_dates) //, event.length > 1 ? 'bully' : null
      }

      this.processActions(actions)
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
    onClickCalMonthSelect (dateInView, event, value, ...params) {
      // console.log('DateRangeShortcutsFinance.onClickCalMonthSelect()', {date: dateInView, event:event, value: value, params: params})
      let _dates = []
      event.map((val) => {
        _dates.push(...this.getMonthDates(null, val))
      })

      if (!this.multiRange && Array.isArray(event) && event.length > 1) {
        let _ev = event.slice()
        _ev.sort()
        let _sequentail = _ev.every((num, i) => {
          let _test = i === _ev.length - 1 || _ev[i + 1] === num + 1
          return _test
        })
        if (!_sequentail) this.warningSingleRangeMode()
      }

      let [actions, conditions] = params
      if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
        this.setDateRange(_dates)
      } else {
        this.processMode(_dates) //, event.length > 1 ? 'bully' : null
      }

      this.processActions(actions)
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
    onClickCalYearSelect (dateInView, event, value, ...params) {
      // console.log(`DateRangeShortcutsFinance.onClickCalYearSelect()`, {date: dateInView, event:event, value:value, params:params})
      let _dates = []
      event.map((val) => {
        let _dStart = this.dateToISOStr(`${val}-01-01`)
        let _dEnd = this.dateToISOStr(`${val}-12-31`)
        _dates.push(_dStart)
        _dates.push(_dEnd)
      })

      if (!this.multiRange && Array.isArray(event) && event.length > 1) {
        let _ev = event.slice()
        _ev.sort()
        let _sequentail = _ev.every((num, i) => {
          let _test = i === _ev.length - 1 || _ev[i + 1] === num + 1
          return _test
        })
        if (!_sequentail) this.warningSingleRangeMode()
      }

      let [actions, conditions] = params
      if (typeof conditions === 'undefined' || event.every(year => year > this.currentYear()) || this.evaluate(conditions, event)) {
        this.setDateRange(_dates)
      } else {
        this.processMode(_dates)
      }

      this.processActions(actions)
    },

    /**
     * Event Handler
     *
     * onClickFinanceYearSelected resets the range picker removing any previous selections and
     * stores the user's requested year for use as parameter in subsequent events.
     *
     * @return {void}
     */
    onClickFinanceYearSelected () {
      this.clearPrevAction()
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
    onClickFinanceQuarterSelected (dateInView, event, value, ...params) {
      // console.log(`DateRangeShortcustsFinance.onClickFinanceQuarterSelected( )`, {dateInView: dateInView, event: event, value: value , params: params})
      let _dates = []
      // let _d = this.validateDate(dateInView)
      let [action, conditions] = params

      action.map((year) => {
        event.map((val) => {
          let _qdates = this.getQuarterDates(year, val)
          _dates.push(..._qdates)
        })
      })

      if (typeof conditions === 'undefined' || (!action.length || action.every(year => year > this.currentYear())) || this.evaluate(conditions, event)) {
        this.setDateRange(_dates)
      } else {
        this.processMode(_dates)
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
    onClickFinancePeriodSelected (dateInView, event, value, ...params) {
      let _dates = []
      // let _d = this.validateDate(dateInView)
      let [actions, conditions] = params

      actions.map((year) => {
        // let _yr = this.validateDate(year)
        event.map((val) => {
          _dates.push(...this.getPeriodDates(year, val))
        })
      })

      if (typeof conditions === 'undefined' || this.evaluate(conditions, event)) {
        this.setDateRange(_dates)
      } else {
        this.processMode(_dates) //, event.length > 1 ? 'bully' : null
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
    allowsPastDates () {
      return this.allowBackInTime
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
    todayIsStartOfWeek (date = null) {
      if (date === null && this.pickerConfig.mode !== 'strict') return true

      let _dayNum = this.dayNum(date)
      return _dayNum === 0
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
    todayIsStartOfMonth (date = null) {
      if (date === null && this.pickerConfig.mode !== 'strict') return true

      let _dayNum = this.now.getDate()
      return _dayNum === 1
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
    todayIsStartOfYear (date = null) {
      // console.log(`DateRangeShortcutsFinance.todayOsStartOfYear( ${date })`, date)
      if (date === null || (Array.isArray(date) && date.length === 0)) {
        return true
      }
      if ((typeof date === 'string' || typeof date === 'number') && this.currentYear(date) > this.currentYear(this.dateToISOStr(this.now))) {
        return true
      }

      if (Array.isArray(date)) {
        if (date.length === 1) {
          return this.todayIsStartOfYear(date[0])
        } else {
          let _results = []
          if (this.pickerConfig.mode === 'strict') {
            date.map(_dt => _results.push(this.todayIsStartOfYear(_dt)))
            return _results.every(_yr => _yr === true)
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.todayIsStartOfYear(date[date.length - 1])
          }
        }
      }

      let _result = this.currentMonth() === 0 && this.currentDate() === 1

      // console.log(`DateRangeShortcutsFinance.todayisStartOfYear( ${date} ) = ${_result}`)

      return _result
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
    weekIsNotPast (week = null) {
      // console.log(`weekIsNotPast( ${week}, ${this.pickerConfig.mode})`, week)
      if (week === null && this.pickerConfig.mode !== 'strict') return true

      if (week === null || (Array.isArray(week) && week.length === 0)) {
        return true
      }

      if (!this.multiRange && Array.isArray(week) && week.length > 1) {
        let _wkcopy = week.slice(0)
        _wkcopy.sort()
        let _sequentail = _wkcopy.every((num, i) => {
          let _test = i === _wkcopy.length - 1 || _wkcopy[i + 1] === num + 1
          return _test
        })
        if (!_sequentail) this.warningSingleRangeMode()
      }

      let _week = null
      if (Array.isArray(week)) {
        if (week.length === 1) {
          _week = week[0]
        } else {
          let _results = []
          if (this.pickerConfig.mode === 'strict') {
            week.map(_wk => _results.push(this.weekIsNotPast(_wk)))
            return _results.every(val => val === true)
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.weekIsNotPast(week[week.length - 1])
          }
        }
      } else {
        _week = week
      }
      // console.log({currentWeek: this.currentWeek(), selectedWeek: _week})
      return this.currentWeek() - parseInt(_week, 10) < 0
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
    monthIsNotPast (month = null) {
      // console.log(`monthIsNotPast( ${month}, ${this.pickerConfig.mode})`, month)
      if (month === null && this.pickerConfig.mode !== 'strict') {
        return true
      }

      if (month === null || (Array.isArray(month) && month.length === 0)) {
        return true
      }

      if (!this.multiRange && Array.isArray(month) && month.length > 1) {
        let _mncopy = month.slice(0)
        _mncopy.sort()
        let _sequential = _mncopy.every((num, i) => {
          let _test = i === _mncopy.length - 1 || _mncopy[i + 1] === num + 1
          return _test
        })

        if (!_sequential) this.warningSingleRangeMode()
      }

      let _month = null
      if (Array.isArray(month)) {
        if (month.length === 1) {
          _month = month[0]
        } else {
          let _results = []
          if (this.pickerConfig.mode === 'strict') {
            month.map(_mn => _results.push(this.monthIsNotPast(_mn)))
            return _results.every(val => val === true)
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.monthIsNotPast(month[month.length - 1])
          }
        }
      } else {
        _month = month
      }

      return this.currentMonth() - parseInt(_month, 10) < 0
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
    periodIsNotPast (period = null) {
      if (period === null && this.pickerConfig.mode === 'strict') {
        return true
      }

      if (period === null || (Array.isArray(period) && period.length === 0)) {
        return true
      }

      if (!this.multiRange && Array.isArray(period) && period.length > 1) {
        let _pcopy = period.slice(0)
        _pcopy.sort()
        let _sequential = _pcopy.every((num, i) => {
          let _test = i === _pcopy.length - 1 || _pcopy[i + 1] === num + 1
          return _test
        })

        if (!_sequential) this.warningSingleRangeMode()
      }

      let _period = null
      if (Array.isArray(period)) {
        if (period.length === 1) {
          _period = period[0]
        } else {
          let _results = []
          if (this.pickerConfig.mode === 'strict') {
            period.map(_pn => _results.push(this.periodIsNotPast(_pn)))
            return _results.every(val => val === true)
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.periodIsNotPast(period[period.length - 1])
          }
        }
      } else {
        _period = period
      }

      return this.currentPeriod() - parseInt(_period, 10) < 0
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
    quarterIsNotPast (quarter = null) {
      // console.log('DateRangeShortcutsFinance.quarterIsNotPast()', quarter)
      if (quarter === null && this.pickerConfig.mode === 'strict') {
        return true
      }

      if (quarter === null || (Array.isArray(quarter) && quarter.length === 0)) {
        return true
      }

      if (!this.multiRange && Array.isArray(quarter) && quarter.length > 1) {
        let _qrcopy = quarter.slice(0)
        _qrcopy.sort()
        let _sequential = _qrcopy.every((num, i) => {
          let _test = i === _qrcopy.length - 1 || _qrcopy[i + 1] === num + 1
          return _test
        })

        if (!_sequential) this.warningSingleRangeMode()
      }

      let _quarter = null
      if (Array.isArray(quarter)) {
        if (quarter.length === 1) {
          _quarter = quarter[0]
        } else {
          let _results = []
          if (this.pickerConfig.mode === 'strict') {
            quarter.map(_qn => _results.push(this.quarterIsNotPast(_qn)))
            return _results.every(_qr => _qr === true)
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.quarterIsNotPast(quarter[quarter.length - 1])
          }
        }
      } else {
        _quarter = quarter
      }

      return this.currentQuarter() - parseInt(_quarter, 10) < 0
    },

    /**
     * Tivial Reject Test (TRT)
     *
     * todayIsInRange returns true if today's date falls within the range provided.
     *
     * @param  {String[]} dates Array of strings each formatted as YYYY-MM-DD
     * @return {Boolean}
     */
    todayIsInRange (dates = null) {
      // console.log('todayIsInRange', dates)
      let _now = this.dateToISOStr(this.now)
      if (Array.isArray(dates) && dates.length >= 2) {
        if (dates.length === 2) {
          return this.deltaDate(dates[0], _now) >= 0 && this.deltaDate(_now, dates[1]) >= 0
        } else if (this.multiRange && dates.length % 2 === 0) {
          // let _results = []
          // let _pairs = []
          // let _copy = dates.slice(0)
          // console.log('Array copy: ',_copy)
          // while (_copy.length) _pairs.push(_copy.splice(0,2))
          // console.log('Array of pairs: ',_pairs)
          // _pairs.map(_dr => _results.push(this.todayIsInRange(_dr)))
          // console.log('Results: ',_results)
          // if (!_results.every(_e => _e === true) && this.pickerConfigmode === 'fuzzy') {
          //     this.clearMRU()
          //     _pairs.pop()
          //     return this.todayIsInRange([].concat(..._pairs))
          // } else {
          //     return false
          // }

          // let _copy = dates.slice(0)
          // _copy.sort()
          // return this.todayIsInRange([_copy[0], _copy[_copy.length-1]])

          // let _results = []
          // let _pairs = []
          // let _copy = dates.slice(0)
          // console.log('Array copy: ',_copy)
          // while (_copy.length) _pairs.push(_copy.splice(0,2))
          // console.log('Array of pairs: ',_pairs)
          // _pairs.map(_dr => _results.push(this.todayIsInRange(_dr)))
          // console.log('Results: ',_results)
          // if (!_results.every(_e => _e === true) && this.pickerConfig.mode === 'fuzzy') {
          //     this.clearMRU()
          //     _pairs.pop()
          //     return this.todayIsInRange([].concat(..._pairs))
          // } else {
          //     return false
          // }
        } else {
          let _dtcopy = dates.slice(0)

          if (this.pickerConfig.mode === 'strict') {
            _dtcopy.sort()
            return this.todayIsInRange([_dtcopy[0], _dtcopy[_dtcopy.length - 1]])
          } else if (this.pickerConfig.mode === 'fuzzy') {
            return this.todayIsInRange([_dtcopy[_dtcopy.length - 2], _dtcopy[_dtcopy.length - 1]])
          }
        }
      }

      return false
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
    dayNum (date = null) {
      return this.getDayOfWeek(date)
    },

    /**
     * currentDate returns the day of the month
     *
     * @param  {Any}        date    A Date object, a string or numeric representation of a date
     *                              If `null` returns today's date
     * @return {Numeric}            An integer between 0 and 31 corresponding to the day of the month
     */
    currentDate (date = null) {
      return this.getCurrentDate(date)
    },

    /**
     * currentWeek returns the week of the year
     *
     * @param  {Any}        date    A Date object, a string or numeric representation of a date
     *                              if `null` returns current week
     * @return {Numeric}            An integer between 1 and 52 corresponding to the week number
     */
    currentWeek (date = null) {
      return this.getCurrentWeek(date)
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
    weekNumbers (date) {
      let result = []
      let data = this.getWeekNumbers(date)
      // console.log(`Week data for ${date}: `, data)
      for (let x = 1; x < data.length; x++) {
        result.push({text: `${this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.week'))} #${x} [${data[x].start.utc().format('MMM Do')} - ${data[x].end.utc().format('MMM Do')}]`, value: x})
      }
      return result
    },

    /**
     * currentWeekRange returns a date range for a week
     *
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` uses today's date to identify week
     * @return {String[]}           Array of strings each formated as YYYY-MM-DD
     */
    currentWeekRange (date = null) {
      let _d = new Date(date)
      let _start = this.dateToISOStr(this.dateStartOfWeek(_d))
      let _end = this.dateToISOStr(this.dateEndOfWeek(_d))
      return [_start, _end]
    },

    /**
     * currentMonth returns an integer corresponding to a month
     *
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` usses today's date to identify month
     * @return {Numeric}            Integer corresponding to the month
     */
    currentMonth (date = null) {
      return this.getCurrentMonth(date)
    },

    /**
     * currentPeriod returns an integer corresponding to a period
     *
     * @param  {String | null} date A string describing a date foramtted as YYYY-MM-DD
     *                              If `null` uses today's date to identify period
     * @return {Numeric}            Integer corresponding to the period
     */
    currentPeriod (date = null) {
      return this.getCurrentPeriod(date) || 0
    },

    /**
     * currentQuarter returns an integer correponding to a quarter
     *
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` uses today's date to identify quarter
     * @return {Numeric}            Integer corresponding to the quarter
     */
    currentQuarter (date = null) {
      return this.getCurrentQuarter(date) || 0
    },

    /**
     * currentYear returns an integer corresponding to a year
     *
     * @param  {String | null} date A string describing a date formatted as YYYY-MM-DD
     *                              If `null` uses today's date to identify year
     * @return {Numeric}            Integer corresponding to the year
     */
    currentYear (date = null) {
      return this.getCurrentYear(date)
    },

    /**
     * monthNames returns a list of localized month names
     *
     * @return {Array of Objects}   Array should contain 12 objects each with a `text` and `value` element.
     *                              The `text` element corresponds to a months long name
     *                              The `value` element is the month number for futher processing
     */
    monthNames () {
      return this.getMonthLongNames(this.$vuetify.lang.current).map((val, index) => { return {text: val, value: index} })
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
    yearNumbers () {
      let result = []
      let _date = new Date()
      const maxYear = this.max
        ? parseInt(this.max, 10)
        : _date.getFullYear() + 10

      // let _min = this.min || !this.allowBackInTime ? _date.getFullYear() : undefined

      const minYear = this.min
        ? parseInt(this.min, 10)
        : this.allowBackInTime === false
          ? _date.getFullYear()
          : _date.getFullYear() - 10

      for (let year = maxYear; year >= minYear; year--) {
        result.push(year)
      }

      result.sort()

      return result.map((val) => { return {text: val, value: val} })
    },

    /**
     * periodList returns an array of localized labels for the 13 4-week periods of the year
     *
     * @return {Array of Objects}       Array should contain 13 objects each with a `text` and `value` element.
     *                                  The `text` element corresponds to a localized label describing the period
     *                                  The `value` element is the period number for futher processing
     */
    periodList () {
      return [
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p1')), value: 1},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p2')), value: 2},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p3')), value: 3},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p4')), value: 4},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p5')), value: 5},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p6')), value: 6},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p7')), value: 7},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p8')), value: 8},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p9')), value: 9},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p10')), value: 10},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p11')), value: 11},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p12')), value: 12},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.p13')), value: 13}
      ]
    },

    /**
     * quarterList returns an array of localized labels for the 4 quaters of the year as well as accelerators
     * for the current and last quater
     *
     * @return {Array of Objects}       Array should contain 4 objects each with a `text` and `value` element.
     *                                  The `text` element corresponds to a localized table describing the quarter
     *                                  The `value` element is the quarter number for futher processing
     */
    quarterList () {
      return [
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q1')), value: 1},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q2')), value: 2},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q3')), value: 3},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.finance.q4')), value: 4},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.current')), value: 0},
        {text: this.ucFirst(this.$vuetify.t('$vuetify.dateRangeShortcuts.last')), value: -1}
      ]
    }

  },
  created () {
    this.now = new Date()
  }
}
