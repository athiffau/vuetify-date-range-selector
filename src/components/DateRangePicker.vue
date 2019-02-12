<template>
    <v-layout row wrap>
        <v-flex xs12 sm6 md4>
            <v-menu
            ref="menu"
            :close-on-content-click="false"
            v-model="isOpen"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            :dark="dark"
            >
                <v-text-field
                    slot="activator"
                    v-model="dateRangeText"
                    :label="label"
                    :prepend-icon="icon"
                    readonly 
                    :dark="dark"
                    :solo="solo"
             
                ></v-text-field>
                <v-card
                    :dark="dark"
                >
                    <v-layout row wrap>
                      <template v-for="index in numPickers">  
                        <v-date-picker v-model="dateRange" v-if="index == 1 ? enableCheckOutView : enableCheckInView"
                            :allowed-dates="allowedDates"
                            :color="getPickerColor(index)"
                            :dark="dark"
                            :day-format="dayFormat"
                            :event-color="eventColor"
                            :events="date => eventsEx(date, index)"
                            :first-day-of-week="firstDayOfWeek"
                            :header-color="headerColor"
                            :header-date-format="headerDateFormat"
                            :hover-link="dateConfig.hoverLink"
                            :key="index"
                            :light="light"
                            :locale="locale"
                            :min="dateConfig[`pickerMin${index}`]"
                            :max="dateConfig[`pickerMax${index}`]"
                            :multiple=true
                            :next-icon="nextIcon"
                            :no-title="noTitle" 
                            :picker-date="dateConfig[`pickerView${index}`]"
                            :prev-icon="prevIcon"
                            :range="range"
                            :reactive="reactive"
                            :scrollable="scrollable"
                            :show-current="showCurrent"
                            :show-week="showWeek"
                            :title-date-format="date => getPickerTitle(date, index)"
                            :type="type"
                            :year-format="yearFormat"
                            :year-icon="yearIcon"
                            v-on:hoverLink="setHoverLink"
                            v-on:input="dates => onInputChange(dates, index)" 
                            v-on:click:date="date => onDateClicked(date, index)" 
                            v-on:update:pickerDate="date => onPickerUpdate(date, index)" 
                        >
                        </v-date-picker>
                      </template>  
                    </v-layout>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click="isOpen = false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-flex>
    </v-layout>
</template>

