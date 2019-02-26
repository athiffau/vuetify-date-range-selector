import Events from './DateRangeEvents.js'

export default {
    mixins: [Events],
    data:() => ({
        btnGroup: null,
        currentAction: null,
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
        },
        pickerDate: {
            type: String,
            default: undefined
        }
    },
    ingject: ['mode'],
    watch: {
        dateRange: {
            handler(val, prev) {
                if (Array.isArray(val) && Array.isArray(prev)) {
                    if (val.length === 0 && prev.length !== 0) {
                        this.clearCurrentAction()
                        this.clearSelection()
                    }
                }
            }
        }
    },
    methods: {
        /**
         * In support of quick selection helpers; returns
         * an array of strings used to dynamically populate
         * seleciton components
         * 
         * buildSelectionList calls a function by string 
         * 
         * @param  string  fnName  Name of function to invoke
         * @return String[]        Array of strings 
         */
        buildSelectionList (fnName) {
            let _fn = this[fnName]
            if ( _fn ) return _fn()
        },

        evaluate (conditions, ...params) {

            let _result = true

            if (!this.allowBackInTime) {

                if (typeof conditions === 'string') conditions = [conditions]

                if (Array.isArray(conditions)) {
                    conditions.forEach( (condition, index) => {

                        if (condition === undefined) {
                            return true
                        }

                        let _params = null
                        if (conditions.length === params.length) {
                            _params = params[index]
                        } else {
                            _params = params
                        }

                        let _fn = this[condition]

                        if (_fn) {
                            if (!_fn(_params)) _result = false
                        } else {
                            _result = false
                        }

                    })
                }
            }
            
            //console.log({result: _result})
            return _result
        },

        processMode(dates) {
            if (this.mode === 'strict') {
                this.clearCurrentAction()
                this.clearSelection()
                this.emitConsoleError('Date range is not allowed.')
            } else if (this.mode === 'lazy') {
                if (this.todayIsInRange(dates)) {
                    this.setDateRange(dates)
                    this.emitConsoleWarning('Date range includes past dates.')
                } else {
                    this.clearCurrentAction()
                    this.clearSelection()
                    this.emitConsoleError('Date range is not allowed.')
                }
            } else if (this.mode === 'fuzzy') {
                if (this.todayIsInRange(dates)) {
                    this.setDateRange(dates)
                    this.emitConsoleWarning('Date range includes past dates.')
                } else {
                    this.clearMRU()
                    this.emitConsoleInfo('Last selection could not be process. Date is in the past.')
                }
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
            let _actions = []
            _actions.push(actionName)

            this.pickerOptions.forEach( (item, index) => {
                item.options.forEach( (val, index) => {
                    if (val.action === actionName && val.needs !== undefined) {
                        _actions.push(val.needs)
                    }
                })
            })

            this.currentAction = _actions
        },

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
        clearCurrentAction() {
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
            this.updateDateRange([])
            this.btnGroup = null

            let _ca = this.currentAction

            this.pickerOptions.forEach( (item, index) => {
                item.options.forEach( (val, index) => {
                    if (_ca === null || (!_ca.includes(val.ref) && !_ca.includes(val.action) && val.value !== undefined)) {
                        this.$nextTick( () => {val.value = []},val)
                    }
                }) 
            })

        },

        clearMRU () {         
            this.$nextTick( () => {
                let _mru = this.mru.pop()

                this.pickerOptions.forEach( (item, index) => {
                    item.options.forEach( (val, index) => {
                        if (val.action === _mru) {
                            this.$nextTick( () => {val.value.pop()},val)
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
            var [date, event, fnName, value, siblingData, conditions] = attributes
            let _strDate = date
            let _d = this.validateDate(_strDate)
            let _fn = null

 
            _fn = this[fnName]
            if (_fn) {
                this.setCurrentAction(fnName)
                this.mruAction(fnName)
                _fn(_d, event, value, siblingData, conditions)
                this.currentAction = null
            }
        
        },

    }
}