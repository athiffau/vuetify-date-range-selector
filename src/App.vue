<template>
  <div id="app">
    <v-app id="inspire" :dark="dark">
      <div class="ma-5">
        <div class="headline">Testing Vuetify v.1.5.7 modified to support date ranges.</div>
        <div class="caption">Vuetify mods are from this repo: <a href="https://github.com/athiffau/vuetify-daterange">vuetify-daterange</a></div>
        <div class="title mb-3 mt-3">This codepen demonstrates the ability to select a date range using one or more date pickers.</div>
      </div>
      <v-divider></v-divider>
      <div>
        <v-container grid-list-md v-if="showExtended">
          <v-layout row wrap v-resize="onResize">
            <!-- <v-flex xs12>
              Window size
            </v-flex>
            <v-flex xs9>
              <v-subheader>Window Size</v-subheader>
              {{ windowSize }}
            </v-flex> -->
            <v-spacer></v-spacer>
            <v-flex xs4 sm2 lg1>
              <v-switch v-model="dark" label="dark"></v-switch>
            </v-flex>
            <v-flex xs5 sm4 lg3>
              <v-select
                v-model="langOverride"
                :items="langOptions"
                prepend-icon="language"
                single-line
                @change="applyLangSelection"
              ></v-select>
            </v-flex>
          </v-layout>

          <div class="title ma-3">Demo 1 : Date-range picker with default options</div>
          <div class="ml-3 mb-3">The date-range picker component assumes a behavior by default that aims to improve usability.</div>
          <v-layout row wrap :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
            <v-flex xs12 lg7 xl6>
              <v-date-range-picker v-model="demo1.dates"
                :locale="browserLocale"
                :auto-size=true
              ></v-date-range-picker>
            </v-flex>
            <v-flex xs12 lg5 xl6>
              <v-list two-line subheader dense>
                <v-subheader>General behavior & Objectives</v-subheader>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Multi-picker view</v-list-tile-title>
                    <v-list-tile-sub-title>Date-range with default options will create a component with two date pickers.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Custom styles</v-list-tile-title>
                    <v-list-tile-sub-title>You will notice that a custom style is applied for the range start, end and the dates within.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Range start/end controls</v-list-tile-title>
                    <v-list-tile-sub-title>The range start/end can be unselected which re-starts the range selection.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Range hover</v-list-tile-title>
                    <v-list-tile-sub-title>With only the range start selected, hovering now applies a custom style.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Hovering direction</v-list-tile-title>
                    <v-list-tile-sub-title>Range-start is aware of the hovering direction adjusting it's style accordingly.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Action tray</v-list-tile-title>
                    <v-list-tile-sub-title>The component includes an action tray with a 'Clear' and 'Apply' button.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Model</v-list-tile-title>
                    <v-list-tile-sub-title>By default, the date-range picker does not update its value (model) until the user clicks on 'Apply'</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Picker groups</v-list-tile-title>
                    <v-list-tile-sub-title>The date pickers seem `aware` of each other with hovering accross pickers and picker title adjusting depending on user selection.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>Master/Slave</v-list-tile-title>
                    <v-list-tile-sub-title>The master picker controls slave pickers where slave pickers can only select dates.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
            <v-flex xs12>
              <i>
                Notes: Eventhough the default picker count is 2, when the <code>autoSize</code> property is <strong>enabled</strong> the date-range picker will automatically reduce the number of pickers on smaller screens.
              </i>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 2 : Date-range inherits date-picker functionality</div>
          <div class="ml-3 mb-3">By extending the default date picker component, the date-range picker supports most of the existing features. In this example we enabled the <code>show-week</code>, <code>show-current</code>, and <code>header-color</code> properties</div>
          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
            <v-flex xs9>
              <v-date-range-picker v-model="dateRange3.dates"
                :allow-back-in-time=false
                :auto-hide="dateRange3.autoHide"
                :auto-size="dateRange3.autoSize"
                :header-color="dateRange3.color"
                :hide-disabled="dateRange3.hideDisabled"
                :live-update="dateRange3.liveUpdates"
                :locale="browserLocale"
                :multi-range=false
                :no-title=false
                :reactive=true
                :show-week=true
                :transitions=true
              >
              </v-date-range-picker>
            </v-flex>
            <v-flex xs12 lg4>
              <i>
                Notes: Try setting the <code>autoSize</code> property to <strong>true</strong> so the date-range picker will automatically adjust the number of pickers on smaller screens.
              </i>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 3 : In menu</div>
          <div class="ml-3 mb-3">When integrating a picker into a <code>v-text-field</code>, it is recommended to use the <strong>readonly</strong> prop. This will prevent mobile keyboards from triggering. To save vertical space, you can also hide the picker title. </div>
          <div class="ml-3 mb-3">As opposed to the date-picker demo this implementation does not use a scoped slot to hook into to identify if the data should be saved or discarded. Instead, the date-range-picker will update its model when its Apply button is clicked.</div>

          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
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
                </v-date-range-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <i>
                Notes: <code>autoSize</code> property is disabled so the date-range picker will not adjust the number of pickers on smaller screens.
              </i>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 4 : In menu with a maximum width</div>
          <div class="ml-3 mb-3"></div>

          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
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
                  :label="localizedPickerLabel"
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
                </v-date-range-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12>
              <i>
                Notes: <code>autoSize</code> property is <strong>enabled</strong> so the date-range picker will automatically adjust the number of pickers on smaller screens.
              </i>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 5 : In dialog</div>
          <div class="ml-3 mb-3">In addition to demonstrating the use of a date-range-picker within a dialog we also set the <code>num-pickers</code> prop to 4 and the <code>max-width</code> prop to 580 forcing the picker view in a 2 by 2 layout.</div>

          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
            <v-flex xs12 lg4>
              <v-dialog
                ref="dialog"
                v-model="dateRange4.isOpen"
                persistent
                lazy
                full-width
                :width="$vuetify.breakpoint.smAndDown ? null : dateRange4.maxWidth"
                :fullscreen="$vuetify.breakpoint.smAndDown"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    clearable
                    v-model="dateRange4.text"
                    :label="localizedPickerLabel"
                    :prepend-icon="dateRange4.icon"
                    readonly
                    @click:clear="onDateRange4ClickClear"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-card style="height: 100%; margin: 0 auto; text-align: center;">
                  <v-date-range-picker v-model="dateRange4.dates"
                    :auto-size="dateRange4.autoSize"
                    :locale="browserLocale"
                    :num-pickers="dateRange4.numPickers"
                    :max-width="dateRange4.maxWidth"
                    @input="onDateRange4Input"
                    @update="onDateRange4Update"
                    @update:pickerDate="onDateRange4PickerDate"
                    @info="msg => onDateSelectionEvent(msg, 'info', 4)"
                    @warning="msg => onDateSelectionEvent(msg, 'warning', 4)"
                    @error="msg => onDateSelectionEvent(msg, 'error', 4)"
                  ></v-date-range-picker>
                </v-card>
              </v-dialog>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 6 : Shortcuts Drawer - Quick range selections</div>
          <div class="ml-3 mb-3">Using the slot <code>drawerOptions</code> we can inject a drawer into the date-range-picker widget. The drawer is a seperate component that shares model and state with the date-range-picker. More information on the <strong>date-range-drawer</strong> component below.</div>

          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
            <v-flex xs6>
              <v-date-range-picker v-model="dateRange6.dates"
                :allow-back-in-time="dateRange6.pastDates"
                :auto-focus="dateRange6.autoFocus"
                :auto-hide="dateRange6.autoHide"
                :auto-size="dateRange6.autoSize"
                :header-color="dateRange6.color"
                :locale="browserLocale"
                :no-title="dateRange6.noTitle"
                :num-pickers="dateRange6.numPickers"
                :max-width="dateRange6.maxWidth"
                :mode="dateRange6.mode"
                :multi-range=false
                :picker-date="dateRange6.pickerDate"
                :is-drawer-open="dateRange6.isDrawerOpen"
                :reactive=true
                :show-week="dateRange6.showWeeks"
                :transitions=true
                @input="onDateRange6Input"
                @update="onDateRange6Update"
                @update:pickerDate="onDateRange6PickerDate"
                @update:pickerVisible="val => dateRange6.isDrawerOpen = val"
                @info="msg => onDateSelectionEvent(msg, 'info', 6)"
                @warning="msg => onDateSelectionEvent(msg, 'warning', 6)"
                @error="msg => onDateSelectionEvent(msg, 'error', 6)"
              >
                <template slot="drawerOptions">
                  <v-date-range-drawer
                    :allow-back-in-time="dateRange6.pastDates"
                    :date-range="dateRange6.dates"
                    :picker-date="dateRange6.pickerDate"
                    :picker-drawer-visible="dateRange6.isDrawerOpen"
                    :update-date-range="dates => updateDateRange(dates, 6)"
                    @update:pickerVisible="val => dateRange6.isDrawerOpen = val"
                    @info="msg => onDateSelectionEvent(msg, 'info', 6)"
                    @warning="msg => onDateSelectionEvent(msg, 'warning', 6)"
                    @error="msg => onDateSelectionEvent(msg, 'error', 6)"
                  ></v-date-range-drawer>
                </template>
              </v-date-range-picker>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 7 : Shortcuts Panel - Quick range selections</div>
          <div class="ml-3 mb-3">As an alternative to the drawer, a second slot named <code>panelOptions</code> can be used to inject UI in the date-range-picker's action tray.</div>
          <div class="ml-3 mb-3">As opposed to the Shortcuts Drawer, the Shortcuts Panel will be hidden on small displays.</div>
          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
            <v-flex xs12>
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
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <div class="title ma-3">Demo 8 : Past dates not allowed</div>
          <div class="ml-3 mb-3"></div>

          <v-layout row wrap mb-3 :class="{'ma-0': $vuetify.breakpoint.xsOnly, 'ml-3': $vuetify.breakpoint.smAndUp}">
            <v-flex xs12>
              <v-date-range-picker v-model="dateRange8.dates"
                :allow-back-in-time="dateRange8.pastDates"
                :auto-hide="dateRange8.autoHide"
                :auto-size="dateRange8.autoSize"
                :auto-focus="dateRange8.autoFocus"
                :header-color="dateRange8.color"
                :is-drawer-open="dateRange8.isDrawerOpen"
                :live-update="dateRange8.liveUpdates"
                :locale="browserLocale"
                :mode="dateRange8.mode"
                :multi-range=false
                :no-title=false
                :num-pickers="dateRange8.numPickers"
                :picker-date="dateRange8.pickerDate"
                :reactive=true
                :show-week=true
                :transitions=true
                @input="onDateRange8Input"
                @update="onDateRange8Update"
                @update:pickerDate="onDateRange8PickerDate"
                @update:pickerVisible="val => dateRange8.isDrawerOpen = val"
              >
                <template slot="panelOptions">
                  <v-date-range-panel
                    :allow-back-in-time="dateRange8.pastDates"
                    :dateRange="dateRange8.dates"
                    :updateDateRange="dates => updateDateRange(dates, 8)"
                    @info="msg => onDateSelectionEvent(msg, 'info', 8)"
                    @warning="msg => onDateSelectionEvent(msg, 'warning', 8)"
                    @error="msg => onDateSelectionEvent(msg, 'error', 8)"
                  ></v-date-range-panel>
                </template>
                <template slot="drawerOptions">
                  <v-date-range-drawer
                    :allow-back-in-time="dateRange8.pastDates"
                    :date-range="dateRange8.dates"
                    :picker-date="dateRange8.pickerDate"
                    :picker-drawer-visible="dateRange8.isDrawerOpen"
                    :update-date-range="dates => updateDateRange(dates, 8)"
                    @update:pickerVisible="val => dateRange8.isDrawerOpen = val"
                    @info="msg => onDateSelectionEvent(msg, 'info', 8)"
                    @warning="msg => onDateSelectionEvent(msg, 'warning', 8)"
                    @error="msg => onDateSelectionEvent(msg, 'error', 8)"
                  ></v-date-range-drawer>
                </template>
              </v-date-range-picker>
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
      </div>
    </v-app>
  </div>
