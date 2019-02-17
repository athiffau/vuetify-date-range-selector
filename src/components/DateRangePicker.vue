<template>

        <v-layout row wrap>
            <v-flex xs10 sm6 md4>
                <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="isOpen"
                :nudge-right="$vuetify.breakpoint.xsOnly ? 15 : $vuetify.breakpoint.mdAndUp ? 40 : 20"
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
                        :max-width="maxWidth"
                    >
                        <v-navigation-drawer
                            v-model="pickerOptionsShow"
                            absolute
                            temporary
                        >
                            <v-layout column fill-height>
                            <v-toolbar
                            color="primary"
                            dark
                            flat
                            >
                                <v-list class="pa-1">
                                    <v-list-tile avatar>
                                        <v-list-tile-avatar>
                                            <v-icon>event</v-icon>
                                        </v-list-tile-avatar>

                                        <v-list-tile-content>
                                            <v-list-tile-title>Picker Options</v-list-tile-title>
                                        </v-list-tile-content>

                                        <v-list-tile-action>
                                            <v-btn flat fab small @click="pickerOptionsShow = !pickerOptionsShow">
                                                <v-icon >chevron_left</v-icon>
                                            </v-btn> 
                                        </v-list-tile-action>
                                    </v-list-tile>
                                </v-list>
                            </v-toolbar>
                                <v-flex xs12 sm6 md4>
                                    <v-list class="pa-1" >
                                        <v-list-group
                                            v-for="(option,index) in pickerOptions" 
                                            :key="index"
                                            v-model="option.active"
                                            :prepend-icon="option.icon"
                                            no-action
                                        >
                                            <v-list-tile slot="activator">
                                                <v-list-tile-title>{{ option.title }}</v-list-tile-title>
                                            </v-list-tile>

                                            <v-list-tile-content>
                                                <v-layout align-center justify-start column fill-height>
                                                    <v-btn-toggle style="flex-direction: column; width: 100%;" v-model="weekOption">
                                                        <v-layout row fill-height v-for="(compo,index) in option.options" :key="index" class="mx-3 py-1"> 
                                                            <component 
                                                                block
                                                                :clearable="multiRange || compo.multiple"
                                                                :deletable-chips=true
                                                                :dense=true
                                                                flat 
                                                                :hide-details=true
                                                                :hint="compo.hint" 
                                                                :is="compo.type"
                                                                :items="buildSelectionList(compo.items)"
                                                                :item-text="getItemText"
                                                                :item-value="getItemValue"
                                                                :label="compo.label"
                                                                :loading="compo.loading"
                                                                :multiple=true
                                                                :no-data-text="compo.label"
                                                                :prepend-icon="compo.icon"
                                                                style="width: 100%;"
                                                                :single-line=true
                                                                :small-chips=true
                                                                
                                                                @change="onAction(
                                                                            $event, 
                                                                            compo.action, 
                                                                            typeof compo.value === 'boolean' ? !compo.value : compo.value, 
                                                                            getSiblingData(option, compo.needs) || null)"
                                                                :value="compo.isOpen"
                                                                v-bind:compo="compo"
                                                                v-model="compo.value"
                                                            >
                                                                <template
                                                                slot="selection"
                                                                slot-scope="{item, index}"
                                                                >
                                                                    <template v-if="item.text.length > 5">
                                                                        <template v-if="compo.value.length === 1">
                                                                            <v-chip v-if="index === 0" :small=true>
                                                                                <span>{{ item.text }}</span>
                                                                            </v-chip>
                                                                        </template>
                                                                        <template v-else>
                                                                            <span v-if="index === 0"
                                                                                class="grey--text"
                                                                            >
                                                                                {{compo.value.length}} selected
                                                                            </span>
                                                                        </template>
                                                                    </template>
                                                                    <template v-else>                                                        
                                                                        <template v-if="compo.value.length <= 3">
                                                                            <v-chip :small=true>
                                                                                <span>{{ item.text }}</span>
                                                                            </v-chip>
                                                                        </template>
                                                                        <template v-else>    
                                                                            <v-chip v-if="index <= 1" :small=true>
                                                                                <span>{{ item.text }}</span>
                                                                            </v-chip>
                                                                            <span v-if="index === 2"
                                                                                class="grey--text caption"
                                                                            >(+{{ compo.value.length - 2}} others)</span>
                                                                        </template>
                                                                    </template>
                                                                </template>
                                                                <template slot="default">
                                                                    {{ compo.title }}
                                                                </template> 
                                                            </component>
                                                        </v-layout>
                                                    </v-btn-toggle>
                                                </v-layout>
                                            </v-list-tile-content>

                                        </v-list-group>
                                    </v-list>
                                </v-flex>
                            </v-layout>
                        </v-navigation-drawer>
                        <v-layout row wrap>
                        <template v-for="index in dateConfig.visiblePickers">  
                            <v-date-picker v-model="dateRange" v-if="isPickerVisible(index)"
                                :allow-date-change="index === 1"
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
                            <div class="text-xs-center mx-2">
                                <v-btn flat fab small @click="pickerOptionsShow = !pickerOptionsShow">
                                    <v-icon >more_vert</v-icon>
                                </v-btn>
                            </div>
                            <v-divider vertical></v-divider>
                            <template v-if="weeksOptions && (numPickersVisible > 1 || !this.autoHide)">                           
                                <v-item-group value="false" class="hidden-lg-and-down" v-if="this.maxWidth === null">
                                    <v-layout align-center justify-start row fill-height class="overflow-hidden; pl-3 pt-1">
                                        <v-item v-for="(option,index) in pickerOptions"
                                            :key="index"
                                        >
                                            <div v-if="option.visible" slot-scoped="{ active }">
                                                {{option.title}}
                                                <v-btn flat fab small @click="showHidePanel(option)" slot="activator" class="mr-2">
                                                
                                                    <v-icon>{{option.show ? 'unfold_less' : 'unfold_more'}}</v-icon>
                                                
                                                </v-btn>

                                                <v-btn-toggle v-model="weekOption" v-if="option.show" class="mx-2">
                                                    <component v-for="(compo,index) in option.options"
                                                        class="ma-0 mx-1 pa-0 px-1"
                                                        :clearable="multiRange || compo.multiple"
                                                        :deletable-chips=true
                                                        :dense=true
                                                        :flat=true
                                                        :hide-details=true                                                    
                                                        :is="compo.type"
                                                        :items="buildSelectionList(compo.items)"
                                                        :item-text="getItemText"
                                                        :item-value="getItemValue"
                                                        :key="index"
                                                        :label="compo.label"
                                                        :loading="compo.loading"
                                                        :multiple="compo.multiple"
                                                        :no-data-text="compo.label"
                                                        :prepend-icon="compo.icon"
                                                        :ref="compo.ref"
                                                        :single-line=true
                                                        :small-chips=true
                                                        style="max-width:220px;"
                                                        @change="onAction(
                                                            $event, 
                                                            compo.action, 
                                                            typeof compo.value === 'boolean' ? !compo.value : compo.value, 
                                                            getSiblingData(option, compo.needs) || null)"
                                                        :value="compo.isOpen"
                                                        v-bind:compo="compo"
                                                        v-model="compo.value"
                                                    >
                                                        <template
                                                        slot="selection"
                                                        slot-scope="{item, index}"
                                                        v-bind:compo="compo"
                                                        >
                                                            <template v-if="item.text.length > 5">
                                                                <template v-if="compo.value.length === 1">
                                                                    <v-chip v-if="index === 0" :small=true>
                                                                        <span>{{ item.text }}</span>
                                                                    </v-chip>
                                                                </template>
                                                                <template v-else>
                                                                    <span v-if="index === 0"
                                                                        class="grey--text"
                                                                    >
                                                                        {{compo.value.length}} selected
                                                                    </span>
                                                                </template>
                                                            </template>
                                                            <template v-else>                                                        
                                                                <!-- <template v-if="compo.value.length <= 2">
                                                                    <v-chip :small=true>
                                                                        <span>{{ item.text }}</span>
                                                                    </v-chip>
                                                                </template>
                                                                <template v-else>     -->
                                                                    <v-chip v-if="index === 0" :small=true>
                                                                        <span>{{ item.text }}</span>
                                                                    </v-chip>
                                                                    <span v-if="index === 1"
                                                                        class="grey--text caption"
                                                                    >(+{{ compo.value.length - 1}} others)</span>
                                                                <!-- </template> -->
                                                            </template>
                                                        </template>
                                                        <template slot="default">
                                                            {{ compo.title }}
                                                        </template>   
                                                    </component> 
                                                </v-btn-toggle>
                                            </div>
                                            <div v-else slot-scoped="{action}"></div>
                                    
                                        </v-item>
                                    </v-layout>
                                </v-item-group>
                            </template>                        
                            <v-spacer></v-spacer>
                            <v-divider vertical class="hidden-lg-and-down"></v-divider>
                            <v-btn @click="onClickClear" class="ml-2" color="red">Clear</v-btn>
                            <v-btn @click="isOpen = false" class="mx-2" color="green">Apply</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-flex>
        </v-layout>

