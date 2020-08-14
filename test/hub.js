const Hub = artifacts.require('Hub');
const PiggyBank = artifacts.require('PiggyBank');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

contract('Hub', (accounts) => {
  const [
    owner,
    alice,
    bob,
    charlie,
    dean,
    eva,
  ] = accounts;
  describe('Deploying hub', () => {
    it('should get an instance of the deployed hub', () => {
      return Hub.deployed().then(( hub ) => {
        expect(hub).to.be.an('object');
      });
    });
    it('should get owner of the hub', () => {
      return Hub.deployed()
        .then(( hub ) => hub.owner())
        .then(( registeredOwner ) => {
          expect(registeredOwner).to.eq(owner);
        });
    });
  });
  describe('Operational', () => {
    it('should create a piggy bank and register it for its owner', () => {
      return PiggyBank.new('Marranito', {from: alice})
        .then(( piggyBank ) => Promise.all([
          Hub.deployed(),
          piggyBank,
        ]))
        .then(([ hub, piggyBank ]) => Promise.all([
          hub.addPiggyBank(piggyBank.address, {from: alice}),
          hub,
        ]))
        .then(([ result, hub ]) => {
          expect(result.tx).to.match(/0x[0-9a-fA-F]{64}/);
          return hub.piggyBanks({from: alice});
        })
        .then(( piggyBanks ) => {
          expect(piggyBanks.toNumber()).to.eq(1);
        })
    });
    it('should get the piggy banks for a user', () => {
      return Promise.all([
        Hub.deployed(),
        PiggyBank.new('Marranito 1', {from: bob}),
        PiggyBank.new('Marranito 2', {from: bob}),
        PiggyBank.new('Marranito 1', {from: charlie}),
      ])
        .then(([
          hub,
          bobMarranito1,
          bobMarranito2,
          charlieMarranito1,
        ]) => Promise.all([
          hub,
          bobMarranito1.address,
          bobMarranito2.address,
          charlieMarranito1.address,
          hub.addPiggyBank(bobMarranito1.address, {from: bob}),
          hub.addPiggyBank(bobMarranito2.address, {from: bob}),
          hub.addPiggyBank(charlieMarranito1.address, {from: charlie}),
        ]))
        .then(([
          hub,
          bobMarranito1,
          bobMarranito2,
          charlieMarranito1,
        ]) => Promise.all([
          hub,
          hub.piggyBanks({from: bob}),
          hub.piggyBanks({from: charlie}),
          bobMarranito1,
          bobMarranito2,
          charlieMarranito1,
        ]))
        .then(([
          hub,
          bobPiggies,
          charliePiggies,
          bobMarranito1,
          bobMarranito2,
          charlieMarranito1,
        ]) => {
          expect(bobPiggies.toNumber()).to.eq(2);
          expect(charliePiggies.toNumber()).to.eq(1);
          return Promise.all([
            hub.piggies(0, {from: bob}),
            hub.piggies(1, {from: bob}),
            hub.piggies(0, {from: charlie}),
            bobMarranito1,
            bobMarranito2,
            charlieMarranito1,
          ]);
        })
        .then(([
          bobPiggy1,
          bobPiggy2,
          charliePiggy1,
          bobMarranito1,
          bobMarranito2,
          charlieMarranito1,
        ]) => {
          expect(bobPiggy1).to.eq(bobMarranito1);
          expect(bobPiggy2).to.eq(bobMarranito2);
          expect(charliePiggy1).to.eq(charlieMarranito1);
        })
    });
    it('should register the ownership transfer from one user to another', () => {
      return Promise.all([
        Hub.deployed(),
        PiggyBank.new('Marranito', {from: eva}),
        PiggyBank.new('Marranito', {from: dean}),
      ])
      .then(([ hub, ma, mb ]) => Promise.all([
        hub,
        ma,
        mb,
        hub.addPiggyBank(ma.address, {from: eva}),
        hub.addPiggyBank(mb.address, {from: dean}),
      ]))
      .then(([ hub, ma, mb ]) => Promise.all([
        hub,
        ma,
        mb,
        mb.setOwner(eva, {from: dean}),
      ]))
      .then(([ hub, ma, mb ]) => Promise.all([
        hub,
        ma,
        mb,
        hub.transferOwnership(mb.address, eva, {from: dean}),
      ]))
      .then(([hub, ma, mb]) => Promise.all([
        hub,
        ma,
        mb,
        hub.piggyBanks({from: eva}),
        hub.piggyBanks({from: dean}),
        hub.piggies(0, {from: dean}),
      ]))
      .then(([ hub, ma, mb, pba, pbb, pbbc ]) => {
        expect(pba.toNumber()).to.eq(2);
        expect(pbb.toNumber()).to.eq(1);
        console.log(pbbc);
      })
    });
  });
});
