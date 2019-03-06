import Events from './DateRangeEvents.js'

export default {
    mixins: [Events],
    data:() => ({
        currentAction: null,
        pauseWatcher: false,
        mru: []
    }),
    props: {
        dateRange: {
            type: Array,
            default: () => []
        },
        updateDateRange: {
            type: Function,
            default: () => ({})
        },
        multiRange: {
            type: Boolean,
            default: false
        }
    },
    inject: ['pickerConfig'],
    watch: {
        dateRange: {
            handler(val, prev) {
                //console.log(`DateRangePlugin -> dateRange wathcer: [val]${val}, [prev]${prev}, [paused]${this.pauseWatcher}`)
                if (!this.pauseWatcher && Array.isArray(val) && Array.isArray(prev)) {
                    if (val.length === 0 && prev.length !== 0) {
                        //console.log(`val.length=${val.length}, prev.length=${prev.length}`)
                        //this.clearCurrentAction()
                        this.clearSelection()
                        this.btnGroup = null
                    } 
                } else {
                    this.$nextTick(() => {
                        this.pauseWatcher = false
                    })
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
        setDateRange (/* String[] */ _dates) {
            this.clearPrevAction() 
            if (!_dates.length) {
                this.pauseWatcher = true
            }
            this.updateDateRange(_dates)
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
        buildSelectionList (fnName) {
            let _fn = this[fnName]
            if ( _fn ) return _fn()
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
        evaluate (conditions, ...params) {
            //console.log('DateRangePlugin.evalute() ', conditions, params)
            let _result = []

            if (!this.allowBackInTime) {

                if (typeof conditions === 'string') conditions = [conditions]

                if (Array.isArray(conditions)) {
                    conditions.forEach( (condition, index) => {

                        if (condition === undefined) {
                            _result.push(true)
                        }

                        let _params = null
                        if (conditions.length === params.length) {
                            _params = params[index]                 //TODO: should we have this assumption ?
                        } else {
                            _params = Array.isArray(params) 
                                        ? params.length === 0 
                                            ? null : params 
                                        : params
                        }

                        let _fn = this[condition]

                        if (_fn) {
                            if (!_fn(_params)) _result.push(false)  //TODO: we should push the result of the _fn directly ?
                        } else {
                            _result.push(false)
                        }

                    })
                }
            }
            return _result.every(_r => _r === true)
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
        processMode(dates, mode = null) {
            //console.log(`processMode (${dates}, ${mode})`)
            if ((mode || this.pickerConfig.mode) === 'strict') {
                this.clearCurrentAction()
                this.clearPrevAction()
                this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.rangeNotAllowed'))
            } else if ((mode || this.pickerConfig.mode) === 'lazy') {
                if (this.todayIsInRange(dates)) {
                    this.setDateRange(dates)
                    this.emitConsoleWarning(this.$vuetify.t('$vuetify.dateRangePicker.rangeIncludesPastDates'))
                } else {
                    this.clearCurrentAction()
                    this.clearSelection()
                    this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.rangeNotAllowed'))
                }
            } else if ((mode || this.pickerConfig.mode) === 'fuzzy') {
                //console.log('Using fuzzy...')
                if (this.todayIsInRange(dates)) {
                    this.setDateRange(dates)
                    this.emitConsoleWarning(this.$vuetify.t('$vuetify.dateRangePicker.rangeIncludesPastDates'))
                } else {
                    this.clearMRU()
                    this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.selectionRefused'))
                }
            } else if (mode === 'bully') {
                this.clearMRU()
                this.emitConsoleError(this.$vuetify.t('$vuetify.dateRangePicker.selectionRefused'))
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
        getItemText (item) {
            return item ? item.text ? item.text : null : null
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
        getItemValue (item) {
            return item.value
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
        getSiblingData (...params) {
            let results = []

            let [data, fields] = params
            
            if (data.hasOwnProperty('options') && Array.isArray(data.options)) {
                data.options.forEach( (item) => {
            
                        if (Array.isArray(fields)) {
                            fields.split(',').map( (f) => {     
                                if ( item.ref === f) {
                                    results.push(item.value)
                                }
                            })
                        } else if (typeof fields === 'string') {
                            if ( item.ref === fields ) {
                                results = [item.value]
                            }
                        }
                })
            }
            return results
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
        setCurrentAction ( actionName ) {
            //console.log(`setCurrentAction( ${actionName})`)
            let _actions = []
            _actions.push(actionName)

            this.pickerOptions.forEach( (item, index) => {
                item.options.forEach( (val, index) => {
                    if (val.action === actionName && val.needs !== undefined) {
                        _actions.push(val.needs)
                    }
                })
            })
            //console.log(`setting current action to `,_actions)
            this.currentAction = _actions
            //console.log(`system currentAction was set to`, this.currentAction)
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
        mruAction ( actionObject ) {
            if (this.mru.length === 100) {
                this.mru.shift()
            }
            this.mru.push(actionObject)
        },

        /**
         * In support of quick seleciton helpers;
         * 
         * clearCurrentAction resets the action tracking
         * mechanism
         * 
         * @return {void}
         */
        clearCurrentAction () {
            //console.log(`Action was: ${this.currentAction}`)
            this.currentAction = null
        },

        /**
         * In support of quick selection helpers;
         * 
         * clearSelection clears previous user selections
         *  
         * @return {void}
         */
        clearSelection () {
            //console.log('DateRangePlugin.clearSelection()')
            this.mru = []

            this.clearPrevAction()

        },

        /**
         * In support of quick selection helpers;
         * 
         * clearPrevAction resets the UI after a user chooses a
         * second shortcut.
         * 
         * @return {void}
         */
        clearPrevAction () {
            //console.log('DateRangePlugin.clearPrevAction()')
            let _ca = this.currentAction
            //console.log(_ca)
            
            //reset group models
            this.pickerOptions.forEach( (item) => {
                if (item.type && item.type === 'group') {
                    let _obj = item.options.find(o => o.action === _ca)
                    if (!_obj) {
                        item.groupModel = null
                    }
                }
            })

            //reset individual component models
            this.pickerOptions.forEach( (item, index) => {
                item.options.forEach( (val, index) => {
                    if (_ca === null || (!_ca.includes(val.ref) && !_ca.includes(val.action) && val.value !== undefined)) {
                        this.$nextTick( () => {
                            val.value = []
                        },val)
                    }
                }) 
            })
        },

        /**
         * In support of quick selection helpers;
         * 
         * clearMRU removes the last user selection from the date range
         * 
         * @return {void}
         */
        clearMRU () {  
            //console.log('clearMRU ()')       
            this.$nextTick( () => {
                let _mru = this.mru.pop()
                //console.log(`mru is: ${_mru}`)
                this.pickerOptions.forEach( (item, index) => {
                    item.options.forEach( (val, index) => {
                        if (val.action === _mru && Array.isArray(val.value)) {
                            if (val.value.length) {
                                val.value.pop()
                            }
                        }
                    })
                })
            })
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
        showHidePanel (panel) {
            // toggle the expand state of the panel
            panel.show = !panel.show
            this.panel = panel

            // hide other panels
            this.pickerOptions.forEach( (option) => {
                if (option.title !== panel.title) {
                    option.visible = panel.show ? false : true
                }
            })
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
        onAction ( ...attributes ) {    
            this.$nextTick(() => {      
                //console.log('Parameters array: ',attributes) 
                var [date, event, fnName, value, siblingData, ...conditions] = attributes
                //console.log(`onAction`, fnName)
                let _strDate = date
                let _d = this.validateDate(_strDate)
                let _fn = null

    
                _fn = this[fnName]
                if (_fn) {
                    this.setCurrentAction(fnName)
                    this.mruAction(fnName)
                    _fn(_d, event, value, siblingData, this.allowBackInTime ? undefined : conditions)
                    this.currentAction = null
                }
            })
        
        },

        /**
         * ucFirst capitalizes the first letter of a string
         * 
         * @param  {String} str The string to process
         * @return {String}     The capitalized string
         */
        ucFirst(/*String*/ str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
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
        warningSingleRangeMode() {
            this.emitConsoleWarning(this.$vuetify.t('$vuetify.dateRangePicker.warningSingleRange'))
        }
    }
}