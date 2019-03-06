<template>

    <v-layout row wrap v-resize="onResize">
        <v-flex>
            <v-card
                :dark="dark"
                :width="maxCardWidth"
                :ref="'pickerContainer'">
                <slot name="drawerOptions"></slot>
                <v-layout row wrap>
                <template v-for="index in dateConfig.visiblePickers">  
                    <v-date-picker v-model="dateRange" v-if="isPickerVisible(index)"
                        :allow-date-change="index === 1"
                        :allowed-dates="allowedDates"
                        :color="color"
                        :dark="dark"
                        :day-format="dayFormat"
                        :event-color="eventColor"
                        :events="events"
                        :first-day-of-week="firstDayOfWeek"
                        :header-color="getPickerColor(index)"
                        :header-date-format="headerDateFormat"
                        :hide-disabled="hideDisabled"
                        :hover-link="hovering"
                        :key="index"
                        :light="light"
                        :locale="locale"
                        :min="dateConfig[`pickerMin${index}`]"
                        :max="dateConfig[`pickerMax${index}`]"
                        multiple
                        :next-icon="nextIcon"
                        :no-title="noTitle" 
                        :picker-date="dateConfig[`pickerView${index}`]"
                        :prev-icon="prevIcon"
                        :range="range"
                        :reactive="reactive"
                        :ref="`pickerView${index}`"
                        :scrollable="scrollable"
                        :show-current="showCurrent"
                        :show-week="showWeek"
                        :title-date-format="date => getPickerTitle(index)"
                        :type="type"
                        :year-format="yearFormat"
                        :year-icon="yearIcon"
                        v-on:change="date => onInputChange(date, index)"
                        v-on:hoverLink="setHoverLink"
                        v-on:input="dates => onInputChange(dates, index)" 
                        v-on:click:date="date => onDateClicked(date, index)" 
                        v-on:pickerType="pickerType => onHeaderClicked(pickerType, index)"
                        v-on:update:pickerDate="date => onPickerUpdate(date, index)" 
                    >
                    </v-date-picker>
                </template>  
                </v-layout>
                <v-card-actions>
                    <div v-if="$slots.drawerOptions" class="text-xs-center mx-2">
                        <v-btn flat fab small @click="toggleOptionsDrawer">
                            <v-icon >more_vert</v-icon>
                        </v-btn>
                    </div>
                    <v-divider vertical v-if="$slots.drawerOptions"></v-divider>
                    <slot name="panelOptions" v-if="(numPickersVisible > 1 || !this.autoHide) && this.maxWidth === null"></slot>                      
                    <v-spacer></v-spacer>
                    <v-divider vertical class="hidden-lg-and-down"></v-divider>
                    <v-btn @click="onClickClear" class="ml-2" color="red">Clear</v-btn>
                    <v-btn @click="onClickSubmit" class="mx-2" color="green">Apply</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>
    import VDatePicker from 'vuetify/es5/components/VDatePicker/VDatePicker'   
    
    export default {
        name: 'v-date-range-picker',
        extends: VDatePicker,
        data: () => ({
            dateRange: [],
            dateConfig: {
                pickerView1: null,
                visiblePickers: 0,
                lastClick: null
            },
            numPickersVisible: 0,
            maxCardWidth: undefined,
            pickerOptionsShow: false,
            lmode: '',
            lpickerDate: null,
            parentConfig: {
                mode: 'fuzzy',
                pickerDate: '1899-01',
                locale: 'en-US'
            }
        }),
        props: {
            allowBackInTime: {
                type: Boolean,
                default: false
            },
            autoHide: {
                type: Boolean,
                default: false
            },
            autoFocus: {
                type: Boolean,
                default: false
            },
            autoSize: {
                type: Boolean,
                default: false
            },
            color: {
                type: Array,
                default: null
            },
            headerColor: {
                type: Array,
                default: () => []
            },
            isDrawerOpen: {
                type: Boolean,
                defalut: false
            },
            liveUpdate: {
                type: Boolean,
                default: false
            },
            noTitle: {
                type: Boolean,
                default: false
            },
            maxWidth: {
                type: Number,
                default: null
            },
            mode: {
                type: String,
                default: 'fuzzy',
                validator: value => ['strict','lazy','fuzzy'].includes(value)
            },
            numPickers: {
                type: Number,
                default: 2
            },
            multiple: {
                type: Boolean,
                default: true
            },
            multiRange: {   //TODO
                type: Boolean,
                default: false
            },
            range: {
                type: Boolean,
                default: true
            },
            rangeColors: {  //TODO
                type: Array,
                default: null
            },
            resetViewOnClear: {
                type: Boolean,
                default: true
            },
            solo: {
                type: Boolean,
                default: false
            },
            startDate: {
                type: String | Date,
                default: null
            }
        },
        computed: {
            pickerView() {
                return this.dateConfig.pickerView1
            },
            userLocale() {
                if (this.locale !== '') {
                    return this.locale
                } else {
                    return 'en-US'
                }
            },
            pickerMode() {
                if (this.mode !== '') {
                    return this.mode
                } else {
                    return 'fuzzy'
                }
            },
            computedPickerDate() {
                if (this.pickerDate !== '') {
                    return this.pickerDate
                } else {
                    return null
                }
            }
        },
        provide () {
            return {
                pickerConfig: this.parentConfig
            }
        },
        watch: {
            pickerMode: {
                handler(val,prev) {
                    if (val !== prev) {
                        this.parentConfig.mode = this.pickerMode
                    }
                },
                immediate: true
            },
            computedPickerDate: {
                handler(val,prev) {
                    if (val !== prev) {
                        this.parentConfig.pickerDate = this.computedPickerDate
                    }
                },
                immediate: true
            },
            userLocale: {
                handler(val,prev) {
                    if (val !== prev) {
                        this.parentConfig.locale = this.userLocale
                    }
                },
                immediate: true
            },
            pickerView: {
                handler(val,prev) {
                    if (this.tableDate !== val) {
                        this.tableDate = val
                    }
                }
            },
            tableDate: {
                handler(val) {
                    this.$emit('update:pickerDate', val)
                }
            },
            dateRange: {
                handler(val, prev) {
                    if (!this.multiRange && this.dateRange.length > 2) {
                        this.dateRange.splice(1,1)
                    }
                } 
            },
            isDrawerOpen: {
                handler(val) {
                    this.pickerOptionsShow = val
                }
            },
            value: {
                handler(val, prev) {
                    if (Array.isArray(val)) {
                        if (!val.length) {
                            this.dateRange = val
                            if (this.resetViewOnClear) {
                                this.autoFocusPicker( this.getStartDate() || this.now)
                            }
                        } else {
                            this.dateRange = val
                            if (this.autoFocus) {
                                this.autoFocusPicker()
                            }
                        }
                    }
                }
            },
            pickerOptionsShow: {
                handler(val) {
                    this.$emit('update:pickerVisible', val)
                }
            },
            autoSize: {
                handler(val, prev) {
                    if (val !== prev) {
                        this.onResize()
                    }
                }
            }
        },
        methods: {
            /**
             * In support of autoFocus property. When enabled, the master picker
             * will be autoset to the earliest date in the selection.
             * 
             * @returns {void}
             */
            autoFocusPicker (date = null) {
                if (date !== null) {
                    let _date = this.validateDate(date)
                    this.onPickerUpdate(_date.toISOString(), 1)
                } else {
                    this.onPickerUpdate(this.dateRange[0], 1)
                }
            },

            /**
             * In support of autoFocus property. 
             *
             * getStartDate returns the earliest valid date or null.
             *
             * For a date to be deemed valid the following conditions must be met:
             * (a) If the flag `allowBackInTime` is not set, the next rule applies
             * (b) If a start date was set, the date must be greater 
             * 
             * @return {String | null}  Returns the pre-defined start date as a string or null
             */
            getStartDate () {
               if (this.startDate !== null) {
                   if (this.deltaDate(this.now, this.startDate) < 0 && !this.allowBackInTime) {
                       return null
                   }
               } 

               return this.startDate
            },
            
            /**
             * In support of quick selection helpers;
             * 
             * clearSelection clears previous user selections
             *  
             * @return {void}
             */
            clearSelection () {
                this.dateRange = []
            },

            /**
             * resetPickerModes iterates through all visible
             * picker settings and resets the type property
             * to 'date'
             * 
             * @return {void}
             */
            resetPickerModes () {
                for (let _x=1; _x<=this.numPickers; _x++) {
                    let pickerName = `pickerView${_x}`
                    let pickerType = `pickerType${_x}`
                    if (this.dateConfig[pickerType] !== 'date') {
                        let picker = Array.isArray(this.$refs[pickerName]) 
                                ? this.$refs[pickerName][0]
                                : this.$refs[pickerName]

                        picker.activePicker = 'DATE'
                    }
                }
            },

            /**
             * In support of quick selection helpers;
             * 
             * hideOptionsDrawer sets drawer model so that
             * the drawer is removed from view
             * 
             * @return {void}
             */
            hideOptionsDrawer () {
                this.pickerOptionsShow = false
            },

            /**
             * In support of quick selection helpers;
             * 
             * Hide or show the picker options drawer
             * 
             * @return {void}
             */
            toggleOptionsDrawer () {
                this.pickerOptionsShow = !this.pickerOptionsShow
            },

            /**
             * Handler for clear button
             * 
             * onClickClear resets the user interface; clears
             * and previous selection; generates input event 
             * 
             * @return {void}
             */
            onClickClear () {
                this.clearSelection()
                this.resetPickerModes()
                this.emitUpdate()
                this.updateNumPickerVisible()
            },

            /**
             * Handler for submit button
             * 
             * onClickSubmit generates input event; closes the
             * menu
             * 
             * @return {void}
             */
            onClickSubmit () {
                this.emitResults()
                this.isOpen = false
            },

            /**
             * Resize event handler
             * 
             * If auto size is enabled, onResize alters the number of date pickers displayed on screen
             * in an effort to avoid overflow.
             * 
             * @return {void}
             */
            onResize () {  
                if (this.autoSize) {
                    let _screenWidth = window.innerWidth
                    let _screenHeight = window.innerHeight
                    
                    let _picker = Array.isArray(this.$refs['pickerView1'])
                            ? this.$refs['pickerView1'][0]
                            : this.$refs['pickerView1']
                    
                    let _pickerWidth = _picker && _picker.width ? _picker.width : 290
                    let _pickerHeight = _picker && _picker.height ? _picker.height : 374

                    if (_screenWidth <= 700) {
                        this.dateConfig.visiblePickers = 1
                    } else if (_screenWidth > 700 && _screenWidth <= 1024) {
                        this.dateConfig.visiblePickers = Math.min(2, this.numPickers)
                    } else if (_screenWidth > 1024 && _screenWidth <= 1368) {
                        this.dateConfig.visiblePickers = Math.min(3, this.numPickers)
                    } else {
                        this.dateConfig.visiblePickers = this.numPickers
                    }

                    this.maxCardWidth = this.maxWidth ? Math.min(this.maxWidth, this.dateConfig.visiblePickers * _pickerWidth) : this.dateConfig.visiblePickers * _pickerWidth

                    let vMultiplier = Math.floor(_screenHeight / (_pickerHeight * 1.1))

                    if (vMultiplier > 1) {
                        this.dateConfig.visiblePickers = Math.min(this.numPickers, this.dateConfig.visiblePickers * vMultiplier)
                    }                    
                }
            },

            /** ==============================  Helpers  ============================== */

            /**
             * In support of locking the range selector to a minimum date
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
             *              the current date. if the date falls within it will be allowed or else
             *              rejected. 
             * 
             * @param  {String[] || string} dates String or array of strings each formated as YYYY-MM-DD
             * @return {void}       
             */
            processMode (dates) {
                if (Object.keys(this.$slots).length !==0) {
                    if (this.mode === 'strict') {
                        this.emitError('Date range is not allowed.')
                    } else if (this.mode === 'lazy') {
                        if (this.todayIsInRange(dates)) {
                            this.updateDateRange(dates)
                            this.emitWarning('Last selection could not be process. Date is in the past.')
                        } else {
                            this.emitError('Date range is not allowed.')
                        }
                    } else if (this.mode === 'fuzzy') {
                        this.updateDateRange(dates)
                        this.emitInfo('Date range includes past dates.')
                    }
                } else {
                    this.updateDateRange(dates)
                }
            },

            /**
             * Private helper function
             * 
             * todayIsInRange inspects the date range supplied to determin if today's date falls within
             * 
             * @param  {String[]} dates Array of strings representing a date, each formatted as YYYY-MM-DD
             * @return {Boolean}        Returns true if the current day falls within the range supplied
             */
            todayIsInRange ( dates = null ) {
                let _now = this.dateToISOStr(this.now)
                if (Array.isArray(dates) && dates.length >= 2) {
                    
                    if (this.multiRange) {
                        //TODO: support multi-range
                    } else {
                        return this.deltaDate(dates[0],_now) > 0 && this.deltaDate(_now, dates[dates.length-1]) > 0
                    }
                }
                return false
            },

            /**
             * Private Helper function
             * 
             * updateDateRange updates selection; generates
             * input event
             *  
             * @param  {Array}  dates   String[] containing user selection
             * @return {void}
             */
            updateDateRange (dates) {
                if (!Array.isArray(dates)) return
                //this.clearSelection()  
                if (this.multiRange) {
                    this.dateRange.push(dates)
                } else {
                    let _dates = [dates[0], dates[dates.length - 1]]
                    this.dateRange = _dates
                }
                this.emitUpdate()
                this.updateNumPickerVisible()
                if (this.autoFocus) {
                    this.autoFocusPicker()
                }
            },
                      
            /**
             * Private Helper function
             * 
             * validateDate inspects the supplied date and attempts to 
             * return a valid javascript Date object or null
             * 
             * @param  {Number | String | Date}     date    Date value to inspect
             * @return {Date | null}                        Javascript Date object or `null`
             * 
             */
            validateDate (date) {
                let _d = null
                if (date && typeof date === 'number') {
                    _d = this.dateFromStr(date.toString())
                }
                if (date && typeof date === 'string') {
                    _d = this.dateFromStr(date)
                } else if (date && typeof date.toISOString === 'function') {
                    _d = date
                } else {
                    _d = new Date()
                }
                return _d && typeof _d.toISOString === 'function' ? _d : null
            },

            /**
             * Private Helper function
             * 
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
            dateFromStr (strDate, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
                //console.log(`dateFromStr( ${strDate}, ${deltaDay}, ${deltaMonth}, ${deltaYear} )`)
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
            },

            /**
             * Private Helper function
             * 
             * dateToStr converts a Javascript Date object to a string taking into account
             * the user's locale
             * 
             * @param  {Object}         date    Javascript Date object
             * @param  {Array | String} format  [optional] A string with a BCP 47 language tag, or
             *                                  array of such strings. See documenation 
             * @return {String}                 Date formatted as a string as per format requested                 
             */
            dateToStr (date, format = null) {
                if (format) {
                    if (date !== undefined && typeof date.toLocaleDateString === 'function') {
                        return date.toLocaleDateString(this.locale, format)
                    } else if (date !== undefined && typeof date === 'string') {
                        return new Date(date).toLocaleDateString(this.locale, format)
                    }
                } else {
                    if (date && typeof date.toISOString === 'function') {
                        return this.formatters.titleDate(date.toISOString().substr(0,10))
                    } else if (date && typeof date === 'string') {
                        return this.formatters.titleDate(date)
                    } 
                }
                return null
            },

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
            dateToISOStr (date, len = 10) {
                if (date && typeof date.toISOString === 'function') {
                    return date.toISOString().substr(0,len)
                } else if (date && typeof date === 'string') {
                    let _d = this.dateFromStr(date)
                    if (_d && typeof _d.toISOString === 'function') {
                        return this.dateToISOStr(_d, len)
                    } else {
                        return null
                    }
                }

                return null
            },

            /**
             * Private Helper function
             * 
             * dateToMonthYear is a wrapper function around the Vuetify default date formatters
             * 
             * @param  {Object | String}    date    Date object supporting a toISOString method such as 
             *                                      the internal Javascript or moment.js Date objects;
             *                                      A date formated as YYYY-MM-DD
             * @return {String | null}              Returns the date object formatted as a string or `null`
             */
            dateToMonthYear (date) {
                if (date && typeof date.toISOString === 'function') {
                    return this.formatters.titleMonthYear(date.toISOString().substr(0,10))      
                } else if (date && typeof date === 'string') {
                    return this.formatters.titleMonthYear(date)
                }
                return null          
            },

            /**
             * Private Helper function
             * 
             * dateRangeToStr converts a set of dates to a hyphenated short-form localized date string
             *  
             * @param  {String} rangeStart  'YYYY-MM-DD' string representing the start date
             * @param  {String} rangeEnd    'YYYY-MM-DD' string representing the end date
             * @return {String}             Hyphenated combination of start and end dates formatted
             *                              using month and day short forms rather than numeric value.
             *                              Automatically adds the year if the start and end dates 
             *                              span years 
             */
            dateRangeToStr (rangeStart, rangeEnd) {
                let _rangeStart = this.validateDate(rangeStart)
                let _rangeEnd = this.validateDate(rangeEnd)
                let _currentYear = this.validateDate(this.dateConfig.pickerView1)
                let _format = null
                if ( (_rangeStart.getFullYear() !== _rangeEnd.getFullYear()) || 
                      _rangeStart.getFullYear() !== _currentYear.getFullYear() || 
                      _rangeEnd.getFullYear() !== _currentYear.getFullYear()) {
                    _format = {month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'}
                } else {
                    _format = {month: 'short', day: 'numeric', timeZone: 'UTC'}
                }
                const _cin = this.$vuetify.lang.current === 'en' ? this.dateToStr(rangeStart, _format) : rangeStart.getDate()
                const _cout = this.dateToStr(rangeEnd, _format)

                return `${_cout 
                            ? _cin 
                                ? _cin + ' - ' + _cout
                                : ' - ' + _cout
                            : _cin 
                                ? _cin + ' - '
                                : ''       
                        }`

            },

            /**
             * Private Helper function
             * 
             * monthYearToStr converts a set of dates to a hyphenated string utilizing
             * Vuetify default date formatter
             * 
             * @param  {String | Object}    rangeStart  YYYY-MM-DD string or Date object
             * @param  {String | Object}    rangeEnd    YYYY-MM-DD string or Date object
             * @return {String}                         Hyphenated combination of start and
             *                                          end dates
             */
            monthYearToStr (rangeStart,rangeEnd) {
                const _cin = this.getMonth(rangeStart) === this.getMonth(rangeEnd) ? this.getDay(rangeStart) : this.dateToMonthYear(rangeStart)
                const _cout = this.dateToMonthYear(rangeEnd)

                return `${_cout
                            ? _cin
                                ? _cin + ' - ' + _cout
                                : ' - ' + _cout
                            : _cin
                                ? _cin + ' - '
                                : ''

                        }`
            },

            /**
             * Private Helper function
             * 
             * getDay returns the day number from the provided date
             * 
             * @param  {Object | String} date Javascript Date object or string fromatted as YYYY-MM-DD
             * @return {Numeric}              Returns the day component from the date
             */
            getDay (date) {
                let _d = null
                if (typeof date === 'string') {
                    _d = this.dateFromStr(date)
                } else {
                    _d = date
                }

                if (_d && typeof _d.getDate === 'function') {
                    return _d.getDate()
                }
            },

            /**
             * Private Helper function
             * 
             * getMonth returns the month numeric value from a date that could be a
             * string, a number or a Date object
             * 
             * @param  {Any}    date    The date to inspect
             * @return {Number | null}  Returns the numeric month or null
             */
            getMonth (date) {
                let _d = null
                if (typeof date === 'string') {
                    _d = this.dateFromStr(date)
                } else {
                    _d = date
                }

                if (_d && typeof _d.getMonth === 'function') {
                    return _d.getMonth()
                }

                return null
            },

            /**
             * Private Helper function
             * 
             * getYears returns an array of numeric years from the provided
             * dates.
             * 
             * @param {String | Array}  dates   Array of, or string date. Each
             *                                  Array element can be a string or
             *                                  Date object
             * 
             * @returns {Array}                 Array of numeric months 
             */
            getYears (dates) {
                let _d = null
                if (typeof dates === 'string') {
                    _d = this.validateDate(dates)
                    if (typeof _d.getFullYear === 'function') {
                        return [_d.getFullYear()]
                    }
                }

                if (Array.isArray(dates)) {
                    let _years = []
                    dates.forEach( (date) => {
                        _d = this.validateDate(date)
                        if (typeof _d.getFullYear === 'function') {
                            _years.push(_d.getFullYear())
                        }
                    })

                    return _years
                }

                return []
            },

            /**
             * Private Helper function
             * 
             * monthCount counts the number of dates in our selection that correspond 
             * to the given date
             * 
             * @param  {String | Object} date  Date object or string representation of a date
             *                                 String formats supported are 'YYYY', 'YYYY-MM',
             *                                 'YYYY-MM-DD'. Time notation can be appended to the
             *                                 string without any effect. 
             * @return {Number | null}         Returns the number of times the given date's month
             *                                 was found in the user's current selection or `null`
             *                                 if the provided date was invalid               
             */
            monthCount (date) {
                let _month = -1

                if (date && typeof date === 'string') {
                    _month = this.getMonth(date)
                } else if (date && typeof date === 'number') {
                    _month = date
                } else {
                    return -1
                }

                let _mcount = 0
                for(let i=0; i<this.dateRange.length; i++) {
                    if(this.getMonth(this.dateFromStr(this.dateRange[i])) === _month) _mcount++
                }
                return _mcount === -1 ? null : _mcount
            },

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
            deltaDate (date1, date2, callback = null) {
                if (Array.isArray(date1)) {
                    date1 = date1[0]
                }
                if (Array.isArray(date2)) {
                    date2 = date2[0]
                }

                let _first = this.validateDate(date1).setHours(0,0,0,0)
                let _second = this.validateDate(date2).setHours(0,0,0,0)
                
                if (callback && typeof callback === 'function') {
                    return callback(_first, _second)
                }
                
                let _delta = (_second - _first)
                return _delta
            },

            /**
             * Private Helper function
             * 
             * getSelectionByMonth parses the current user selection and returns the index of 
             * the first date that match the provided date
             * 
             * @param  {String} date Date to search for
             * @return {Numeric}     Index of date found, or -1
             */
            getSelectionByMonth (date) {
                return this.dateRange.findIndex(element => element.includes(date))
            },

            /**
             * Getter function
             * 
             * getPickerTitle generates the title for a picker identified by the index parameter. 
             * The function inspects the current user selection compared to the date currently shown by
             * the picker to compose an appropriate title for the picker.
             *  
             * @param  {Numeric} index Index of the picker 
             * @return {String}        The picker's title
             */
            getPickerTitle (index) {
                //console.log('getPickerTitle()')
                if (this.monthCount(this.dateConfig[`pickerView${index}`]) === 1) {
                    let _item = this.getSelectionByMonth(this.dateConfig[`pickerView${index}`])
                    return _item !== -1 
                               ? this.defaultTitleDateFormatter(this.dateRange[_item]) //bypass multipleDateFormatter
                               : ' - '
                } else if (this.monthCount(this.dateConfig[`pickerView${index}`]) === 2) {
                    return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                } else {
                    return ''
                }                 
            },

            /**
             * Getter function
             * 
             * getPickerColor gets a color for a picker by alternating color selection from 
             * a list of colors based on provided index and lenght of color array 
             * (example: alternating row color in a table)
             * 
             * @param  {Numeric} index          The index of the object receiving the color
             * @param  {Array}   colorArray     [Optional] The array of colors to choose from. 
             *                                  By default uses the headerColor property.
             *                                  ** The array should contain a list of color values
             *                                  as strings or numerics but the data return is not
             *                                  validated.
             * @return {String|Numeric}         The array element
             */
            getPickerColor (index, colorArray = this.headerColor) {
                if (Array.isArray(colorArray) && colorArray.length !== 0) {
                    return colorArray[index % colorArray.length]
                }

                return undefined
            },

            /**
             * In support of the autoHide feature; when enabled and the user's selection
             * is within a singal month, the date-range picker component will hide the
             * unused adjacent pickers 
             * 
             * updateNumPickerVisible updates the `numPickerVisible` data property
             * to reflect the number of date pickers visible on screen.
             *  
             * @return {Numeric | Null}     Returns the number of pickers displayed 
             *                              or null if auto-hide is disabled
             */
            updateNumPickerVisible () {
                if (this.autoHide) {

                    let _count = -1

                    if (_count === -1 && this.dateRange.length !== 2) {
                        _count = this.numPickers
                    }
                    if (_count === -1 && this.getMonth(this.dateRange[0]) !== this.getMonth(this.dateRange[1])) {
                        _count = this.numPickers
                    }

                    if (_count === -1)
                    {                
                        for (let _p=1; _p<=this.numPickers; _p++) {
                            if (
                                this.getMonth(this.dateRange[0]) === this.getMonth(this.dateConfig[`pickerView${_p}`]) 
                            ) {
                                if (_count === -1) {
                                    _count = 1
                                } else {
                                    _count++
                                }
                            }
                        }
                    }
                    
                    if (!_count === this.numPickers) {
                        this.numPickersVisible = _count
                    }

                    return _count
                }

                return null
            },

            /**
             * Private Helper function; in support of the auto-hide functionality
             * 
             * isPickerVisible returns a boolean value indicating if the picker specified
             * by an index is currently visible
             * 
             * @param  {Numeric}  index The ID of the picker
             * @return {Boolean}        Picker visiblity
             */
            isPickerVisible (index) {
                return this.autoHide && this.dateRange.length === 2
                        ? this.getMonth(this.dateRange[0]) !== this.getMonth(this.dateRange[1])
                            ? true
                            : this.updateNumPickerVisible() !== -1 
                                ? this.getMonth(this.dateRange[0]) === this.getMonth(this.dateConfig[`pickerView${index}`])
                                : true
                        : true
            },

            /**
             * Setter function; event handler
             * 
             * setHoverLink is executed when the `hoverLink` event is received.
             * Its purpose is to propage the hover location to all pickers.
             * 
             * @param  {String} value The date currently hovered
             * @return {void} 
             */
            setHoverLink (value) {
                this.hovering = value
            },

            /**
             * Event handler/propagator
             * 
             * onInputChange is invoked when the 'change' event is received from 
             * any of the child date pickers. The event bubble's up to the panent.
             * 
             * @param  {String[]} dates Array of ISO string dates YYYY-MM-DD
             * @param  {Integer}  index ID of picker sending the event
             * @return {void}
             */
            onInputChange (dates, index) {
                this.$emit('change', dates)
            },

            /**
             * Event handler/propagator
             * 
             * onDateClicked is invoked when the 'click' event is received from any
             * of the child date pickers. The event bubble's up to the parent.
             * 
             * Usability is controlled via this click handler. The goal is to offer
             * means of extending a selected range in a logical fashion following these
             * rules:
             * 
             * @param  {String}  date  The date as a 'YYYY-MM-DD' formatted string
             * @param  {Numeric} index The ID of the date picker
             * @return {void}     
             */
            onDateClicked (date, index) {
                this.updateNumPickerVisible()
                this.$emit('click', date)

                if (this.dateRange.length > 2) {
                    let _lastWasStart = this.dateConfig.lastClick === this.dateRange[0]
                    let _lastWasEnd = this.dateConfig.lastClick === this.dateRange[1]
                    let _clickBeforeStart = this.deltaDate(this.dateRange[0], this.dateRange[2]) < 0
                    let _clickAfterEnd = this.deltaDate(this.dateRange[1], this.dateRange[2]) > 0

                    // console.log(this.dateRange)
                    // console.log(`Last click was Start (${this.dateConfig.lastClick}, ${this.dateRange[0]}): `, _lastWasStart)
                    // console.log(`Last click was End: (${this.dateConfig.lastClick},${this.dateRange[0]}) `, _lastWasEnd)
                    // console.log('Before start: ', _clickBeforeStart)
                    // console.log('After end: ', _clickAfterEnd)

                    
                    if (_clickBeforeStart) {
                        this.dateRange.splice(0,1)
                    } 
                    else if (_clickAfterEnd) {
                        this.dateRange.splice(1,1)
                    }
                    //rule 1 - if the last click was the range start, adjust the range-start
                    else if (_lastWasStart) {
                        this.dateRange.splice(0,1)
                    }
                    //rule 2 - if the last selection is less than the range start, adjust the range-start 
                    // else if (this.deltaDate(this.dateRange[0], this.dateRange[2]) < 0) {
                    //     this.dateRange.splice(0,1)
                    // } 
                    //rule 3 - if rule 1 and rule 2 are not applicable, adjust the range-end
                    else {
                        this.dateRange.splice(1,1)
                    }
                }
                if (this.liveUpdate) {
                    this.emitUpdate()
                }
                this.dateRange.sort()
                this.dateConfig.lastClick = date
            },

            /**
             * Event handler
             * 
             * onHeaderClicked is invoked when a picker's type is changed. 
             * 
             * @param   {String}    pickerType  The current type; 'DATE', 'MONTH' or 'YEAR'
             * @param   {Numeric}   index       The ID of the date picker
             */
            onHeaderClicked (pickerType, index) {
                this.dateConfig[`pickerType${index}`] = pickerType.toLowerCase()
            },

            /**
             * Event handler/propagator
             * 
             * onPickerUpdate is invoked when any of the child date pickers update their 
             * state. A state change can comprise a change in month or year.  This event
             * bubble's up to the parent.
             * 
             * Internally, this event is used to update non-primary child date pickers so
             * that they always follow the primary date picker.
             * 
             * @param  {String}  date  The date as a 'YYYY-MM' formatted string
             * @param  {Numeric} index The ID of the child picker
             * @return {void}
             */
            onPickerUpdate (date, index) {
                //console.log(`DateRangePicker.onPickerUpdate ( ${date}, ${index} )`)
                if (index === 1) {
                    let _toDate = this.dateFromStr(date)
                    //console.log('toDate = ', _toDate)    
                    let _fromDate = this.dateFromStr(this.dateConfig[`pickerView${index}`])
                    let _toArray = date.split('-')
                    let _fromArray = this.dateConfig[`pickerView${index}`].split('-')
                    let _diffYear = parseInt(_toArray[0],10) - parseInt(_fromArray[0],10)
                    let _diffMonth = parseInt(_toArray[1],10) - parseInt(_fromArray[1],10)
                  
                    this.dateConfig[`pickerView${index}`] = this.dateToISOStr(_toDate,7)
                
                    let _nd = null
                    for (let x=index+1; x<=this.numPickers; x++) {
                        _nd = this.dateFromStr(this.dateConfig[`pickerView${x}`],0,_diffMonth, _diffYear).toISOString()
                        this.dateConfig[`pickerView${x}`] = _nd.substr(0,7)
                    }
                }
            },

            /** ============================== Events ============================== */
                        
            /**
             * Generate input event providing final date range 
             * selection to parent handler
             * 
             * @return void
             */
            emitResults () {
                this.$emit('input', this.dateRange)
            },

            /**
             * Generate update event providing final date range
             * selection to parent
             * 
             * @return {void}
             */
            emitUpdate () {
                this.$emit('update', this.dateRange)
            },

            /**
             * Generate a warning event 
             * 
             * @param  {String} msg Warning message to bubble up to parent
             * @return {void}
             */
            emitWarning (msg) {
                this.$emit('warning', msg)
            },

            /**
             * Generate an info event
             * 
             * @param  {String} msg Information message to bubble up to parent
             * @return {void}
             */
            emitInfo (msg) {
                this.$emit('info', msg)
            },

            /**
             * Generate an error event
             * 
             * @param  {String} msg Error message to bubble up to parent
             * @return {void}
             */
            emitError (msg) {
                this.$emit('error', msg)
            }

        },
        mounted() {
            //override picker quantity on small displays
            this.dateConfig.visiblePickers = this.numPickers

            this.maxCardWidth = this.maxWidth
    
            for (let i=1; i<=this.dateConfig.visiblePickers; i++) {
                let _d = null
                //user supplied a start date
                if (this.startDate && this.allowBackInTime) {
                    if (typeof this.startDate === 'string') {
                        _d = this.dateFromStr(this.startDate)
                    } else {
                        if (typeof this.startDate.setMonth === 'function') {
                            _d = this.startDate
                        }
                    }
                //start from today
                } else {
                    _d = new Date()
                }

                //bind the picker mode for clearing
                this.$set(this.dateConfig, `pickerType${i}`, 'date')

                //setup a min if we are not allowed to go back in time
                if (!this.allowBackInTime) {
                    this.$set(this.dateConfig, `pickerMin${i}`, this.dateToISOStr( _d, 10))
                }

                //setup the picker view date for this index
                _d.setMonth(_d.getMonth()+i-1)                   
                this.$set(this.dateConfig, `pickerView${i}`, this.dateToISOStr( _d, 7 ) )
                
            }

            this.onResize()
        }
    };
</script>