</template>

<script>
// Import component (only because component is in user-land)
import VDateRangePicker from './components/DateRangePicker.vue'
// Optional DateHelper library
import DateHelper from './mixins/DateHelper.js'

/** DateRange Plugins */
// Add plugin module A
import VDateRangeDrawer from './components/DateRangeShortcutDrawer.vue'
// Add plugin module B
import VDateRangePanel from './components/DateRangeShortcutPanel.vue'

export default {
  components: {
    VDateRangePicker, VDateRangeDrawer, VDateRangePanel
  },
  mixins: [DateHelper],
  data: () => ({
    picker: new Date().toISOString().substring(0, 10),
    pickerMonth: new Date().toISOString().substring(0, 7),
    browserLocale: '',
    langOverride: 'en',
    onLine: navigator.onLine,
    langOptions: [],
    demo1: {
      dates: []
    },
    dateRange1: {
      autoHide: false,
      autoSize: true,
      dates: [],
      dark: false,
      color: ['primary', 'warning', 'info', 'error'],
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
      color: ['blue', 'dark grey'],
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
      color: ['primary', 'warning', 'info', 'error'],
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
    dateRange4: {
      autoHide: false,
      autoSize: true,
      autoFocus: true,
      dates: [],
      dark: false,
      color: ['blue', 'dark grey'],
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
    dateRange6: {
      autoHide: false,
      autoSize: true,
      autoFocus: true,
      dates: [],
      dark: false,
      color: ['blue', 'dark grey'],
      isOpen: false,
      icon: 'event',
      isDrawerOpen: false,
      label: '',
      numPickers: 2,
      maxWidth: 580,
      mode: 'fuzzy',
      multiRange: false,
      noTitle: false,
      pastDates: true,
      pickerDate: null,
      showWeeks: true,
      text: ''
    },
    dateRange8: {
      autoHide: false,
      autoSize: true,
      autoFocus: true,
      dates: [],
      dark: false,
      color: ['blue', 'dark grey'],
      isOpen: false,
      icon: 'event',
      isDrawerOpen: false,
      label: '',
      numPickers: 2,
      maxWidth: 580,
      mode: 'fuzzy',
      multiRange: false,
      noTitle: false,
      pastDates: false,
      pickerDate: null,
      showWeeks: true,
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
    showExtended: true,
    windowSize: {
      x: 0,
      y: 0
    }
  }),
  watch: {
    Range1Dates: {
      handler (val, prev) {
        if (val !== prev) {
          this.setRange1Text()
        }
      }
    },
    Range2Dates: {
      handler (val, prev) {
        if (val !== prev) {
          this.setRange2Text()
        }
      }
    },
    Range3Dates: {
      handler (val, prev) {
        if (val !== prev) {
          this.setRange3Text()
        }
      }
    },
    Range4Dates: {
      handler (val, prev) {
        if (val !== prev) {
          this.setRange4Text()
        }
      }
    },
    browserLocale: {
      handler (val, prev) {
        if (val !== prev) {
          let _supported = Object.keys(this.$vuetify.lang.locales)
          _supported.map(_l => this.langOptions.push({text: _l}))

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
    Range1Dates () {
      return this.dateRange1.dates
    },
    Range2Dates () {
      return this.dateRange2.dates
    },
    Range3Dates () {
      return this.dateRange3.dates
    },
    Range4Dates () {
      return this.dateRange4.dates
    },
    localizedPickerLabel () {
      return this.$vuetify.t('$vuetify.dateRangePicker.defaultLabel')
    }
  },
  methods: {
    applyLangSelection (val) {
      this.browserLocale = val
    },
    onDateRange1Input () {
      this.dateRange1.isOpen = false
    },
    onDateRange1Update (dates) {
      this.dateRange1.dates = dates
    },
    onDateRange2Update (dates) {
      this.dateRange2.dates = dates
    },
    onDateRange4Update (dates) {
      this.dateRange4.dates = dates
    },
    onDateRange6Update (dates) {
      this.dateRange6.dates = dates
    },
    onDateRange8Update (dates) {
      this.dateRange8.dates = dates
    },
    onDateRange1PickerDate (date) {
      this.dateRange1.pickerDate = date
    },
    onDateRange2PickerDate (date) {
      this.dateRange2.pickerDate = date
    },
    onDateRange4PickerDate (date) {
      this.dateRange4.pickerDate = date
    },
    onDateRange6PickerDate (date) {
      this.dateRange6.pickerDate = date
    },
    onDateRange8PickerDate (date) {
      this.dateRange8.pickerDate = date
    },
    onDateRange2Input (/*dates*/) {
      // console.log(dates)
      this.dateRange2.isOpen = false
    },
    onDateRange4Input (/*dates*/) {
      // console.log(dates)
      this.dateRange4.isOpen = false
    },
    onDateRange6Input (/*dates*/) {
      // console.log(dates)
      this.dateRange6.isOpen = false
    },
    onDateRange8Input (/*dates*/) {
      // console.log(dates)
      this.dateRange8.isOpen = false
    },
    onDateRange1ClickClear () {
      this.dateRange1.dates = []
    },
    onDateRange2ClickClear () {
      this.dateRange2.dates = []
    },
    onDateRange4ClickClear () {
      this.dateRange4.dates = []
    },
    onDateRange8ClickClear () {
      this.dateRange8.dates = []
    },
    onDateSelectionEvent (msg, mode/*, index*/) {
      // console.log(`Oops! - ${mode.toUpperCase()}: ${msg}`)
      if (['info', 'warning', 'error'].includes(mode)) {
        this.snackbar.color = mode
      } else {
        this.snackbar.color = 'error'
      }

      this.snackbar.text = msg
      this.snackbar.visible = true
    },
    eventsEx (date) {
      const [,, day] = date.split('-')
      if ([12, 27, 28].includes(parseInt(day, 10))) return true
      if ([1, 19, 22].includes(parseInt(day, 10))) return ['red', '#00f']
      return false
    },
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    setRange1Text (/*val*/) {
      this.dateRange1.text = this.dateRangeText(this.dateRange1.dates, this.browserLocale)
    },
    setRange2Text (/*val*/) {
      this.dateRange2.text = this.dateRangeText(this.dateRange2.dates, this.browserLocale)
    },
    setRange3Text (/*val*/) {
      this.dateRange3.text = this.dateRangeText(this.dateRange3.dates, this.browserLocale)
    },
    setRange4Text (/*val*/) {
      this.dateRange4.text = this.dateRangeText(this.dateRange4.dates, this.browserLocale)
    },
    updateDateRange (dates, index) {
      if (index === 1) {
        this.dateRange1.dates = dates
      } else if (index === 2) {
        this.dateRange2.dates = dates
      } else if (index === 4) {
        this.dateRange4.dates = dates
      } else if (index === 5) {
        this.dateRange5.dates = dates
      } else if (index === 6) {
        this.dateRange6.dates = dates
      } else if (index === 7) {
        this.dateRange7.dates = dates
      } else if (index === 8) {
        this.dateRange8.dates = dates
      }
    }
  },
  created () {
    let _lang = navigator.language
    this.browserLocale = _lang
  }
}
</script>

<style>
  html {
  overflow-y: auto !important;
  }

</style>
