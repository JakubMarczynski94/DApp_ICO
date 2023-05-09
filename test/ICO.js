// Test file for ICO contract
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICO Contract", function () {
  let ICO;
  let token;

  // Deploy a new contract instance before each test case
  beforeEach(async function () {
    ICO = await ethers.getContractFactory("ICO");
    token = await ICO.deploy(
      "My Token",
      "MTK",
      ethers.utils.parseEther("0.1"), // Minimum purchase of 0.1 ether
      ethers.utils.parseEther("10"), // Maximum purchase of 10 ether
      1000, // Rate of 1000 tokens per ether
      ethers.utils.parseEther("100"), // Soft cap of 100 ether
      ethers.utils.parseEther("1000"), // Hard cap of 1000 ether
      Math.floor(Date.now() / 1000) + 60, // Start time in 60 seconds from now
      Math.floor(Date.now() / 1000) + 3600 // End time in 1 hour from now
    );
  });

  describe("Deployment", function () {
    it("Should set the correct initial values", async function () {
      expect(await token.name()).to.equal("My Token");
      expect(await token.symbol()).to.equal("MTK");
      expect(await token.minPurchase()).to.equal(ethers.utils.parseEther("0.1"));
      expect(await token.maxPurchase()).to.equal(ethers.utils.parseEther("10"));
      expect(await token.rate()).to.equal(1000);
      expect(await token.softCap()).to.equal(ethers.utils.parseEther("100"));
      expect(await token.hardCap()).to.equal(ethers.utils.parseEther("1000"));
      expect(await token.startTime()).to.be.above(Math.floor(Date.now() / 1000));
      expect(await token.endTime()).to.be.above(await token.startTime());
      expect(await token.active()).to.be.true;
      expect(await token.owner()).to.equal(await ethers.provider.getSigner(0).getAddress());
    });
  });

  describe("Deposit", function () {
    it("Should revert if ICO is not active", async function () {
      await token.stopICO();
      await expect(token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("ICO not active");
    });

    it("Should revert if the ICO has not started yet", async function () {
      await expect(token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("ICO has not started yet");
    });

    it("Should revert if the ICO has ended", async function () {
      // Increase time to after the end of the ICO
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine");

      await expect(token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("ICO has ended");
    });

    it("Should revert if the amount is below the minimum purchase limit", async function () {
      await expect(token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("0.05") })).to.be.revertedWith("Amount is below minimum purchase limit");
    });

    it("Should revert if the amount is above the maximum purchase limit", async function () {
      await expect(token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("20") })).to.be.revertedWith("Amount is above maximum purchase limit");
    });

    it("Should mint tokens to the sender if all conditions are met", async function () {
      const initialBalance = await token.balanceOf(await ethers.provider.getSigner(1).getAddress());

      await token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("1") });
      const finalBalance = await token.balanceOf(await ethers.provider.getSigner(1).getAddress());

      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("100"));
    });
  });

  describe("Stop ICO", function () {
    it("Should revert if called by a non-owner", async function () {
      await expect(token.connect(ethers.provider.getSigner(1)).stopICO()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set active to false", async function () {
      await token.stopICO();
      expect(await token.active()).to.be.false;
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {  await token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("2") }); // 200 tokens
    await token.connect(ethers.provider.getSigner(2)).deposit({ value: ethers.utils.parseEther("3") }); // 300 tokens
  });
  
  it("Should revert if called while ICO is active", async function () {
    await expect(token.withdraw()).to.be.revertedWith("Cannot withdraw while ICO is active");
  });
  
  it("Should revert if the soft cap has not been reached", async function () {
    await token.stopICO();
    await expect(token.withdraw()).to.be.revertedWith("Soft cap not reached");
  });
  
  it("Should transfer the contract balance to the owner upon successful withdrawal", async function () {
    const initialBalance = await ethers.provider.getBalance(await ethers.provider.getSigner(0).getAddress());
  
    // Increase time to after the end of the ICO
    await ethers.provider.send("evm_setNextBlockTimestamp", [await token.endTime() + 1]);
  
    await token.withdraw();
  
    const finalBalance = await ethers.provider.getBalance(await ethers.provider.getSigner(0).getAddress());
    expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("5")); // Total deposited: 2 + 3 = 5
  });
  });
  
  describe("Claim", function () {
  beforeEach(async function () {
  await token.connect(ethers.provider.getSigner(1)).deposit({ value: ethers.utils.parseEther("1") }); // 100 tokens
  
    await token.stopICO();
  
    // Increase time to after the end of the ICO
    await ethers.provider.send("evm_setNextBlockTimestamp", [await token.endTime() + 1]);
  });
  
  it("Should revert if called while ICO is active", async function () {
    await expect(token.connect(ethers.provider.getSigner(1)).claim()).to.be.revertedWith("Cannot claim while ICO is active");
  });
  
  it("Should revert if the soft cap has not been reached", async function () {
    await token.withdraw(); // Withdraw all funds, so the soft cap is not reached anymore
    await expect(token.connect(ethers.provider.getSigner(1)).claim()).to.be.revertedWith("Soft cap not reached");
  });
  
  it("Should revert if user has no tokens to claim", async function () {
    await expect(token.connect(ethers.provider.getSigner(2)).claim()).to.be.revertedWith("No tokens to claim");
  });
  
  it("Should burn the user's tokens and transfer ether to the user upon successful claiming", async function () {
    const initialBalance = await ethers.provider.getBalance(await ethers.provider.getSigner(1).getAddress());
    const initialTokens = await token.balanceOf(await ethers.provider.getSigner(1).getAddress());
  
    await token.connect(ethers.provider.getSigner(1)).claim();
  
    const finalBalance = await ethers.provider.getBalance(await ethers.provider.getSigner(1).getAddress());
    const finalTokens = await token.balanceOf(await ethers.provider.getSigner(1).getAddress());
  
    expect(finalTokens).to.equal(0);
    expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("1"));
  });
  });
  });