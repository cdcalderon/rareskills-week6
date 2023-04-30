const { expect } = require("chai");
const { utils } = require("ethers");
const { ethers } = require("hardhat");

describe("RetirementFundChallenge", () => {
  it("successfully withdraws funds without penalty", async () => {
    const userAddress = ethers.provider.getSigner().getAddress();

    // Deploy the RetirementFundChallenge contract with the user as the beneficiary
    const challengeFactory = await ethers.getContractFactory(
      "RetirementFundChallenge"
    );
    const challengeContract = await challengeFactory.deploy(userAddress, {
      value: utils.parseEther("1"),
    });
    await challengeContract.deployed();

    // Deploy the RetirementFundAttack contract, passing the address of the challenge contract
    const attackFactory = await ethers.getContractFactory(
      "RetirementFundAttack"
    );
    const attackContract = await attackFactory.deploy(
      challengeContract.address,
      { value: 1 }
    );
    await attackContract.deployed();

    // Call the collectPenalty function on the challenge contract to trigger the attack
    const collectPenaltyTx = await challengeContract.collectPenalty();
    await collectPenaltyTx.wait();

    // Verify that the challenge contract has no remaining balance
    expect(await challengeContract.isComplete()).to.be.true;
  });
});
