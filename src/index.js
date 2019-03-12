import VDateRangePicker from './components/DateRangePicker'
import VDateRangeShortcutDrawer from './components/DateRangeShortcutDrawer'
import VDateRangeShortcutPanel from './components/DateRangeShortcutPanel'

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