<script>
    //import pad from './util/pad.ts'
    import VDatePicker from 'vuetify/es5/components/VDatePicker/VDatePicker'   
    export default {
        name: 'v-date-range-picker',
        extends: VDatePicker,
        data: () => ({
            deltaOrigin: 0,
            dateRange: [],
            dateConfig: {
                checkIn: {
                    view: '2019-01-01',
                    min: null,
                    max: null,
                    currentDate: null,
                    currentInput: null,
                    updateEvent: null
                },
                checkOut: {
                    view: '2019-02-01',
                    min: null,
                    max: null,
                    currentDate: null,
                    currentInput: null,
                    updateEvent: null
                },
                hoverLink: null,
                min: [],
                max: [],
                view: [],
                currentDate: [],
                currentInput: [],
                updateEvent: []
            },
            isOpen: false,
            loaded: false,
        }),
        props: {
            allowBackInTime: {
                type: Boolean,
                default: false
            },
            autoHide: {
                type: Boolean,
                default: true
            },
            color: {
                type: Array,
                default: null
            },
            label: {
                type: String,
                default: 'Date-range picker'
            },
            icon: {
                type: String,
                default: 'event'
            },
            noTitle: {
                type: Boolean,
                default: false
            },
            numPickers: {
                type: Number,
                default: 2
            },
            solo: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            // rangeData: {
            //     get() {
            //         const _cin = this.dateConfig.checkIn.currentInput 
            //                 ? this.dateConfig.checkIn.currentInput.filter(input => input.includes(this.dateConfig.checkIn.view))
            //                 : this.dateRange.filter(input => input.includes(this.dateConfig.checkIn.view))

            //         const _cout = this.dateConfig.checkOut.currentInput
            //                 ? this.dateConfig.checkOut.currentInput.filter(input => input.includes(this.dateConfig.checkOut.view))
            //                 : this.dateRange.filter(input => input.includes(this.dateConfig.checkOut.view))

            //         if (_cin.length === 2) {
            //             return [_cin[0], _cin[1]]
            //         } else if (_cout.length === 2) {
            //             return [_cout[0], _cout[1]]
            //         } else {
            //             return [_cin[0], _cout[0]]
            //         }
            //     }
            // },
            dateRangeText: {
                get() {
                    this.dateRange.sort()
                    // if ( (this.singleInSelected && this.singleOutSelected) || (!this.singleInSelected && !this.singleOutSelected) ) {                       
                    //     return this.dateRangeToStr(this.dateRange[0], this.dateRange[1])
                    // } else if (!this.singleInSelected) {
                    //     return this.dateRangeToStr('',this.dateRange[0])
                    // } else if (!this.singleOutSelected) {
                    //     return this.dateRangeToStr(this.dateRange[0], '')
                    // }
                    if (this.dateRange.length === 2) {
                        return this.dateRangeToStr(this.dateRange[0], this.dateRange[1])
                    } else if (this.dateRange.length === 1) {
                        return this.dateRangeToStr(this.dateRange[0], '')
                    } else {
                        return ''
                    }
                }
            },
            checkInColor: {
                get() {
                    return this.color ? this.color[0] : undefined
                }
            },
            checkOutColor: {
                get() {
                    return this.color ? this.color[1] : undefined
                }
            },
            // singleInSelected: {
            //     get() {
            //         return this.monthCount(this.dateConfig.checkIn.view) === 1
            //     }
            // },
            // singleOutSelected: {
            //     get() {
            //         return this.monthCount(this.dateConfig.checkOut.view) === 1
            //     }
            // },
            enableCheckInView: {
                get() {
                    if (!this.autoHide) {
                        return true
                    }
                    return this.monthCount(this.dateConfig.checkIn.view) <= 1
                }
            },
            enableCheckOutView: {
                get() {
                    if (!this.autoHide) {
                        return true
                    }
                    return this.monthCount(this.dateConfig.checkOut.view) <= 1
                }
            }
        },
        methods: {
            dateFromStr(strDate, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
                if (typeof strDate === 'string') {
                    let yr  = parseInt(strDate.substring(0,4))
                    let mon = parseInt(strDate.substring(5,8))
                    let dt  = parseInt(strDate.substring(8,10))

                    let d = new Date(yr, mon-1, dt ? dt : 1)

                    d.setMonth(d.getMonth()+deltaMonth, d.getDate()+deltaDay)

                    return d
                }

                return null
            },
            dateToStr(date) {
                if (date && typeof date.toISOString === 'function') {
                    return this.formatters.titleDate(date.toISOString().substr(0,10))
                } else if (date && typeof date === 'string') {
                    return this.formatters.titleDate(date)
                } 
                
                return null
            },
            dateToISOStr(date, len = 10) {
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
            },
            dateToMonthYear(date) {
                if (date && typeof date.toISOString === 'function') {
                    return this.formatters.titleMonthYear(date.toISOString().substr(0,10))      
                } else if (date && typeof date === 'string') {
                    return this.formatters.titleMonthYear(date)
                }
                return null          
            },
            dateRangeToStr(chkIn,chkOut) {
                const _cin = this.dateToStr(chkIn)
                const _cout = this.dateToStr(chkOut)

                return `${_cout 
                            ? _cin 
                                ? _cin + ' - ' + _cout
                                : ' - ' + _cout
                            : _cin 
                                ? _cin + ' - '
                                : ''       
                        }`

            },
            monthYearToStr(chkIn,chkOut) {
                const _cin = this.dateToMonthYear(chkIn)
                const _cout = this.dateToMonthYear(chkOut)

                return `${_cout
                            ? _cin
                                ? _cin + ' - ' + _cout
                                : ' - ' + _cout
                            : _cin
                                ? _cin + ' - '
                                : ''

                        }`
            },
            getMonth(date1) {
                if (typeof date1 === 'string') {
                    date1 = dateFromStr(date1)
                }

                if (typeof date1.getMonth !== 'function') return false

                return date1.getMonth()
            },
            monthCount(date) {
                let _month = -1

                if (date && typeof date === 'string') {
                    _month = this.getMonth(this.dateFromStr(date))
                } else if (date && typeof date === 'number') {
                    _month = date
                } else {
                    return -1
                }

                let _mcount = 0
                for(let i=0; i<this.dateRange.length; i++) {
                    if(this.getMonth(this.dateFromStr(this.dateRange[i])) === _month) _mcount++
                }
                return _mcount
            },
            deltaDate(date1, date2, callback = null) {
                let _old = this.dateFromStr(date1).getTime()
                let _new = this.dateFromStr(date2).getTime()
                
                if (callback && typeof callback === 'function') {
                    return callback(_old, _new)
                }               
            },
            getSelectionByMonth(date) {
                // let _d = null
                // let _m = null
                // let _r = []

                // if (date && typeof date === 'string') {
                //     _d = this.dateFromStr(date)
                // } else {
                //     _d = date
                // }

                // if (_d && typeof _d.getMonth === 'function') {
                //     _m = _d.getMonth()
                // }

                // if ( _m ) {
                //     for (let i=0; i<this.dateRange.length; i++) {
                //         let _md = this.dateFromStr(this.dateRange[i])  //we know dateRange is string[]
                //         if ( _md.getMonth() === _m) {
                //             _r.push(this.dateRange[i])
                //         }
                //     }

                //     return _r
                // }

                // return null
                return this.dateRange.findIndex(element => element.includes(date))
            },
            getPickerTitle(date, index) {
                if (this.monthCount(this.dateConfig[`pickerView${index}`]) === 1) {
                    let _item = this.getSelectionByMonth(this.dateConfig[`pickerView${index}`])
                    return _item != -1 
                               ? this.defaultTitleDateFormatter(this.dateRange[_item]) //bypass multipleDateFormatter
                               : ' - '
                } else if (this.monthCount(this.dateConfig[`pickerView${index}`]) === 2) {
                    return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                } else {
                    return '-'
                }                 


                // if (index === 1) {
                //     if (this.monthCount(this.dateConfig.checkIn.view) === 1) {
                //         return this.defaultTitleDateFormatter(this.dateRange[index-1]) //bypass multipleDateFormatter
                //     } else if (this.monthCount(this.dateConfig.checkIn.view) === 2) {
                //         return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                //     } else {
                //         return '-'
                //     } 
                // } else if (index === 2) {
                //     if (this.monthCount(this.dateConfig.checkOut.view) === 1) {
                //         if (this.monthCount(this.dateConfig.checkIn.view) === 0) {
                //             return this.defaultTitleDateFormatter(this.dateRange[0]) //bypass multipleDateFormatter
                //         } else {
                //             return this.defaultTitleDateFormatter(this.dateRange[index-1]) //bypass multipleDateFormatter
                //         }
                //     } else if (this.monthCount(this.dateConfig.checkOut.view) === 2) {
                //         return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                //     } else {
                //         return '-'
                //     } 
                // }
            },
            getPickerMin(index) {
                return this.dateConfig.min[index] || null
            },
            getPickerMax(index) {
                return this.dateConfig.max[index] || null
            },
            getPickerView(index) {
                return this.dateConfig.view[index] || null
            },
            getPickerColor(index) {
                return this.color[index % this.color.length]
            },
            setHoverLink(value) {
                this.dateConfig.hoverLink = value
            },
            eventsEx(date, index) {
                if (index === 1) {
                    const [,, day] = date.split('-')
                    if ([12,27,28].includes(parseInt(day,10))) return true
                    return false
                } else if (index === 2) {
                    const [,,day] = date.split('-')
                    if ([12,27,28].includes(parseInt(day,10))) return ['red', '#00f']
                    return false
                }
            },
            onInputChange(dates, index) {

                this.dateConfig.currentInput[index] = dates

                // if (index === 1) {
                //     this.dateConfig.checkIn.currenInput = dates
                // } else if (index === this.numPickers) {
                //     this.dateConfig.checkOut.currentInput = dates
                // } else {
                //     for (let i=2;i<this.numPickers;i++) {
                        
                //     }
                // }
                this.$nextTick( () => {
                    this.$emit('input', this.dateRange)
                })
            },
            onDateClicked(date, index) {
                this.dateConfig.currentDate[index] = date
                // if (index === 1) {
                //     this.dateConfig.checkIn.currentDate = date
                // } else if (index === 2) {
                //     this.dateConfig.checkOut.currentDate = date
                // }
            },
            onPickerUpdate(date, index) {
                // console.log(date, index)
                // if (index === 1) {
                    let _toDate = this.dateFromStr(date)    
                    let _fromDate = this.dateFromStr(this.dateConfig[`pickerView${index}`])
                    let _diff = _toDate.getTime() - _fromDate.getTime()
                    if (_diff != 0) {
                        let _delta = _diff > 0 ? 1 : -1
                        this.deltaOrigin = this.deltaOrigin + _delta
                    }

                //     if (_diff != 0) {
                //         let _incMonth = _diff > 0 ? 1 : -1
                        
                //         console.log(_diff, _incMonth)
                        
                        this.dateConfig[`pickerView${index}`] = this.dateToISOStr(date,7)

                        for (let x=index+1; x<=this.numPickers; x++) {
                            let _nd = this.dateFromStr(this.dateConfig[`pickerView${x-1}`],0,1).toISOString() 
                            this.dateConfig[`pickerMin${x}`] = _nd
                            this.dateConfig[`pickerView${x}`] = _nd.substr(0,7)
                        }

                //     }
                // } 
                
                
                //else if (index === 2) {
                //     this.dateConfig.view[index] = this.dateToISOStr(date,7)                  
                // }

                // let _callback = (_old, _new) => {
                //     if (_new > _old) {
                //         return 1
                //     } else if (_new < _old) {
                //         return -1
                //     } else {
                //         return 0
                //     } 
                // } 

                // this.dateConfig.view[index] = date

                // let _delta = this.deltaDate( this.dateConfig.view[index], date, _callback)
                // let _index = index
                // while (_index === this.numPickers) {
                //     console.log(_index)
                //     this.dateConfig.min[index+1] = this.dateFromStr(date,0,_index-index).toISOString().substr(0,10)
                //     _index++
                // }
                // _index = index
                // while(_index === this.numPickers) {
                //     console.log(_index)
                //     this.dateConfig.view[index+1] = this.dateFromStr(date,0,_delta+_index-index).toISOString().substr(0,7)
                //     _index++
                // }
                                   
                // this.dateConfig.view[index] = date
                
            }
        },
        watch: {
            dateRange: {
                handler(val, prev) {
                    if (this.dateRange.length > 2) {
                        this.dateRange.splice(1,1)
                    }
                },
                deep: true 
            },
        },
        created() {
            for (let i=1; i<=this.numPickers; i++) {
                let _d = new Date()
                _d.setMonth(_d.getMonth()+i-1)
                if (i > 1) _d.setDate(1)
                    
                this.$set(this.dateConfig, `pickerView${i}`, this.dateToISOStr( _d, 7 ) )
                this.$set(this.dateConfig, `pickerMin${i}`, this.dateToISOStr( _d ))

                // if (i > 1 && i != this.numPickers) {
                //     let _dm = new Date()
                //     _dm.setMonth(_d.getMonth()+1)
                //     _dm.setDate(1)
                //     this.$set(this.dateConfig, `pickerMax${i}`, this.dateToISOStr( _dm ))
                // } else {
                    
                // }

                this.$set(this.dateConfig, `pickerMax${i}`, undefined)
            }
        },
        mounted() {
            if (!this.loaded) {            
                console.log('Mounted !')   
                        let _d = new Date()

                        //set the start date
                        const startDate = _d.toISOString().substr(0,10)
                        const startYearMonth = _d.toISOString().substr(0,7)
                        this.dateRange.push(startDate)
                        //this.pickerRange.push(startDate)

                        //set limits to the checkIn panel
                        if (!this.allowBackInTime)
                        {                
                            let _e = _d;
                            _e.setDate(1)
                            this.dateConfig.checkIn.min = _e.toISOString().substr(0,10)
                        }
                        this.dateConfig.checkIn.view = startYearMonth

                        //setup the checkOut panel to the following month
                        _d.setMonth(_d.getMonth()+1)
                        const endDate = _d.toISOString().substr(0,10)
                        const endYearMonth = _d.toISOString().substr(0,7)
                        
                        this.dateRange.push(endDate)
                        //this.pickerRange.push(endDate)
                        //set the limit of the checkOut panel  
                        this.dateConfig.checkOut.view = endYearMonth

                        _d.setDate(1)
                        this.dateConfig.checkOut.min = _d.toISOString().substr(0,10)  
                    
                this.loaded = true
            }    
        }
    };
</script>

<style lang="styl">
 .v-btn 
  &&--range
    border-radius: unset
    &:before
      border-radius: unset 

  &&--range-hover
    background-color: black 

  &&--range-start
    border-top-left-radius: 5px
    border-bottom-left-radius: 5px
    &:before
      border-top-left-radius: 5px
      border-bottom-left-radius: 5px

  &&--range-end
    border-top-right-radius: 5px
    border-bottom-right-radius: 5px
    &:before
      border-top-right-radius: 5px
      border-bottom-right-radius: 5px
</style>