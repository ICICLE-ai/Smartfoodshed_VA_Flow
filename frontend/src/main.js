import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'
// import VueVega from 'vue-vega'

Vue.config.productionTip = false
require('./css/neo4jd3.css')
new Vue({
  router,
  store,
  vuetify,
  // VueVega,
  render: h => h(App)
}).$mount('#app')

