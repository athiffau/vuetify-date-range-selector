<template>
    <v-layout row wrap>
        <v-flex xs12 sm6 md4>
            <v-menu
            ref="menu"
            :close-on-content-click="false"
            v-model="isOpen"
            :nudge-right="40"
            :return-value.sync="dateRange"
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
                    <v-layout row>
                        <v-date-picker v-model="dateRange" v-if="enableCheckOutView"
                            :allowed-dates="allowedDates"
                            :color="checkInColor"
                            :dark="dark"
                            :day-format="dayFormat"
                            :event-color="eventColor"
                            :events="eventsEx"
                            :first-day-of-week="firstDayOfWeek"
                            :header-color="headerColor"
                            :header-date-format="headerDateFormat"
                            :hover-link="dateConfig.hoverLink"
                            :light="light"
                            :locale="locale"
                            :min="dateConfig.checkIn.min"
                            :max="dateConfig.checkIn.max"
                            :multiple=true
                            :next-icon="nextIcon"
                            :no-title="noTitle" 
                            :picker-date="dateConfig.checkIn.view"
                            :prev-icon="prevIcon"
                            :range="range"
                            :reactive="reactive"
                            :scrollable="scrollable"
                            :show-current="showCurrent"
                            :show-week="showWeek"
                            :title-date-format="date => getPickerTitle(date, 0)"
                            :type="type"
                            :year-format="yearFormat"
                            :year-icon="yearIcon"
                            v-on:hoverLink="setHoverLink"
                            v-on:input="onCheckInInputChange" 
                            v-on:click:date="onCheckInDateClicked" 
                            v-on:update:pickerDate="onCheckInPickerUpdate" 
                        >
                        </v-date-picker>
                        <v-date-picker v-model="dateRange" v-if="enableCheckInView" 
                            :allowed-dates="allowedDates"
                            :color="checkOutColor"
                            :dark="dark"                            
                            :day-format="dayFormat"
                            :event-color="eventColor"
                            :events="eventsAlt"
                            :first-day-week="firstDayOfWeek"
                            :header-color="headerColor"
                            :header-date-format="headerDateFormat"
                            :hover-link="dateConfig.hoverLink"
                            :light="light"
                            :locale="locale"
                            :min="dateConfig.checkOut.min"
                            :max="dateConfig.checkOut.max"
                            :multiple=true
                            :next-icon="nextIcon"
                            :no-title="noTitle" 
                            :picker-date="dateConfig.checkOut.view"
                            :prev-icon="prevIcon"
                            :range="range"
                            :reactive="reactive"
                            :scrollable="scrollable"
                            :show-current="showCurrent"
                            :show-week="showWeek"
                            :title-date-format="date => getPickerTitle(date, 1)"
                            :type="type"
                            :year-format="yearFormat"
                            :year-icon="yearIcon"
                            v-on:hoverLink="setHoverLink"
                            v-on:input="onCheckOutInputChange" 
                            v-on:click:date="onCheckOutDateClicked" 
                            v-on:update:pickerDate="onCheckOutPickerUpdate" 
                        >
                        </v-date-picker>
                    </v-layout>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="isOpen = false">OK</v-btn>
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
            dateRange: [],
            dateConfig: {
                checkIn: {
                    view: '',
                    min: null,
                    max: null,
                    currentDate: null,
                    currentInput: null,
                    updateEvent: null
                },
                checkOut: {
                    view: '',
                    min: null,
                    max: null,
                    currentDate: null,
                    currentInput: null,
                    updateEvent: null
                },
                hoverLink: null
            },
            isOpen: false,
            loaded: false,
        }),
        props: {
            allowBackInTime: {
                type: Boolean,
                default: false
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
            solo: {
                type: Boolean,
                default: false
            },
        },
        computed: {
            dateRangeText: {
                get() {
                    this.dateRange.sort()
                    if ( (this.singleInSelected && this.singleOutSelected) || (!this.singleInSelected && !this.singleOutSelected) ) {                       
                        return this.dateRangeToStr(this.dateRange[0], this.dateRange[1])
                    } else if (!this.singleInSelected) {
                        return this.dateRangeToStr('',this.dateRange[0])
                    } else if (!this.singleOutSelected) {
                        return this.dateRangeToStr(this.dateRange[0], '')
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
            singleInSelected: {
                get() {
                    return this.monthCount(this.dateConfig.checkIn.view) === 1
                }
            },
            singleOutSelected: {
                get() {
                    return this.monthCount(this.dateConfig.checkOut.view) === 1
                }
            },
            enableCheckInView: {
                get() {
                    return this.monthCount(this.dateConfig.checkIn.view) <= 1
                }
            },
            enableCheckOutView: {
                get() {
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
            dateToMonthYear(date) {
                if (date && typeof date.toISOString === 'function') {
                    return date.toISOString().substr(0,7)      
                } else if (date && typeof date === 'string') {
                    return this.formatters.rangeDate(date)
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
            //should be in formatter helpers
            rangeDateFormatter(dates) {
                const titleFormats = {
                    monthYear : { month: 'short', day: 'numeric' }
                }

                const intlDateFormatter = Intl.DateTimeFormat(this.locale || undefined, titleFormats['monthYear'])

                const pad = (string) => string

                const makeIsoString = (dateString) => {
                    const [year, month, date] = dateString.trim().split(' ')[0].split('-')
                    return [pad(year, 4), pad(month || 1), pad(date || 1)].join('-')
                }

                const titleDateFormatter = (dateString) => intlDateFormatter.format(new Date(`${makeIsoString(dateString)}T00:00:00+00:00`))

                console.log('formatting: ',dates)
                console.log(titleDateFormatter(dates[0]))
                if (Array.isArray(dates) && dates.lenght === 2) {
                    return `${titleDateFormatter(dates[0])} - ${titleDateFormatter(dates[1])}`
                }

                return null
                
            },
            getPickerTitle(date, index) {
                // if (index === 0) {
                //     if (this.monthCount(this.dateConfig.checkIn.view) === 1) {
                //         return this.defaultTitleDateFormatter(this.dateRange[index])
                //     } else if (this.monthCount(this.dateConfig.checkIn.view) === 2) {
                //         return this.rangeDateFormatter(this.dateRange)
                //     } else {
                //         return '-'
                //     } 
                // } else if (index === 1) {
                //     if (this.monthCount(this.dateConfig.checkOut.view) === 1) {
                //         return this.defaultTitleDateFormatter(this.dateRange[index])
                //     } else if (this.monthCount(this.dateConfig.checkIn.view) === 2) {
                //         return this.rangeDateFormatter(this.dateRange)
                //     } else {
                //         return '-'
                //     } 
                // }

                if (index === 0) {
                    if (this.monthCount(this.dateConfig.checkIn.view) === 1) {
                        return this.defaultTitleDateFormatter(this.dateRange[index])
                    } else if (this.monthCount(this.dateConfig.checkIn.view) === 2) {
                        return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                    } else {
                        return '-'
                    } 
                } else if (index === 1) {
                    if (this.monthCount(this.dateConfig.checkOut.view) === 1) {
                        if (this.monthCount(this.dateConfig.checkIn.view) === 0) {
                            return this.defaultTitleDateFormatter(this.dateRange[0])
                        } else {
                            return this.defaultTitleDateFormatter(this.dateRange[index])
                        }
                    } else if (this.monthCount(this.dateConfig.checkOut.view) === 2) {
                        return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                    } else {
                        return '-'
                    } 
                }

                // if ( (this.singleInSelected && this.singleOutSelected) || (!this.singleInSelected && !this.singleOutSelected) ) {                       
                //     return this.monthYearToStr(this.dateRange[0], this.dateRange[1])
                // } else if (!this.singleInSelected) {
                //     return this.monthYearToStr('',this.dateRange[0])
                // } else if (!this.singleOutSelected) {
                //     return this.monthYearToStr(this.dateRange[0], '')
                // }

            },
            monthCount(date, index) {
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
            setHoverLink(value) {
                this.dateConfig.hoverLink = value
            },
            eventsEx(date) {
                const [,, day] = date.split('-')
                if ([12,27,28].includes(parseInt(day,10))) return true
                return false
            },
            eventsAlt(date) {
                const [,,day] = date.split('-')
                if ([12,27,28].includes(parseInt(day,10))) return ['red', '#00f']
                return false
            },
            onCheckInInputChange(e) {
                this.dateConfig.checkIn.currentInput = e
            },
            onCheckInDateClicked(e) {
                this.dateConfig.checkIn.currentDate = e
            },
            onCheckInPickerUpdate(e) {
                this.dateConfig.checkIn.updateEvent = e
                this.dateConfig.checkIn.view = e
                this.dateConfig.checkOut.view = this.dateToMonthYear(this.dateFromStr(e,0,1))
            },
            onCheckOutInputChange(e) {
                this.dateConfig.checkOut.currentInput = e
            },
            onCheckOutDateClicked(e) {
                this.dateConfig.checkOut.currentDate = e
            },
            onCheckOutPickerUpdate(e) {
                this.dateConfig.checkOut.updateEvent = e
                this.dateConfig.checkOut.view = e
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
            }
        },
        mounted() {
            let _d = new Date()

            //set the start date
            const startDate = _d.toISOString().substr(0,10)
            const startYearMonth = _d.toISOString().substr(0,7)
            this.dateRange.push(startDate)

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
            
            this.dateRange.push( endDate )
            //set the limit of the checkOut panel  
            this.dateConfig.checkOut.view = endYearMonth

            _d.setDate(1)
            this.dateConfig.checkOut.min = _d.toISOString().substr(0,10)         

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
</style>