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
                        <v-date-picker v-on:input="showMe" v-on:click:date="showMe" v-on:update:pickerDate="showMe2" v-model="dateRange.checkIn" v-if="singleOutSelected"
                            :allowed-dates="allowedDates"
                            :color="checkInColor"
                            :dark="dark"
                            :day-format="dayFormat"
                            :event-color="eventColor"
                            :events="eventsEx"
                            :first-day-of-week="firstDayOfWeek"
                            :header-color="headerColor"
                            :header-date-format="headerDateFormat"
                            :light="light"
                            :locale="locale"
                            :min="dateConfig.checkIn.min"
                            :max="dateConfig.checkIn.max"
                            :multiple=true
                            :next-icon="nextIcon"
                            :no-title="noTitle" 
                            :prev-icon="prevIcon"
                            :reactive="reactive"
                            :scrollable="scrollable"
                            :show-current="showCurrent"
                            :show-week="showWeek"
                            :title-date-format="titleDateFormat"
                            :type="type"
                            :year-format="yearFormat"
                            :year-icon="yearIcon"
                        >
                        </v-date-picker>
                        <v-date-picker v-model="dateRange.checkOut" v-if="singleInSelected" 
                            :allowed-dates="allowedDates"
                            :color="checkOutColor"
                            :dark="dark"                            
                            :day-format="dayFormat"
                            :event-color="eventColor"
                            :events="eventsAlt"
                            :first-day-week="firstDayOfWeek"
                            :header-color="headerColor"
                            :header-date-format="headerDateFormat"
                            :light="light"
                            :locale="locale"
                            :min="dateConfig.checkOut.min"
                            :max="dateConfig.checkOut.max"
                            :multiple=true
                            :next-icon="nextIcon"
                            :no-title="noTitle" 
                            :prev-icon="prevIcon"
                            :reactive="reactive"
                            :scrollable="scrollable"
                            :show-current="showCurrent"
                            :show-week="showWeek"
                            :title-date-format="titleDateFormat"
                            :type="type"
                            :year-format="yearFormat"
                            :year-icon="yearIcon"
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
    import VDatePicker from 'vuetify/es5/components/VDatePicker/VDatePicker'   
    export default {
        name: 'v-date-range-picker',
        extends: VDatePicker,
        data: () => ({
            dateRange: {
                checkIn: [],
                checkOut: [],
            },
            dateConfig: {
                checkIn: {
                    min: null,
                    max: null
                },
                checkOut: {
                    min: null,
                    max: null
                }
            },
            isOpen: false,
            loaded: false,
            singleInSelected: false,
            singleOutSelected: false,
        }),
        props: {
            label: {
                type: String,
                default: 'Date-range picker'
            },
            icon: {
                type: String,
                default: 'event'
            },
            allowBackInTime: {
                type: Boolean,
                default: false
            },
            noTitle: {
                type: Boolean,
                default: false
            },
            solo: {
                type: Boolean,
                default: false
            },
            color: {
                type: Array,
                default: null
            }
        },
        computed: {
            dateRangeText: {
                get() {
                    if (this.singleInSelected && this.singleOutSelected) {
                        return `${this.dateRange.checkIn[0]/*.toISOString().substr(0,10)*/} - ${this.dateRange.checkOut[0]/*.toISOString().substr(0,10)*/}`
                    } else if (!this.singleInSelected && this.singleOutSelected) {
                        this.dateRange.checkIn.sort()
                        return `${this.dateRange.checkIn[0]/*.toISOString().substr(0,10)*/} - ${this.dateRange.checkIn[1]/*.toISOString().substr(0,10)*/}`
                    } else {
                        this.dateRange.checkOut.sort()
                        return `${this.dateRange.checkOut[0]/*.toISOString().substr(0,10)*/} - ${this.dateRange.checkOut[1]/*.toISOString().substr(0,10)*/}`
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
        },
        methods: {
            dateFromStr(strDate, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
                let yr  = parseInt(strDate.substring(0,4))
                let mon = parseInt(strDate.substring(5,8))
                let dt  = parseInt(strDate.substring(8,10))

                let d = new Date(yr, mon-1, dt)

                d.setMonth(d.getMonth()+deltaMonth, d.getDate()+deltaDay)

                return d
            },
            enableCheckInView() {
                let _cin = this.dateRange.checkIn.length
                let _cout = this.dateRange.checkOut.length

                return ((_cin == 0 || _cin == 1) && (_cout !=- 2)) ? true : false 
            },
            enableCheckOutView() {
                let _cin = this.dateRange.checkIn.length
                let _cout = this.dateRange.checkOut.length

                return ((_cout == 0 || _cout == 1) && (_cin !=- 2)) ? true : false 
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
            showMe(e) {
                console.log(e)
            },
            showMe2(e,v) {
                console.log(e,v)
            }
        },
        watch: {
            dateRange: {
                handler(val, prev) {
                    this.singleInSelected = this.enableCheckInView()
                    this.singleOutSelected = this.enableCheckOutView()

                    if (val.checkIn.length == 1) {
                        let _cin = this.dateFromStr(val.checkIn[0])
                        let _cout = this.dateFromStr(val.checkOut[0])

                        if (prev.checkIn[0] !== null && _cin.getMonth() >= _cout.getMonth()) {
                            
                            let _d = this.dateFromStr(val.checkIn[0],0,1)

                            //console.log(_d.toISOString().substr(0,10))
                            _d.setDate(1)
                            this.dateConfig.checkOut.min = _d.toISOString().substr(0,10)
                            this.dateRange.checkOut[0] = this.dateConfig.checkOut.min
                        }
                    } else {
                        if (this.dateRange.checkIn.length > 2) {
                            this.dateRange.checkIn.splice(1,1)
                            this.singleInSelected = this.enableCheckInView()
                        }
                    }

                    if (this.dateRange.checkOut.length > 2) {
                        this.dateRange.checkOut.splice(1,1)
                        this.singleOutSelected = this.enableCheckOutView()
                    }

                },
                deep: true 
            }
        },
        mounted() {
            //set pickers one month appart            
            let _d = new Date()

            if (this.dateRange.checkIn[0]) {
                _d = this.dateRange.checkIn[0]
            } else {
                this.dateRange.checkIn[0] = _d.toISOString().substr(0,10)
            }

            if (!this.allowBackInTime)
            {                
                let _e = _d;
                _e.setDate(1)
                this.dateConfig.checkIn.min = _e.toISOString().substr(0,10)
            }

            _d.setMonth(_d.getMonth()+1)
            this.dateRange.checkOut[0] = _d.toISOString().substr(0,10)
            this.dateConfig.checkOut.min = this.dateRange.checkOut[0]

            this.singleInSelected = this.enableCheckInView()
            this.singleOutSelected = this.enableCheckOutView()
        }
    };
</script>

<style>

</style>