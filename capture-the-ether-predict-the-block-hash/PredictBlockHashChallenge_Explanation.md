**Problem Description: Predict the Block Hash**

The PredictTheBlockHashChallenge is a smart contract-based challenge that tests a user's ability to predict the hash of a specific block. To complete this challenge, a user needs to lock in a guess and wait for 257 blocks to be mined before calling `settle()`.

The Ethereum blockchain only allows access to the hashes of the most recent 256 blocks. Therefore, the hash of the 257th last block (and further behind) will return '0x0000000000000000000000000000000000000000000000000000000000000000'. To successfully complete the challenge, lock in the guess '0x0000000000000000000000000000000000000000000000000000000000000000' and wait for 257 blocks.

To solve the PredictTheBlockHashChallenge, follow these steps:

1. Deploy the contract and send 1 ether with the constructor.
2. Call `lockInGuess()` with a value of `0x0000000000000000000000000000000000000000000000000000000000000000` and send another ether.
3. Wait for 257 blocks to be mined:

```javascript
for (let i = 0; i < 257; i++) {
  await ethers.provider.send("evm_mine");
}
```

4. Call settle(). If the user has waited long enough, they will receive the two previously sent ethers back to their account.
