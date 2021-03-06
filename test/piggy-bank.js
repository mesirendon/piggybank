const PiggyBank = artifacts.require('./PiggyBank.sol');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

contract('Piggy Bank', (accounts) => {
  const [
    owner,
    alice,
    bob,
    charlie,
    eva,
  ] = accounts;
  let piggyBank;
  beforeEach(async() => {
    piggyBank = await PiggyBank.new('Marranito');
  });
  describe('Deploy', () => {
    it('should fail if no name is provided', () => {
      return expect(PiggyBank.new())
        .to.be.eventually.rejected;
    });
    it('should deploy successfully upon name being provided', () => {
      return PiggyBank.new('Marranito')
        .then(( result ) => {
          expect(result.transactionHash).to.match(/0x[0-9a-fA-F]{64}/);
        });
    });
  });
  describe('Operational explicit invocation', () => {
    it('should allow anyone to send ether', () => {
      return piggyBank.deposit({from: charlie, value: web3.utils.toWei('1.3')})
        .then(( result ) => {
          expect(result.tx).to.match(/0x[0-9a-fA-F]{64}/);
          return web3.eth.getBalance(piggyBank.address);
        })
        .then(( balance ) => {
          expect(parseFloat( web3.utils.fromWei(balance) )).to.eq(1.3);
        });
    });
    it('should allow the owner to withdraw money', () => {
      return piggyBank.deposit({from: bob, value: web3.utils.toWei('1.3')})
        .then(( result ) => {
          expect(result.tx).to.match(/0x[0-9a-fA-F]{64}/);
          return piggyBank.withdraw();
        })
        .then(() => web3.eth.getBalance(piggyBank.address))
        .then(( balance ) => {
          expect(parseFloat( web3.utils.fromWei(balance) )).to.eq(0);
          return web3.eth.getBalance(owner);
        })
        .then(( balance ) => {
          expect(parseFloat( web3.utils.fromWei(balance) )).to.gt(100);
        })
    });
    it('should avoid anyone withdrawing money', () => {
      return expect( piggyBank.withdraw({ from: eva }) )
        .to.be.eventually.rejectedWith('You are not the rightful owner');
    });
    it('should count savings by sender and amount', () => {
      return Promise.all([
        piggyBank.deposit({from: alice, value: web3.utils.toWei('1.3')}),
        piggyBank.deposit({from: alice, value: web3.utils.toWei('1.3')}),
        piggyBank.deposit({from: alice, value: web3.utils.toWei('1.3')}),
        piggyBank.deposit({from: bob, value: web3.utils.toWei('1.3')}),
        piggyBank.deposit({from: charlie, value: web3.utils.toWei('1.3')}),
      ])
        .then(() => web3.eth.getBalance(piggyBank.address))
        .then(( balance ) => {
          expect(parseFloat( web3.utils.fromWei(balance) )).to.eq(6.5);
          return piggyBank.depositsByAddress(alice);
        })
        .then(( { totalAmount, times } ) => {
          expect(parseFloat( web3.utils.fromWei( totalAmount ) )).to.eq(3.9);
          expect(times.toNumber()).to.eq(3)
        });
    });
    it('should avoid anyone taking ownership', () => {
      return expect(piggyBank.setOwner(eva, {from: eva}))
        .to.be.eventually.rejected;
    });
    it('should allow the owner to transfer the piggy bank', () => {
      return piggyBank.setOwner(alice)
        .then(( result ) => {
          expect(result.tx).to.match(/0x[0-9a-fA-F]{64}/);
        });
    });
    it('should avoid anyone destroying the piggy bank', () => {
      return expect(piggyBank.crash({from: eva}))
        .to.be.eventually.rejected;
    })
    it('should allow the owner to destroy the piggy bank', () => {
      return piggyBank.crash()
        .then(( result ) => {
          expect(result.tx).to.match(/0x[0-9a-fA-F]{64}/);
        });
    });
  });
  describe('Operational implicit invocation', () => {
    it('should allow anyone to send ether', () => {
      return web3.eth.sendTransaction({
        from: alice,
        to: piggyBank.address,
        value: web3.utils.toWei('1.5'),
      })
        .then(( result ) => {
          expect(result.transactionHash).to.match(/0x[0-9a-fA-F]{64}/);
        });
    });
    it('should allow the owner to withdraw money', () => {
      return web3.eth.sendTransaction({
        from: charlie,
        to: piggyBank.address,
        value: web3.utils.toWei('4'),
      })
        .then(() => web3.eth.sendTransaction({
          from: owner,
          to: piggyBank.address,
          value: web3.utils.toWei('0'),
        }))
        .then(() => Promise.all([
          web3.eth.getBalance(piggyBank.address),
          web3.eth.getBalance(owner),
        ]))
        .then(([ piggyBankBalance, ownerBalance ]) => {
          expect(parseFloat( web3.utils.fromWei(piggyBankBalance) )).to.eq(0);
          expect(parseFloat( web3.utils.fromWei(ownerBalance) )).to.gt(100);
        });
    });
    it('should avoid anyone withdrawing money', () => {
      return expect(web3.eth.sendTransaction({
        from: eva,
        to: piggyBank.address,
        value: web3.utils.toWei('0'),
      }))
        .to.be.eventually.rejectedWith('You are not the rightful owner');
    });
  });
});
