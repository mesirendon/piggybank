import Vue from 'vue';
import PiggyBankContract from '@/../build/contracts/PiggyBank.json';

export default class PiggyBank {
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
