import Vue from 'vue'
import App from './App.vue'
import VueFire from 'vuefire'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-TW'
Vue.use(ElementUI, { locale })
Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(App),
})
