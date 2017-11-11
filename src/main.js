import Vue from 'vue'
import App from './App.vue'

import VueFire from 'vuefire'
Vue.use(VueFire)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-TW'
Vue.use(ElementUI, { locale })

import 'font-awesome/css/font-awesome.min.css'

new Vue({
  el: '#app',
  render: h => h(App),
})
