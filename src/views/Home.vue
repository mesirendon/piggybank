<template>
  <div class="home">
    <div v-if="isLogged">
      <h1>Dashboard</h1>
      <h2>Create a new Piggy Bank</h2>
      <form @submit.prevent="create">
        <div class="form-group">
          <label for="name">Name of your new Piggy Bank</label>
          <input type="text" class="form-control" id="name" v-model="name">
        </div>
        <button type="submit" class="btn btn-primary">
          Create
        </button>
      </form>
      <hr>
      <h2>My Piggy Banks</h2>
      <div class="list-group">
        <template v-for="(p, idx) in piggyBankAddresses">
          <piggy-bank-list-item :address="p" :key="`pbi-${idx}`"/>
        </template>
      </div>
    </div>
    <div v-else>
      <h1>Piggy Bank</h1>
      <h2>The simple way to start saving</h2>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import PiggyBankListItem from '@/components/home/PiggyBankListItem.vue';
import PiggyBank from '@/handlers/piggyBank';
import { mapGetters, mapMutations, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'Home',
  data() {
    return {
      name: null,
    };
  },
  computed: {
    ...mapGetters({
      isLogged: constants.SESSION_IS_LOGGED,
    }),
    ...mapState({
      piggyBankAddresses: (state) => state.Session.piggyBanks,
      account: (state) => state.Session.account,
    }),
  },
  watch: {
    isLogged(val) {
      if (val) this.loadPiggyBanks();
    },
    account() {
      this.loadPiggyBanks();
    },
  },
  methods: {
    ...mapMutations({
      setPiggyBanks: constants.SESSION_SET_PIGGY_BANKS,
      cleanPiggyBanks: constants.SESSION_CLEAR_PIGGY_BANKS,
    }),
    create() {
      PiggyBank.create(this.name)
        .then((piggyBankAddress) => this.$hub.addPiggyBank(piggyBankAddress))
        .then(() => this.loadPiggyBanks());
    },
    loadPiggyBanks() {
      const self = this;
      this.setPiggyBanks([]);
      this.$hub.eventualPiggyBanks
        .then((piggies) => _.range(piggies))
        .then((indices) => Promise.all(indices.map((idx) => self.$hub.piggies(idx))))
        .then((addresses) => [...(new Set(addresses))])
        .then((addresses) => addresses.filter((address) => !address.match(/0x[0]{40}/)))
        .then((addresses) => {
          this.setPiggyBanks(addresses);
        });
    },
  },
  mounted() {
    if (this.isLogged) this.loadPiggyBanks();
  },
  components: {
    PiggyBankListItem,
  },
};
</script>
