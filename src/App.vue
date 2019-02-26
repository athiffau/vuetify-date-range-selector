<template>
    <div id="app">
        <v-app :dark="dark">
            <v-container grid-list-md>
                <v-layout row wrap v-resize="onResize">
                    <v-flex xs12>
                        <v-subheader>Window Size</v-subheader>
                        {{ windowSize }}
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 lg4>
                        <v-menu ref="menu" v-model="dateRange1.isOpen"
                            :close-on-content-click="false"
                            :dark="dateRange1.dark"
                            full-width
                            offset-y
                            :nudge-right="$vuetify.breakpoint.mdAndDown ? 20 : $vuetify.breakpoint.xsOnly ? 0 : 20"
                            min-width="290px"
                            transition="scale-transition"                            
                        >
                            <v-text-field v-model="computedDatesToText"
                                clearable
                                :dark="dateRange1.dark"
                                :label="dateRange1.label"
                                :prepend-icon="dateRange1.icon"
                                readonly
                                slot="activator"                                       
                                @click:clear="onDateRange1ClickClear"
                            ></v-text-field>
                            <v-date-range-picker v-model="dateRange1.dates"
                                :allow-back-in-time=true
                                :auto-hide="dateRange1.autoHide"
                                :auto-size="dateRange1.autoSize"     
                                :header-color="dateRange1.color"
                                :is-drawer-open="dateRange1.isDrawerOpen"
                                :live-update="dateRange1.liveUpdates"
                                :multi-range=false
                                :no-title=false
                                :num-pickers="dateRange1.numPickers"
                                :reactive=true
                                :show-week=true
                                :start-date="'2017-01-01'"
                                :transitions=true
                                @input="onDateRange1Input"
                                @update="onDateRange1Update"
                                @update:pickerDate="onDateRange1PickerDate"
                                @update:pickerVisible="val => dateRange2.isDrawerOpen = val"
                            >
                                <template slot="panelOptions">
                                    <v-date-range-panel
                                        :dateRange="dateRange1.dates"
                                        :pickerDate="dateRange1.pickerDate"
                                        :updateDateRange="dates => updateDateRange(dates, 1)"
                                    ></v-date-range-panel>
                                </template>
                            </v-date-range-picker>
                        </v-menu>
                    </v-flex>

                    <v-flex xs12 lg4>
                        <v-menu
                            ref="menu"
                            :close-on-content-click="false"
                            v-model="dateRange2.isOpen"
                            :nudge-right="$vuetify.breakpoint.mdAndDown ? 20 : $vuetify.breakpoint.xsOnly ? 0 : 20"
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                            :dark="dateRange2.dark"
                        >
                            <v-text-field v-model="computedDatesToText2"
                                clearable
                                :dark="dateRange2.dark"
                                :label="dateRange2.label"
                                :prepend-icon="dateRange2.icon"
                                slot="activator"
                                readonly 
                                @click:clear="onDateRange2ClickClear"
                            ></v-text-field>
                            <v-date-range-picker v-model="dateRange2.dates"
                                :allow-back-in-time="dateRange2.pastDates"
                                :auto-focus="dateRange2.autoFocus"
                                :auto-hide="dateRange2.autoHide"
                                :auto-size="dateRange2.autoSize" 
                                :events="date => eventsEx(date)" 
                                :header-color="dateRange2.color"  
                                :no-title="dateRange2.noTitle"
                                :num-pickers="dateRange2.numPickers"
                                :max-width="580"
                                :mode="dateRange2.mode"
                                :multi-range=false
                                :picker-date="dateRange2.pickerDate"
                                :is-drawer-open="dateRange2.isDrawerOpen"
                                :reactive=true
                                :show-week="dateRange2.showWeeks"
                                :start-date="'2017-01-01'"
                                :transitions=true               
                                @input="onDateRange2Input"
                                @update="onDateRange2Update"
                                @update:pickerDate="onDateRange2PickerDate"
                                @update:pickerVisible="val => dateRange2.isDrawerOpen = val"
                                @info="msg => onDateSelectionEvent(msg, 'info', 2)"
                                @warning="msg => onDateSelectionEvent(msg, 'warning', 2)"
                                @error="msg => onDateSelectionEvent(msg, 'error', 2)"
                            >
                                <template slot="drawerOptions">
                                    <v-date-range-drawer
                                        :allow-back-in-time="dateRange2.pastDates"
                                        :date-range="dateRange2.dates"
                                        :picker-date="dateRange2.pickerDate"
                                        :picker-drawer-visible="dateRange2.isDrawerOpen"
                                        :update-date-range="dates => updateDateRange(dates, 2)"
                                        @update:pickerVisible="val => dateRange2.isDrawerOpen = val"
                                        @info="msg => onDateSelectionEvent(msg, 'info', 2)"
                                        @warning="msg => onDateSelectionEvent(msg, 'warning', 2)"
                                        @error="msg => onDateSelectionEvent(msg, 'error', 2)"
                                    ></v-date-range-drawer>
                                </template>
                            </v-date-range-picker>
                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-snackbar
                v-model="snackbar.visible"
                :color="snackbar.color"
                :multi-line="snackbar.mode === 'multi-line'"
                :timeout="snackbar.timeout"
                :vertical="snackbar.mode === 'vertical'"
            >
                {{ snackbar.text }}
                <v-btn
                dark
                flat
                @click="snackbar.visible = false"
                >
                Close
                </v-btn>
            </v-snackbar>
        </v-app>
    </div>
