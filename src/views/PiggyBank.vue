<template>
  <div>
    <h1>Piggy Bank: {{ name }}</h1>
    <h2>{{ balance }} ETH</h2>
    <h6>{{ address }}</h6>
    <div class="row">
      <div class="col">
        <h3>Send</h3>
        <form @submit.prevent="send">
          <div class="form-group">
            <label for="amount">Send some ether</label>
            <input type="number" step="0.01" min="0" class="form-control" id="amount"
                   v-model="deposit">
          </div>
          <button type="submit" class="btn btn-primary">Send</button>
        </form>
      </div>
      <div class="col" v-if="isOwner">
        <h3>Actions</h3>
        <button class="btn btn-success btn-block" @click="withdraw">Withdraw</button>
        <hr>
        <button class="btn btn-danger btn-block">Crash</button>
        <hr>
        <form @submit.prevent="transfer">
          <div class="form-group">
            <label for="transferAddress">Transfer Ownership to</label>
            <input type="text" class="form-control" id="transferAddress" v-model="newOwner">
          </div>
          <button class="btn btn-danger" type="submit">Transfer</button>
        </form>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import PiggyBank from '@/handlers/piggyBank';
import { mapState } from 'vuex';

export default {
  name: 'PiggyBank',
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
      deposit: null,
      newOwner: null,
      isOwner: true,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  watch: {
    account() {
      this.getOwnershipStatus();
    },
  },
  methods: {
    send() {
      this.piggyBank.deposit(this.deposit)
        .then(() => this.piggyBank.eventualBalance)
        .then((balance) => {
          this.balance = balance;
          this.deposit = null;
        });
    },
    withdraw() {
      this.piggyBank.withdraw()
        .then(() => this.piggyBank.eventualBalance)
        .then((balance) => {
          this.balance = balance;
        });
    },
    transfer() {
      this.piggyBank.transfer(this.newOwner)
        .then(() => this.$hub.transferOwnership(this.piggyBank.address, this.newOwner))
        .then(() => {
          this.getOwnershipStatus();
        });
    },
    getOwnershipStatus() {
      this.piggyBank.eventualOwner
        .then((owner) => {
          this.isOwner = owner === this.account;
        });
    },
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
  },
  mounted() {
    this.getOwnershipStatus();
  },
};
</script>
