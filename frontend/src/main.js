import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'
import './plugins/registerGlobalComps'
// import VueVega from 'vue-vega'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.config.productionTip = false
Vue.use(ElementUI, {locale})
require('./css/neo4jd3.css')
new Vue({
  router,
  store,
  vuetify,
  // VueVega,
  render: h => h(App)
}).$mount('#app')

