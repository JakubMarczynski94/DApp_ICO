const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ICO contract", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const IcoContract = await ethers.getContractFactory("ICO");
    this.ico = await IcoContract.connect(owner).deploy();
    await this.ico.deployed();
  });

  it("should deploy and mint tokens to the owner", async function () {
    expect(await this.ico.name()).to.equal("LKS-Token");
    expect(await this.ico.symbol()).to.equal("LKS");
    expect(await this.ico.balanceOf(owner.address)).to.equal(500000);
  });

  it("should allow deposits during the ICO period", async function () {
    const depositAmount = ethers.utils.parseEther("10");
    await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
      .to.emit(this.ico, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr1.address, depositAmount.mul(1000));

    expect(await this.ico._deposit(addr1.address)).to.equal(depositAmount.mul(1000));
  });

  it("should not allow deposits outside the ICO period", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");
    await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
      .to.be.revertedWith("ICO has not started yet");

    await ethers.provider.send("evm_setNextBlockTimestamp", [startTime + (86400 * 2)]);
    await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
      .to.be.revertedWith("ICO has ended");
  });

  it("should allow withdrawals after the ICO period if soft cap is not reached", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");
    await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
      .to.emit(this.ico, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr1.address, depositAmount.mul(1000));

    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 86400]);
    await expect(this.ico.connect(addr1).withdraw())
      .to.emit(this.ico, "Transfer")
      .withArgs(addr1.address, ethers.constants.AddressZero, depositAmount.mul(1000));

    expect(await this.ico._deposit(addr1.address)).to.equal(0);
  });

  it("should not allow withdrawals during the ICO period or if soft cap is reached", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");
    await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
      .to.emit(this.ico, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr1.address, depositAmount.mul(1000));

    await expect(this.ico.connect(addr1).withdraw()).to.be.revertedWith("Date is not reached");

    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 86400]);
    await expect(this.ico.connect(addr1).withdraw()).to.be.revertedWith("Soft cap not reached");
  });

  it("should allow claiming after the ICO period if success condition is met", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");
    await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
      .to.emit(this.ico, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr1.address, depositAmount.mul(1000));

    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 86400]);
    await expect(this.ico.connect(addr1).claim())
      .to.emit(this.ico, "Transfer")
      .withArgs(owner.address, addr1.address, depositAmount.mul(1000).div(tokenPrice));
    });

    it("should not allow claiming during the ICO period or if soft cap is not reached", async function () {
      const depositAmount = ethers.utils.parseEther("0.02");
      await expect(this.ico.connect(addr1).deposit({ value: depositAmount }))
        .to.emit(this.ico, "Transfer")
        .withArgs(ethers.constants.AddressZero, addr1.address, depositAmount.mul(1000));
   
      await expect(this.ico.connect(addr1).claim()).to.be.revertedWith("softCap not reached");
   
      await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 86400]);
      await expect(this.ico.connect(addr1).claim()).to.be.revertedWith("don't have deposit");
   
      await expect(this.ico.connect(addr2).deposit({ value: depositAmount }))
        .to.emit(this.ico, "Transfer")
        .withArgs(ethers.constants.AddressZero, addr2.address, depositAmount.mul(1000));
   
      await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 86400]);
      await expect(this.ico.connect(addr2).claim()).to.be.revertedWith("Success condition not reached");
    });
   });
   
   