</template>

<script>
    import VDatePicker from 'vuetify/es5/components/VDatePicker/VDatePicker'   
    import moment from 'moment'
    var myMoment = moment
    export default {
        name: 'v-date-range-picker',
        extends: VDatePicker,
        data: () => ({
            currentAction: null,
            deltaOrigin: 0,
            dateRange: [],
            dateConfig: {
                hoverLink: null,
                currentDate: [],
                updateEvent: [],
                visiblePickers: 0
            },
            isOpen: false,
            isLoaded: false,
            numPickersVisible: 0,
            pickerOptionsShow: false,
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
                            action:'onClickYesterday',
                            value: false
                        },
                        {
                            title: 'Last Week',
                            type: 'v-btn',
                            icon: '',
                            action: 'onClickLastWeek',
                            value: false
                        },
                        {
                            title: 'This Week',
                            type: 'v-btn',
                            icon: '',
                            action: 'onClickThisWeek',
                            value: false
                        },
                        {
                            title: 'Last Month',
                            type: 'v-btn',
                            icon: '',
                            action: 'onClickLastMonth',
                            value: false
                        },
                        {
                            title: 'This Month',
                            type: 'v-btn',
                            icon: '',
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
            visibility: {},
            weeksOptions: true,
            weekOption: null
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
            autoFocusOnDateChange: {
                type: Boolean,
                default: true
            },
            color: {
                type: Array,
                default: null
            },
            rangeColors: {
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
            maxWidth: {
                type: Number,
                default: null
            },
            numPickers: {
                type: Number,
                default: 2
            },
            multiRange: {
                type: Boolean,
                default: false
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
            dateRangeText: {
                get() {
                    this.dateRange.sort()

                    if (this.dateRange.length === 2) {
                        return this.dateRangeToStr(this.dateRange[0], this.dateRange[1])
                    } else if (this.dateRange.length === 1) {
                        return this.dateRangeToStr(this.dateRange[0], '')
                    } else {
                        return ''
                    }
                }
            }
        },
        methods: {
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
            clearCurrentAction() {
                this.currentAction = null
            },
            clearSelection () {
                this.dateRange = []
                this.weekOption = null
                if (this.currentAction) {
                    let _ca = this.currentAction
                    this.pickerOptions.forEach( (item, index) => {
                        item.options.forEach( (val, index) => {
                            if (!_ca.includes(val.ref) && !_ca.includes(val.action) && val.value !== undefined) {
                                val.value = []
                            }
                        }) 
                    })
                }
            },
            hideOptionsDrawer () {
                this.pickerOptionsShow = false
            },
            onClickClear () {
                this.clearSelection()
                this.emitResults()
                this.isAnyPickerVisible()
            },
            updateDateRange (dates) {
                if (!Array.isArray(dates)) return
                this.clearSelection()   //should it be onClickClear() ?
                this.dateRange.push(dates[0])
                this.dateRange.push(dates[dates.length - 1])
                this.emitResults()
                this.isAnyPickerVisible()
            },
            /** Toggle button handlers */
            onClickYesterday (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    let _d = new Date()
                    _d.setDate(_d.getDate()-1)
                    this.dateRange.push(this.dateToISOStr(_d))
                }
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickLastWeek (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    let _d = new Date()
                    this.dateRange.push(this.dateToISOStr(this.dateStartPrevWeek( _d)) )
                    this.dateRange.push(this.dateToISOStr(this.dateEndPrevWeek(_d)) )
                }
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickThisWeek (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    let _d = new Date()
                    let _start = this.dateToISOStr( this.dateStartOfWeek( _d ) )
                    this.dateRange.push( _start )
                    let _end = this.dateToISOStr( this.dateEndOfWeek( _d ) )
                    this.dateRange.push( _end )
                }
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickNextMonth (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    let _start = this.dateToISOStr( this.dateStartOfMonth().add(1, 'months') )
                    let _end = this.dateToISOStr( this.dateEndOfMonth( _start ) )
                    this.dateRange.push( _start )
                    this.dateRange.push( _end )
                }
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickLastMonth (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    let _start = this.dateToISOStr( this.dateStartOfMonth().subtract(1, 'months'))
                    let _end = this.dateToISOStr( this.dateEndOfMonth( _start) )
                    this.dateRange.push( _start )
                    this.dateRange.push( _end )
                }
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickThisMonth (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    this.dateRange.push( this.dateToISOStr(this.dateStartOfMonth() ))
                    this.dateRange.push( this.dateToISOStr(this.dateEndOfMonth() ))
                }
                this.emitResults()  
                this.hideOptionsDrawer()
            },
            onClickNext3Months (dateInView, event, value, params) {
                /* don't use validateDate() which removes day from date */
                this.clearSelection()
                if (value === true) {
                    let _d = this.dateStartOfMonth().add(1, 'months')
                    this.dateRange.push( this.dateToISOStr( _d ))
                    _d.add(2, 'months')
                    this.dateRange.push( this.dateToISOStr(this.dateEndOfMonth(_d)) )
                }
                this.emitResults()
                this.hideOptionsDrawer()
            },
            /** Select handlers */
            //The following functions are not based on today's date
            onClickCalWeekSelect ( dateInView, event, value, params ) {
                let _dates = []
                event.map( (val, index) => { 
                    _dates.push(...this.momentGetWeekDates( null, val )) 
                })
                this.updateDateRange(_dates)
            },
            onClickCalMonthSelect ( dateInView, event, value, params ) {
                let _dates = []
                event.map( (val, index) => {
                    _dates.push(...this.momentGetMonthDates( null, val ))
                })
                this.updateDateRange(_dates)
            },
            onClickCalYearSelect ( dateInView, event, value, params ) {            
                let _dates = []
                event.map( (val, index) => {
                    let _dStart = this.dateToISOStr(moment({year: val, month: 0, date: 1}))
                    let _dEnd = this.dateToISOStr(moment({year: val, month: 11, date: 31}))
                    _dates.push(_dStart)
                    _dates.push(_dEnd)
                })
                this.updateDateRange(_dates.sort())
            },
            //** Combo handlers */
            onClickFinanceYearSelected ( dateInView, event, value, params ) {
                if (this.isLoaded) {
                    this.clearSelection()
                }
            },
            onClickFinanceQuarterSelected ( dateInView, event, value, params ) {
                let _dates = []
                let _d = this.validateDate(dateInView)
                params.map( (year, index) => {
                    let _yr = this.validateDate(year)
                    event.map( (val, index) => {
                        _dates.push(...this.momentGetQuarterDates( year, val ))
                    })
                })
                this.updateDateRange( _dates.sort() )
            },
            onClickFinancePeriodSelected ( dateInView, event, value, params ) {
                let _dates = []
                let _d = this.validateDate(dateInView)
                params.map( (year, index) => {
                    let _yr = this.validateDate(year)
                    event.map( (val, index) => {
                        _dates.push(...this.momentGetPeriodDates( year, val ))
                    })
                })
                this.updateDateRange( _dates.sort() )
            },
            /** Helpers */
            getItemText (item) {
                return item.text
            },
            getItemValue (item) {
                return item.value
            },
            /** Builder functions */
            weekNumbers (date) {
                let result = []
                let data = this.momentWeekNumbers(date)
                for(let x=1;x<data.length;x++) {
                    result.push({ text: `Week #${x} [${data[x].start.format('MMM Do')} - ${data[x].end.format('MMM Do')}]`, value: x})
                }
                return result
            },
            monthNames () {
                return this.momentMonthShortNames().map( (val, index) => { return {text: val, value: index}} )
            },
            yearNumbers (date) {
                return this.momentYearNumbers(date).map( (val, index) => { return {text: val, value: val}} )
            },
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
            /**  Utils */
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
            /** Date Functions -> move to mixin */
            momentYearNumbers (date) {
                let result = []
                const currentYear = date ? date : this.dateConfig.pickerView1
                let _date = this.validateDate(currentYear)
                const maxYear = this.max ? parseInt(this.max, 10) : _date ? _date.getFullYear() + 10 : moment().year() + 10
                const minYear = this.min ? parseInt(this.min, 10) : _date ? _date.getFullYear() - 10 : moment().year() - 10
                for (let year = maxYear; year >= minYear; year--) {
                    result.push(year)
                }
                return result.sort()
            },
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
            momentPeriodNumbers (year) {
                let _year = parseInt(year) || moment().year()
                let _data = []
                _data[0] = {year: _year}
                let _weeks = this.momentWeekNumbers( year )
                let _pn = 0
                for (let _x=1; _x<=52; _x += 4) {
                    _pn++
                    let _wStart = _pn === 1 ? _weeks[_x].start : this.dateToISOStr( moment(_weeks[_x].start).add(1,'days') )
                    let _wEnd = this.dateToISOStr( moment(_weeks[_x+3].end).add(1,'days') )
                    _data[_pn] = {start: _wStart, end: _wEnd}
                }

                return _data
            },
            momentMonthShortNames () {
                return Array.apply(0, Array(12)).map(function(_,i){return moment().month(i).format('MMM')})
            },
            momentMonthLongNames () {
                return Array.apply(0, Array(12)).map(function(_,i){return moment().month(i).format('MMMM')})
            },
            momentStartOf (opt, date) {
                let _d = this.validateDate(date)  //returns null of validate date
                let _date = _d ? _d : moment()
                return moment(_date).startOf(opt)
            },
            momentEndOf (opt, date) {
                let _d = this.validateDate(date)  //returns null or validate date
                let _date = _d ? _d : moment()               
                return moment(_date).endOf(opt)
            },
            dateStartPrevWeek (date) {
                let _d = this.validateDate(date)
                let _date = _d ? _d : moment()
                let _dw = this.dateStartOfWeek(this.dateToISOStr(_date))
                _dw.subtract(7, 'days')
                return _dw
            },
            dateEndPrevWeek (date) {
                let _d = this.dateEndOfWeek(this.dateToISOStr(date))
                _d.subtract(7, 'days')
                return _d
            },
            dateStartOfWeek (date) {
                let _t = this.momentStartOf('week', date)
                return _t
            },
            dateEndOfWeek (date) {
                let _t = this.momentEndOf('week', date).subtract(1, 'days')
                return _t
            },
            dateStartOfMonth (date) {
                let _t = this.momentStartOf('month', date)
                return _t
            },
            dateEndOfMonth (date) {
                let _d = this.validateDate(date)
                let _t = this.momentEndOf('month', _d.toISOString()).subtract(1,'days')
                return _t
            },
            momentGetWeekDates (date, weekNumber) {
                let _wn = parseInt(weekNumber) || 1
                let _data = this.momentWeekNumbers(date)

                return  [ this.dateToISOStr(_data[_wn].start), this.dateToISOStr(_data[_wn].end) ]             
            },
            momentGetMonthDates (date, monthNumber) {
                let _mn = parseInt(monthNumber) || 0
                let _data = this.momentMonthNumbers(date)

                return [ this.dateToISOStr(_data[_mn].start), this.dateToISOStr(_data[_mn].end) ]
            },
            momentGetYearDates (date, yearNumber) {
                let _yn = parseInt(yearNumber) || moment().year()
                return [ this.momentStartOf('year', _yn), this.momentEndOf('year',_yn)]
            },
            momentGetQuarterDates (date, quarterNumber) {
                let _qn = parseInt(quarterNumber) || 1
                let _data = this.momentQuarterNumbers(date)

                return [ this.dateToISOStr(_data[_qn].start), this.dateToISOStr(_data[_qn].end) ]
            },
            momentGetPeriodDates (date, periodNumber) {
                let _pn = parseInt(periodNumber) || 1
                let _data = this.momentPeriodNumbers(date)

                return [ this.dateToISOStr(_data[_pn].start), this.dateToISOStr(_data[_pn].end) ]
            },
            // END OF MOMENT
            dateFromStr (strDate, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
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
            dateToStr (date, format) {
                if (format && moment) {
                    if (date !== undefined && typeof date.toISOString === 'function') {
                        return moment(this.dateToISOStr(date)).format(format)
                    } else if (date !== undefined && typeof date === 'string') {
                        return moment(date).format(format)
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
            },
            dateToMonthYear (date) {
                if (date && typeof date.toISOString === 'function') {
                    return this.formatters.titleMonthYear(date.toISOString().substr(0,10))      
                } else if (date && typeof date === 'string') {
                    return this.formatters.titleMonthYear(date)
                }
                return null          
            },
            dateRangeToStr (chkIn,chkOut) {
                let _chkIn = this.validateDate(chkIn)
                let _chkOut = this.validateDate(chkOut)
                let _currentYear = this.validateDate(this.dateConfig.pickerView1)
                let _format = null
                if ( (_chkIn.getFullYear() !== _chkOut.getFullYear()) || 
                      _chkIn.getFullYear() !== _currentYear.getFullYear() || 
                      _chkOut.getFullYear() !== _currentYear.getFullYear()) {
                    _format = 'MMM-DD-YYYY'
                } else {
                    _format = 'MMM-D'
                }
                const _cin = this.dateToStr(chkIn, _format)
                const _cout = chkOut ? this.dateToStr(chkOut, _format) : chkOut

                return `${_cout 
                            ? _cin 
                                ? _cin + ' - ' + _cout
                                : ' - ' + _cout
                            : _cin 
                                ? _cin + ' - '
                                : ''       
                        }`

            },
            emitResults () {
                this.$emit('input', this.dateRange)
            },
            monthYearToStr (chkIn,chkOut) {
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
                let _d = null
                if (typeof date1 === 'string') {
                    _d = this.dateFromStr(date1)
                } else {
                    _d = date1
                }

                if (!_d || typeof _d.getMonth !== 'function') return false

                return _d.getMonth()
            },
            monthCount(date) {
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
            isAnyPickerVisible() {
                let _count = -1
                if (this.dateRange.length !== 2) {
                    _count = this.numPickers
                }
                if (this.getMonth(this.dateRange[0]) !== this.getMonth(this.dateRange[1])) {
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
                this.numPickersVisible = _count
                return _count
            },
            isPickerVisible(index) {
                return this.autoHide && this.dateRange.length === 2
                        ? this.getMonth(this.dateRange[0]) !== this.getMonth(this.dateRange[1])
                            ? true
                            : this.isAnyPickerVisible() !== -1 
                                ? this.getMonth(this.dateRange[0]) === this.getMonth(this.dateConfig[`pickerView${index}`])
                                : true
                        : true
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
                this.$emit('update:pickerDate', {date: dates, key: index})
            },
            onDateClicked(date, index) {
                this.dateConfig.currentDate[index] = date
                this.isAnyPickerVisible()
            },
            onPickerUpdate(date, index) {
                let _toDate = this.dateFromStr(date)    
                let _fromDate = this.dateFromStr(this.dateConfig[`pickerView${index}`])
                let _diff = _toDate.getTime() - _fromDate.getTime()
                let _delta = 0
                if (_diff != 0) {
                    _delta = _diff > 0 ? 1 : -1
                    this.deltaOrigin = this.deltaOrigin + _delta
                }
                
                this.dateConfig[`pickerView${index}`] = this.dateToISOStr(date,7)
               
                let _nd = null
                for (let x=index+1; x<=this.numPickers; x++) {
                    _nd = this.dateFromStr(this.dateConfig[`pickerView${x}`],0,_delta).toISOString()
                    this.dateConfig[`pickerView${x}`] = _nd.substr(0,7)
                }

            },
            showHidePanel(panel) {
                panel.show = !panel.show
                this.panel = panel

                this.pickerOptions.forEach( (option) => {
                    if (option.title !== panel.title) {
                        option.visible = panel.show ? false : true
                    }
                })
            },
            onAction( ...attributes ) { 
                
                let _strDate = this.dateConfig.pickerView1
                let _d = this.validateDate(_strDate)
                let _fn = null

                var [event, fnName, value, parameters] = attributes
                _fn = this[fnName]
                if (_fn) {
                    this.setCurrentAction(fnName)
                    _fn(_d, event, value, parameters)
                    this.currentAction = null
                }
           
            },
            buildSelectionList(fnName) {
                let _fn = this[fnName]
                if ( _fn ) return _fn()
            }
        },
        watch: {
            dateRange: {
                handler(val, prev) {
                    if (!this.multiRange && this.dateRange.length > 2) {
                        this.dateRange.splice(1,1)
                    }
                },
                deep: true 
            },
            isOpen: {
                handler(val) {
                    this.isAnyPickerVisible()
                }
            }
        },
        mounted() {
            this.dateConfig.visiblePickers = this.$vuetify.breakpoint.xsOnly ? 1 : this.numPickers
    
            for (let i=1; i<=this.dateConfig.visiblePickers; i++) {
                let _d = null
                //user supplied a start date
                if (this.startDate) {
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

                //setup a min if we are not allowed to go back in time
                if (!this.allowBackInTime) {
                    this.$set(this.dateConfig, `pickerMin${i}`, this.dateToISOStr( _d, 7))
                }
                //setup the picker view date for this index
                _d.setMonth(_d.getMonth()+i-1)                   
                this.$set(this.dateConfig, `pickerView${i}`, this.dateToISOStr( _d, 7 ) )
                
                this.isLoaded = true
            }
        }
    };
</script>

<style>
html {
  overflow-y: auto;
}  
</style>

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