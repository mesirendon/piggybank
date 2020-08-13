<template>
  <div class="home">
    <div v-if="isLogged">
      <h1>My Piggy Banks</h1>
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
      <ul>
        <li>0x123123</li>
        <li>0x123123</li>
        <li>0x123123</li>
      </ul>
    </div>
    <div v-else>
      <h1>Piggy Bank</h1>
      <h2>The simple way to start saving</h2>
    </div>
  </div>
</template>

<script>
import PiggyBank from '@/handlers/piggyBank';
import { mapGetters } from 'vuex';
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
  },
  watch: {
    isLogged(val) {
      if (val) {
        this.$hub.eventualPiggyBanks
          .then(console.log);
      }
    },
  },
  methods: {
    create() {
      PiggyBank.create(this.name)
        .then((piggyBankAddress) => this.$hub.addPiggyBank(piggyBankAddress))
        .then(() => this.$hub.eventualPiggyBanks)
        .then(console.log);
    },
  },
};
</script>
