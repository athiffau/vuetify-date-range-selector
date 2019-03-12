<template>
    <div id="app">
        <v-app id="inspire" :dark="dark" ma-5>
            <div>
            <v-container grid-list-md v-if="showExtended"> 
                <v-layout row wrap v-resize="onResize">
                    <v-flex xs9>
                        <v-subheader>Window Size</v-subheader>
                        {{ windowSize }}
                    </v-flex>
                    <v-flex xs3>
                        <v-select
                            v-model="langOverride"
                            :items="langOptions"
                            prepend-icon="language"
                            single-line
                            @change="applyLangSelection"
                        ></v-select>
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
                            <v-text-field v-model="dateRange1.text"
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
                                :locale="browserLocale"
                                :multi-range=false
                                :no-title=false
                                :num-pickers="dateRange1.numPickers"
                                :picker-date="dateRange1.pickerDate"
                                :reactive=true
                                :show-week=true
                                :transitions=true
                                @input="onDateRange1Input"
                                @update="onDateRange1Update"
                                @update:pickerDate="onDateRange1PickerDate"
                                @update:pickerVisible="val => dateRange2.isDrawerOpen = val"
                            >
                                <template slot="panelOptions">
                                    <v-date-range-panel
                                        :dateRange="dateRange1.dates"
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
                            <v-text-field v-model="dateRange2.text"
                                clearable
                                :dark="dateRange2.dark"
                                :label="localizedPickerLable"
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
                                :locale="browserLocale"
                                :no-title="dateRange2.noTitle"
                                :num-pickers="dateRange2.numPickers"
                                :max-width="dateRange2.maxWidth"
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
                <v-layout row wrap>
                    <v-flex xs12 lg4>
                    </v-flex>
                </v-layout>
            </v-container>

            <v-date-range-picker v-model="dateRange3.dates"
                :allow-back-in-time=false
                :auto-hide="dateRange3.autoHide"
                :auto-size="dateRange3.autoSize"
                class="mb-3"
                :header-color="dateRange3.color"
                :hide-disabled="dateRange3.hideDisabled"
                :live-update="dateRange3.liveUpdates"
                :locale="browserLocale"
                :multi-range=false
                :no-title=false
                :num-pickers=2
                :reactive=true
                :show-week=true
                :transitions=true
            >
            </v-date-range-picker>

            <v-date-picker v-model="picker"></v-date-picker>

            <div>
                <v-checkbox v-model="landscape" label="Landscape"></v-checkbox>
                <v-date-picker v-model="pickerMonth" :landscape="landscape" type="month"></v-date-picker>
            </div>

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
            </div>
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
import VDateRangeDrawer from './components/DateRangeShortcutDrawer.vue'
//Add plugin module B
import VDateRangePanel from './components/DateRangeShortcutPanel.vue'

export default {
    components: {
        VDateRangePicker, VDateRangeDrawer, VDateRangePanel
    },
    mixins: [DateHelper],
    data: () => ({
        picker: new Date().toISOString().substring(0,10),
        pickerMonth: new Date().toISOString().substring(0,7),
        browserLocale: 'en-US',
        langOverride: 'en',
        onLine: navigator.onLine,
        langOptions: [],
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
            locale: 'en-US',
            liveUpdates: true,
            numPickers: 4,
            pickerDate: null,
            text: ''
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
            label: '',
            numPickers: 4,
            maxWidth: 580,
            mode: 'fuzzy',
            multiRange: false,
            noTitle: false,
            pastDates: false,
            pickerDate: null,
            showWeeks: true,
            text: ''
        },
        dateRange3: {
            autoHide: false,
            autoSize: false,
            dates: [],
            dark: false,
            color: ["primary", "warning", "info", "error"],
            isOpen: false,
            icon: 'event',
            isDrawerOpen: false,
            hideDisabled: true,
            label: 'Date-range picker',
            liveUpdates: true,
            numPickers: 4,
            pickerDate: null,
            text: ''
        },
        snackbar: {
            visible: false,
            color: '',
            mode: '',
            timeout: 6000,
            text: ''
        },
        dark: true,
        landscape: false,
        showExtended: false,
        windowSize: {
            x: 0,
            y: 0
        }
    }),
    watch: {
        Range1Dates: {
            handler(val,prev) {
                if (val !== prev) {
                   this.setRange1Text()
                }
            }
        },
        Range2Dates: {
            handler(val,prev) {
                if (val !== prev) {
                    this.setRange2Text()
                }
            }
        },
        Range3Dates: {
            handler(val,prev) {
                if (val !== prev) {
                    this.setRange3Text()
                }
            }
        },
        browserLocale: {
            handler(val, prev) {
                if (val !== prev) {
                    let _supported = Object.keys(this.$vuetify.lang.locales)
                    _supported.map(_l => this.langOptions.push({ text: _l}) )

                    if (val && _supported.includes(val)) {
                        this.$vuetify.lang.current = val
                    } else if (val && _supported.includes(val.slice(0, val.indexOf('-')))) {
                        this.$vuetify.lang.current = val.slice(0, val.indexOf('-'))
                    }
                    this.langOverride = this.$vuetify.lang.current
                    this.setRange1Text()
                    this.setRange2Text()
                    this.setRange3Text()
                }
            }
        }
    },
    computed: {
        Range1Dates() {
            return this.dateRange1.dates
        },
        Range2Dates() {
            return this.dateRange2.dates
        },
        Range3Dates() {
            return this.dateRange3.dates
        },
        localizedPickerLable() {
            return this.$vuetify.t('$vuetify.dateRangePicker.defaultLabel')
        }
    },
    methods: {
        applyLangSelection(val) {
            this.browserLocale = val
        },
        onDateRange1Input (dates) {
            this.dateRange1.isOpen = false
        },
        onDateRange1Update (dates) {
            this.dateRange1.dates = dates.sort()
        },
        onDateRange2Update (dates) {
            this.dateRange2.dates = dates.sort()
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
        setRange1Text (val) {
            this.dateRange1.text = this.dateRangeText(this.dateRange1.dates, this.browserLocale)
        },
        setRange2Text (val) {
            this.dateRange2.text = this.dateRangeText(this.dateRange2.dates, this.browserLocale)
        },
        setRange3Text (val) {
            this.dateRange3.text = this.dateRangeText(this.dateRange3.dates, this.browserLocale)
        },
        updateDateRange (dates, index) {
            if (index === 1) {
                this.dateRange1.dates = dates.sort()
            }
            if (index === 2) {
                this.dateRange2.dates = dates.sort()
            }
        }
    },
    created() {
        let _lang = navigator.language
        this.browserLocale = _lang
    }
};
</script>

<style>
    html {
    overflow-y: auto !important;
    }
</style>