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
                    <v-navigation-drawer
                        v-model="pickerOptionsShow"
                        absolute
                        temporary
                    >
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
                        <v-layout column>
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
                                                <v-layout row fill-height v-for="(item,index) in option.options" :key="index" class="mx-3"> 
                                                    <component 
                                                        :is="item.type" 
                                                        flat 
                                                        block 
                                                        @click="onAction(item.action)" 
                                                        :value="item.title" 
                                                        style="width: 100%;"
                                                        :hide-details=true
                                                        :hint="item.hint"
                                                        :label="item.label"
                                                        :small-chips=true
                                                        :items="buildSelectionList(item.items)"
                                                    >
                                                    {{ item.title }}
                                                    </component>
                                                </v-layout>
                                            </v-btn-toggle>
                                        </v-layout>
                                    </v-list-tile-content>

                                </v-list-group>
                            </v-list>
                            <v-spacer></v-spacer>
                            <!-- <v-list>
                                <v-divider></v-divider>
                                <v-layout row align-center justify-right>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="onClickClear" class="ml-2" color="red">Clear</v-btn>
                                </v-layout>
                            </v-list> -->
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
                            
                            <v-item-group value="false">
                                <v-layout align-center justify-start row fill-height class="overflow-hidden; pl-3">
                                    <v-item v-for="(option,index) in pickerOptions"
                                        :key="index"
                                    >
                                        <div v-if="option.visible" slot-scoped="{ active }">
                                            {{option.title}}
                                            <v-btn flat fab small @click="showHidePanel(option)" slot="activator" class="mr-2">
                                               
                                                <v-icon>{{option.show ? 'unfold_less' : 'unfold_more'}}</v-icon>
                                            
                                            </v-btn>

                                            <v-btn-toggle v-model="weekOption" v-if="option.show" class="mx-2">
                                                <component v-for="(item,index) in option.options"
                                                    :key="index"
                                                    :is="item.type"
                                                    @click="onAction(item.action)"
                                                    :flat=true
                                                    :dense=true
                                                    :value="item.title"
                                                    class="ma-0 mx-1 pa-0 px-1"
                                                    :hide-details=true
                                                    :hint="item.hint"
                                                    :label="item.label"
                                                    :small-chips=true
                                                    :items="buildSelectionList(item.items)"
                                                    :item-text="text"
                                                    :item-value="value"
                                                    style="max-width:220px;"
                                                >
                                                {{ item.title }}   
                                                </component> 
                                            </v-btn-toggle>
                                        </div>
                                        <div v-else slot-scoped="{action}"></div>
                                  
                                    </v-item>
                                </v-layout>
                            </v-item-group>
                        </template>                        
                        <v-spacer></v-spacer>
                        <v-divider vertical></v-divider>
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
    export default {
        name: 'v-date-range-picker',
        extends: VDatePicker,
        data: () => ({
            deltaOrigin: 0,
            dateRange: [],
            dateConfig: {
                hoverLink: null,
                currentDate: [],
                updateEvent: [],
                visiblePickers: 0
            },
            isOpen: false,
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
                            attributes: {
                                vert: 'flat',
                                horz: 'flat block'
                            },
                            icon: '',
                            action:'onClickYesterday'
                        },
                        {
                            title: 'Last Week',
                            type: 'v-btn',
                            attributes: {
                                vert: 'flat',
                                horz: 'flat block'
                            },
                            icon: '',
                            action: 'onClickLastWeek'
                        },
                        {
                            title: 'This Week',
                            type: 'v-btn',
                            attributes: {
                                vert: 'flat',
                                horz: 'flat block'
                            },
                            icon: '',
                            action: 'onClickThisWeek'
                        },
                        {
                            title: 'Last Month',
                            type: 'v-btn',
                            attributes: {
                                vert: 'flat',
                                horz: 'flat block'
                            },
                            icon: '',
                            action: 'onClickLastMonth'
                        },
                        {
                            title: 'This Month',
                            type: 'v-btn',
                            attributes: {
                                vert: 'flat',
                                horz: 'flat block'
                            },
                            icon: '',
                            action: 'onClickThisMonth'
                        },
                        {
                            title: 'Next 3 Months',
                            type: 'v-btn',
                            attributes: {
                                vert: 'flat',
                                horz: 'flat block'
                            },
                            icon: '',
                            action: 'onClickNext3Months'
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
                            attributes: {
                                vert: '',
                                horz: ''
                            },
                            items: 'weekNumbers',
                            icon: '',
                            action: 'onClickWeekSelect'
                        },
                        {
                            title: 'Months by name',
                            label: 'Month by name',
                            type: 'v-select',
                            attributes: {
                                vert: '',
                                horz: ''
                            },
                            items: 'monthNames',
                            icon: '',
                            action: 'onClickMonthSelect'
                        },
                        {
                            title: 'Years',
                            label: 'Year',
                            type: 'v-select',
                            attributes: {
                                vert: '',
                                horz: ''
                            },
                            items: 'yearList',
                            icon: '',
                            action: 'onClickYearSelect'
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
                            type: 'v-select',
                            attributes: {
                                vert: '',
                                horz: ''
                            },
                            items: 'yearList',
                            icon: '',
                            action: null,
                            ref: 'yearChoice'
                        },
                        {
                            title: 'Quarter',
                            type: 'v-combobox',
                            attributes: {
                                vert: '',
                                horz: ''
                            },
                            items: 'quarterList',
                            icon: '',
                            action: 'onClickQuarterSelect',
                            ref: 'quarterChoice',
                            needs: 'yearChoice'
                        },
                        {
                            title: 'Periods',
                            type: 'v-combobox',
                            attributes: {
                                vert: '',
                                horz: ''
                            },
                            items: 'periodList',
                            icon: '',
                            action: 'onClickPeriodSelect',
                            ref: 'periodChoice',
                            needs: 'yearChoice'
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
            clearSelection() {
                this.dateRange = []
                this.weekOption = null
            },
            hideOptionsDrawer() {
                this.pickerOptionsShow = false
            },
            onClickClear() {
                this.clearSelection()
                this.emitResults()
                this.isAnyPickerVisible()
            },
            onClickYesterday() {
                this.clearSelection()
                let _d = new Date()
                _d.setDate(_d.getDate()-1)
                this.dateRange.push(this.dateToISOStr(_d))
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickLastWeek() {
                this.clearSelection()
                let _d = new Date()
                this.dateRange.push(this.dateToISOStr(this.dateStartPrevWeek( _d)) )
                this.dateRange.push(this.dateToISOStr(this.dateEndPrevWeek(_d)) )
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickThisWeek() {
                this.clearSelection()
                let _start = this.dateToISOStr( this.dateStartOfWeek())
                this.dateRange.push( _start )
                let _end = this.dateToISOStr( this.dateEndOfWeek())
                this.dateRange.push( _end )
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickNextMonth() {
                this.clearSelection()
                let _start = this.dateToISOStr( this.dateStartOfMonth().add(1, 'months') )
                let _end = this.dateToISOStr( this.dateEndOfMonth( _start ) )
                this.dateRange.push( _start )
                this.dateRange.push( _end )
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickLastMonth() {
                this.clearSelection()
                let _start = this.dateToISOStr( this.dateStartOfMonth().subtract(1, 'months'))
                let _end = this.dateToISOStr( this.dateEndOfMonth( _start) )
                this.dateRange.push( _start )
                this.dateRange.push( _end )
                this.emitResults()
                this.hideOptionsDrawer()
            },
            onClickThisMonth() {
                this.clearSelection()
                this.dateRange.push( this.dateToISOStr(this.dateStartOfMonth() ))
                this.dateRange.push( this.dateToISOStr(this.dateEndOfMonth() ))
                this.emitResults()  
                this.hideOptionsDrawer()
            },
            onClickNext3Months() {
                this.clearSelection()
                let _d = this.dateStartOfMonth().add(1, 'months')
                this.dateRange.push( this.dateToISOStr( _d ))
                _d.add(2, 'months')
                this.dateRange.push( this.dateToISOStr(this.dateEndOfMonth(_d)) )
            },
            /** Builder functions */
            weekNumbers() {
                let result = []
                let data = this.momentWeekNumbers()
                for(let x=1;x<data.length;x++) {
                    result.push({ text: `Week #${x} [${data[x].start.format('MMM Do')} - ${data[x].end.format('MMM Do')}]`, value: x})
                }
                return result
            },
            /** Date Functions -> move to mixin */
            momentWeekNumbers(date) {
                let d = date ? date.year() : moment().year()
                let data = []
                let weeks = moment().weeksInYear([d])
                data[0] = {year: d}
                for (let x=1; x<=weeks; x++) {
                    let wStart = moment([d]).week(x).startOf('week')
                    let wEnd = moment([d]).week(x).endOf('week')
                    data[x] = {start: wStart, end: wEnd}
                }
                return data
            },
            momentStartOf(opt, date) {
                return moment(date).startOf(opt)
            },
            momentEndOf(opt, date) {
                return moment(date).endOf(opt)
            },
            dateStartPrevWeek(date) {
                let _d = this.dateStartOfWeek(this.dateToISOStr(date))
                _d.subtract(7, 'days')
                return _d
            },
            dateEndPrevWeek(date) {
                let _d = this.dateEndOfWeek(this.dateToISOStr(date))
                _d.subtract(7, 'days')
                return _d
            },
            dateStartOfWeek(date) {
                let _t = this.momentStartOf('week', date)
                return _t
            },
            dateEndOfWeek(date) {
                let _t = this.momentEndOf('week', date).subtract(1, 'days')
                return _t
            },
            dateStartOfMonth(date) {
                let _t = this.momentStartOf('month', date)
                return _t
            },
            dateEndOfMonth(date) {
                let _t = this.momentEndOf('month', date).subtract(1,'days')
                return _t
            },
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
            emitResults() {
                this.$emit('input', this.dateRange)
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

                //set the min for the last picker
                // if (index !== this.numPickers) {
                //     _nd = this.dateEndOfMonth(this.dateFromStr(this.dateConfig[`pickerView${this.numPickers}`]))
                //     this.dateConfig[`pickerMin${this.numPickers}`] = this.dateToISOStr(_nd,7)
                // }
                // this.$nextTick( () => {
                //     console.log('visible count: ',this.isAnyPickerVisible())

                //     let _count = 0
                //     for (let x=1; x<=this.numPickers; x++) {
                //         if (this.isPickerVisible(x)) _count++
                //     }
                //     console.log('my count is: ',_count)

                //     for (let x=index; x<=this.numPickers; x++) {
                //         _nd = this.dateFromStr(this.dateConfig[`pickerView${x}`],0,1).toISOString()
                //         if (_count <= 1) {
                //             console.log(`Removing limit for index ${x}`)
                //             this.dateConfig[`pickerMin${x}`] = undefined
                //         } else {
                //             if (x > 1 || this.autoHide) {
                //                 if ((x === 1 && this.allowBackInTime) || x > 1) {
                //                     console.log(`numPickersVision is ${this.numPickersVisible} so limit is enabled`)
                //                     this.dateConfig[`pickerMin${x}`] = _nd.substr(0,10)
                //                 } else {
                //                     this.dateConfig[`pickerMin${x}`] = undefined
                //                 }
                //             } else {
                //                 this.dateConfig[`pickerMin${x}`] = undefined
                //             }
                //         }
                //     }
                // })

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
            onAction(fnName) {
                let fn = this[fnName]
                if (fn) fn();
            },
            buildSelectionList(fnName) {
                let fn = this[fnName]
                if ( fn ) return fn()
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
            isOpen: {
                handler(val) {
                    this.isAnyPickerVisible()
                }
            }
        },
        created() {
            for (let i=1; i<=this.numPickers; i++) {
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

                //setup the picker view date for this index
                _d.setMonth(_d.getMonth()+i-1)                   
                this.$set(this.dateConfig, `pickerView${i}`, this.dateToISOStr( _d, 7 ) )
                
                if (i === this.numPickers) {
                    this.$set(this.dateConfig, `pickerMin${i}`, this.dateToISOStr( _d, 7 ))
                }
                // if (i > 1 || this.autoHide) {
                //     if ((i === 1 && this.allowBackInTime) || i > 1) {
                //         if (i > 1) _d.setDate(0)
                //         this.$set(this.dateConfig, `pickerMin${i}`, this.dateToISOStr( _d ))
                //     }
                // } else {
                //     this.$set(this.dateConfig, `pickerMin${i}`, undefined)
                // }

                // this.$set(this.dateConfig, `pickerMax${i}`, undefined)
            }
        },
        mounted() {
            this.dateConfig.visiblePickers = this.numPickers
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