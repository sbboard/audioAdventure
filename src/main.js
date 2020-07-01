import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import router from './router.js';
import {store} from './store.js';

Vue.config.productionTip = false

Vue.use(VueRouter,VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')