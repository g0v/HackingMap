import Vue from 'vue'
import App from './App.vue'
import VueFire from 'vuefire'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueFire)
Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(App),
})
