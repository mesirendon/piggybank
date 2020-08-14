import Vue from 'vue';
import * as constants from '@/store/constants';
import store from '@/store';

if (window.ethereum) {
  window.ethereum.on('accountsChanged', () => {
    store.dispatch(constants.SESSION_CONNECT_WEB3);
  });
}

const state = {
  account: null,
  piggyBanks: [],
};

const actions = {
  [constants.SESSION_CONNECT_WEB3]: ({ commit }) => {
    Vue.web3.eth.getAccounts()
      .then(([account]) => {
        commit(constants.SESSION_SET_PROPERTY, { account });
      });
  },
  [constants.SESSION_CLEAR_PIGGY_BANKS]: ({ commit }) => {
    commit(constants.SESSION_SET_PROPERTY, { piggyBanks: [] });
  },
};

const mutations = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_SET_PROPERTY]: (state, data) => {
    const [[property, value]] = Object.entries(data);
    state[property] = value;
  },
  // eslint-disable-next-line no-shadow
  [constants.SESSION_SET_PIGGY_BANKS]: (state, pbs) => {
    state.piggyBanks = pbs;
  },
};

const getters = {
  // eslint-disable-next-line no-shadow
  [constants.SESSION_IS_LOGGED]: (state) => !!state.account,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
