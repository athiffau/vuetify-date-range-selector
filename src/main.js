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
    locales: { en, fr }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
}).$mount('#app')
