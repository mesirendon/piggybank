//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract PiggyBank {
  string public name;
  address payable public owner;
  mapping(address => Saving) savings;

  struct Saving {
    uint totalAmount;
    uint times;
  }

  event Deposit(address indexed _from, uint _value);

  constructor(string memory _name) public {
    name = _name;
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'You are not the rightful owner');
    _;
  }

  function deposit() public payable {
    Saving storage saving = savings[msg.sender];
    saving.totalAmount += msg.value;
    saving.times += 1;
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw() public onlyOwner {
    owner.transfer(address(this).balance);
  }

  function depositsByAddress(address _sender) public view returns(uint totalAmount, uint times) {
    Saving storage saving = savings[_sender];
    totalAmount = saving.totalAmount;
    times = saving.times;
  }

  function setOwner(address payable _newOwner) public onlyOwner {
    owner = _newOwner;
  }

  function crash() public onlyOwner {
    selfdestruct(owner);
  }

  function() external payable {
    if(msg.value == 0) withdraw();
    else emit Deposit(msg.sender, msg.value);
  }
}
