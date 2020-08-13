import Vue from 'vue';
import Web3 from 'web3';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import Hub from './handlers/hub';

// eslint-disable-next-line no-multi-assign
Vue.prototype.$web = Vue.web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
// eslint-disable-next-line no-multi-assign
Vue.prototype.$hub = Vue.hub = new Hub('0x25a013063Ae7be59780Fd1230d5b2AAbd29C56df');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
