import VDateRangePicker from './components/DateRangePicker.vue'
import VDateRangeShortcutDrawer from './components/DateRangeShortcutDrawer.vue'
import VDateRangeShortcutPanel from './components/DateRangeShortcutPanel.vue'

export default {
    VDateRangePicker: {
        install(Vue) {
            Vue.component(VDateRangePicker.name, VDateRangePicker)
        },
    },
    VDateRangeShortcutDrawer: {
        install(Vue) {
            Vue.component(VDateRangeShortcutDrawer.name, VDateRangeShortcutDrawer)
        },
    },
    VDateRangeShortcutPanel: {
        install(Vue) {
            Vue.component(VDateRangeShortcutPanel.name, VDateRangeShortcutPanel)
        }
    }
}

// export default Vue => Vue.component(VDateRangePicker.name, VDateRangePicker)