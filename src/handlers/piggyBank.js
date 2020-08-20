import Vue from 'vue';
import PiggyBankContract from '@/../build/contracts/PiggyBank.json';

export default class PiggyBank {
  constructor(address) {
    this.internalAddress = address;
    this.instance = new Vue.web3.eth.Contract(PiggyBankContract.abi, address);
    this.ws = new Vue.ws.eth.Contract(PiggyBankContract.abi, address);
  }

  get address() {
    return this.internalAddress;
  }

  get eventualName() {
    return new Promise((resolve, reject) => {
      this.instance.methods.name()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualBalance() {
    return new Promise((resolve, reject) => {
      Vue.web3.eth.getBalance(this.internalAddress)
        .then(Vue.web3.utils.fromWei)
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualOwner() {
    return new Promise((resolve, reject) => {
      this.instance.methods.owner()
        .call()
        .then(resolve)
        .catch(reject);
    });
  }

  get events() {
    return {
      deposit: (cb) => this.ws.events.Deposit({ fromBlock: 0 }, cb),
    };
  }

  deposit(amount) {
    return new Promise((resolve, reject) => {
      const depositSignature = this.instance.methods.deposit();
      Vue.web3.eth.getAccounts()
        .then(([from]) => Promise.all([
          from,
          depositSignature.estimateGas({ from, value: Vue.web3.utils.toWei(amount) }),
        ]))
        .then(([from, gas]) => depositSignature.send({
          from,
          gas,
          value: Vue.web3.utils.toWei(amount),
        }))
        .then(resolve)
        .catch(reject);
    });
  }

  withdraw() {
    return new Promise((resolve, reject) => {
      const withdrawSignature = this.instance.methods.withdraw();
      Vue.web3.eth.getAccounts()
        .then(([from]) => Promise.all([
          from,
          withdrawSignature.estimateGas({ from }),
        ]))
        .then(([from, gas]) => withdrawSignature.send({ from, gas }))
        .then(resolve)
        .catch(reject);
    });
  }

  transfer(newOwner) {
    return new Promise((resolve, reject) => {
      const transferSignature = this.instance.methods.setOwner(newOwner);
      Vue.web3.eth.getAccounts()
        .then(([from]) => Promise.all([
          from,
          transferSignature.estimateGas({ from }),
        ]))
        .then(([from, gas]) => transferSignature.send({ from, gas }))
        .then(resolve)
        .catch(reject);
    });
  }

  static create(name) {
    return new Promise((resolve, reject) => {
      const PBSC = new Vue.web3.eth.Contract(PiggyBankContract.abi);
      const deploy = PBSC.deploy({
        data: PiggyBankContract.bytecode,
        arguments: [name],
      });
      Vue.web3.eth.getAccounts()
        .then(([from]) => Promise.all([
          from,
          deploy.estimateGas({ from }),
        ]))
        .then(([from, gas]) => deploy.send({ from, gas }))
        // eslint-disable-next-line no-underscore-dangle
        .then((instance) => instance._address)
        .then(resolve)
        .catch(reject);
    });
  }
}
