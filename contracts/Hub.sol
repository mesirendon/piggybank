//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract Hub {
  address public owner;
  mapping(address => address[]) pgs;

  constructor() public {
    owner = msg.sender;
  }

  function addPiggyBank(address _piggyBank) public {
    pgs[msg.sender].push(_piggyBank);
  }

  function piggyBanks() public view returns(uint) {
    return pgs[msg.sender].length;
  }

  function piggies(uint _idx) public view returns(address) {
    return pgs[msg.sender][_idx];
  }

  function transferOwnership(address _pb, address _newOwner) public {
    address[] memory addresses = pgs[msg.sender];
    for(uint i = 0; i < addresses.length; i++) {
      if (addresses[i] == _pb) {
        delete addresses[i];
        break;
      }
    }
    pgs[_newOwner].push(_pb);
    delete pgs[msg.sender];
    pgs[msg.sender] = addresses;
  }
}
