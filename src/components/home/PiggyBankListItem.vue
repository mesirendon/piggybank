<template>
  <router-link class="list-group-item list-group-item-action"
               :to="{name: 'piggyBank', params: {address}}">
    <div class="row">
      <div class="col">{{ name }}</div>
      <div class="col">{{ address }}</div>
      <div class="col">{{ balance }} ETH</div>
    </div>
  </router-link>
</template>

<script>
import PiggyBank from '@/handlers/piggyBank';

export default {
  name: 'PiggyBankListItem',
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      piggyBank: null,
      name: null,
      balance: null,
    };
  },
  created() {
    this.piggyBank = new PiggyBank(this.address);
    this.piggyBank.eventualName
      .then((name) => {
        this.name = name;
      });
    this.piggyBank.eventualBalance
      .then((balance) => {
        this.balance = balance;
      });
    const self = this;
    this.piggyBank.events.deposit()
      .on('data', () => {
        self.piggyBank.eventualBalance
          .then((balance) => {
            console.log(balance);
            self.balance = balance;
          });
      });
  },
};
</script>
