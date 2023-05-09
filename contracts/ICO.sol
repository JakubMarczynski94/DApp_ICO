// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ICO is ERC20, Ownable {
    uint256 public minPurchase;
    uint256 public maxPurchase;
    uint256 public rate;
    uint256 public softCap;
    uint256 public hardCap;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public depositAmount;
    bool public active;

    enum State {
        BEFORE,
        RUNNING,
        END_FAIL,
        END_SUCCESS,
        HALTED
    }
    State public ICOState;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _rate,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _startTime,
        uint256 _endTime
    ) ERC20(name, symbol) {
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        rate = _rate;
        softCap = _softCap;
        hardCap = _hardCap;
        startTime = _startTime;
        endTime = _endTime;
        ICOState = State.RUNNING;
        transferOwnership(msg.sender);
    }

    function deposit() external payable {
        require(ICOState == State.RUNNING, "ICO not active");
        require(block.timestamp >= startTime, "ICO has not started yet");
        require(block.timestamp <= endTime, "ICO has ended");

        uint256 amount = msg.value * rate;
        require(amount >= minPurchase, "Amount is below minimum purchase limit");
        require(amount <= maxPurchase, "Amount is above maximum purchase limit");

        _mint(msg.sender, amount);
        depositAmount += amount;

        if(block.timestamp > endTime && depositAmount < softCap){
            ICOState = State.END_FAIL;
        }
        if(block.timestamp > endTime && depositAmount < softCap){
            ICOState = State.END_SUCCESS;
        }
        if(depositAmount > hardCap) {
            ICOState = State.END_SUCCESS;
        }
    }

    function stopICO() external onlyOwner {
        ICOState = State.HALTED;
    }

    function withdraw() external {
        require(ICOState == State.END_SUCCESS, "Cannot withdraw while ICO is active");

        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function claim() external {
        require(ICOState == State.END_FAIL, "Cannot claim while ICO is active");

        uint256 amount = balanceOf(msg.sender);
        require(amount > 0, "No tokens to claim");

        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount / rate);
    }

    function getICOState() external view returns (string memory) {
        if (ICOState == State.BEFORE) {
            return "Not Started";
        } else if (ICOState == State.RUNNING) {
            return "Running";
        } else if (ICOState == State.END_FAIL) {
            return "Failed End";
        } else if (ICOState == State.END_SUCCESS) {
            return "Success End";
        }        else {
            return "Halted";
        }
    }

    function getICODate() external view returns (uint256){
        return startTime;
    }
}