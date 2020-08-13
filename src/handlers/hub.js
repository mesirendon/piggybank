import Vue from 'vue';
import HubContract from '@/../build/contracts/Hub.json';

export default class Hub {
  constructor(address) {
    this.internalAddress = address;
    this.instance = new Vue.web3.eth.Contract(HubContract.abi, address);
  }

  get address() {
    return this.internalAddress;
  }

  get eventualOwner() {
    return new Promise((resolve, reject) => {
      this.instance.methods.owner()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualPiggyBanks() {
    return new Promise((resolve, reject) => {
      Vue.web3.eth.getAccounts()
        .then(([from]) => this.instance.methods.piggyBanks().call({ from }))
        .then(resolve)
        .catch(reject);
    });
  }

  addPiggyBank(piggyBankAddress) {
    return new Promise((resolve, reject) => {
      const addPiggyBankSignature = this.instance.methods.addPiggyBank(piggyBankAddress);
      Vue.web3.eth.getAccounts()
        .then(([from]) => Promise.all([
          from,
          addPiggyBankSignature.estimateGas({ from }),
        ]))
        .then(([from, gas]) => addPiggyBankSignature.send({ from, gas }))
        .then(resolve)
        .catch(reject);
    });
  }
}
