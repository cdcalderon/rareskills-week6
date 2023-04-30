# Retirement Savings Challenge

The Retirement Savings Challenge is a smart contract that enforces penalties on premature withdrawals by transferring the entire contract balance to a designated beneficiary. The `collectFine` function in the contract detects early withdrawals:

```javascript
function collectFine() public {
  // ...
  uint256 amountWithdrawn = initialBalance - address(this).balance;

  // A premature withdrawal took place
  require(amountWithdrawn > 0);

  // The penalty is the remaining balance
  msg.sender.transfer(address(this).balance);
}
```

This function calculates the difference between the starting and current balance, and ensures that it is greater than zero. Nevertheless, an attacker can exploit this by using the `selfdestruct` command on a contract holding ether, which circumvents the necessary checks.

An attacker can exploit this vulnerability by creating a basic `selfdestruct` contract that sends a single wei to the RetirementSavingsChallenge contract. This results in an arithmetic underflow, making the current balance larger than the initial balance. The attacker can then invoke the `collectFine` function, causing an underflow in the penalty calculation and ultimately transferring the entire contract balance to the beneficiary.

The vulnerability exists because Ethereum allows ether to be forcibly sent to a contract by calling the `selfdestruct` function, without the need for a fallback function. The code for the `selfdestruct` contract that an attacker could use to exploit this vulnerability is as follows:

```
contract RetirementSavingsAttacker {

    constructor (address payable targetAddress) payable {
        require(msg.value > 0);
        selfdestruct(targetAddress);
    }
}
```
