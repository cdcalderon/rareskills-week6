One way to solve the challenge is to create a new contract that uses the selfdestruct function to send its balance to the vulnerable contract. This can be accomplished by defining a new contract with a function that calls selfdestruct and passes the address of the vulnerable contract as an argument.

```
contract Hack {
    constructor(address payable _target) payable{
        selfdestruct(_target);
    }
}
```

Once you've created the new contract, you can call the function to transfer its balance to the vulnerable contract, thereby increasing its balance and completing the challenge.
