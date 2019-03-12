import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'

/** Language files */
import en from './components/lang/en.js'
import fr from './components/lang/fr.js'

Vue.use(Vuetify, {
    lang: {
        locales: { en, fr },
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
})