</template>

<script>
//Import component (only because component is in user-land)
import VDateRangePicker from './components/DateRangePicker.vue'
//Optional DateHelper library
import DateHelper from './mixins/DateHelper.js'

/** DateRange Plugins */
//Add plugin module A
import VDateRangeDrawer from './components/DateRangeDrawer.vue'
//Add plugin module B
import VDateRangePanel from './components/DateRangeQuickSelectPanel.vue'

export default {
    components: {
        VDateRangePicker, VDateRangeDrawer, VDateRangePanel
    },
    mixins: [DateHelper],
    data: () => ({
        dateRange1: {
            autoHide: false,
            autoSize: false,
            dates: [],
            dark: false,
            color: ["primary", "warning", "info", "error"],
            isOpen: false,
            icon: 'event',
            isDrawerOpen: false,
            label: 'Date-range picker',
            liveUpdates: true,
            numPickers: 4,
            pickerDate: null
        },
        dateRange2: {
            autoHide: false,
            autoSize: true,
            autoFocus: true,
            dates: [],
            dark: false,
            color: ["blue", "dark grey"],
            isOpen: false,
            icon: 'event',
            isDrawerOpen: false,
            label: 'Date-range picker',
            numPickers: 4,
            mode: 'fuzzy',
            multiRange: false,
            noTitle: false,
            pastDates: false,
            pickerDate: null,
            showWeeks: true
        },
        snackbar: {
            visible: false,
            color: '',
            mode: '',
            timeout: 6000,
            text: ''
        },
        dark: true,
        windowSize: {
            x: 0,
            y: 0
        }
    }),
    computed: {
        computedDatesToText: {
            get() {
               return this.dateRangeText(this.dateRange1.dates)
            },
            set(val) {
                console.log('Computed Date 1 Set !!!', val)
            }
        },
        computedDatesToText2: {
            get() {
                return this.dateRangeText(this.dateRange2.dates)
            },
            set(val) {
                console.log('Computed Date 1 Set !!!', val)
            }
        }
    },
    methods: {
        onDateRange1Input (dates) {
            this.dateRange1.isOpen = false
        },
        onDateRange1Update (dates) {
            this.dateRange1.dates = dates
        },
        onDateRange2Update (dates) {
            this.dateRange2.dates = dates
        },
        onDateRange1PickerDate (date) {
            this.dateRange1.pickerDate = date
        },
        onDateRange2PickerDate (date) {
            this.dateRange2.pickerDate = date
        },
        onDateRange2Input (dates) {
            console.log(dates)
            this.dateRange2.isOpen = false
        },
        onDateRange1ClickClear () {
            this.dateRange1.dates = []
        },
        onDateRange2ClickClear () {
            this.dateRange2.dates = []
        },
        onDateSelectionEvent (msg, mode, index) {
            console.log(`Oops! - ${mode.toUpperCase()}: ${msg}`)
            if (['info','warning','error'].includes(mode)) {
                this.snackbar.color = mode    
            } else {
                this.snackbar.color = 'error'
            }
            
            this.snackbar.text = msg
            this.snackbar.visible = true
        },
        eventsEx (date) {
            const [,, day] = date.split('-')
            if ([12,27,28].includes(parseInt(day,10))) return true
            if ([1,19,22].includes(parseInt(day,10))) return ['red', '#00f']
            return false
        },
        onResize () {
            this.windowSize = {x: window.innerWidth, y: window.innerHeight }
        },
        updateDateRange (dates, index) {
            if (index === 1) {
                this.dateRange1.dates = dates
            }
            if (index === 2) {
                this.dateRange2.dates = dates
            }
        }
    }
};
</script>

<style>

</style>?