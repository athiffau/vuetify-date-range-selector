import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

new Vue({
    el: '#app',
    render: h => h(App)
})