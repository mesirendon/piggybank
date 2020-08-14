import Vue from 'vue';
import Web3 from 'web3';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Hub from './handlers/hub';

// eslint-disable-next-line no-multi-assign
Vue.prototype.$web = Vue.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
// eslint-disable-next-line no-multi-assign
Vue.prototype.$hub = Vue.hub = new Hub('0xCfEB869F69431e42cdB54A4F4f105C19C080A601');

sync(store, router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
