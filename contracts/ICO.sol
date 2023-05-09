pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract ICO is ERC20, Ownable {
    address public _owner;
    uint256 public minPurchase = 0.01*10**18;
    uint256 public maxPurchase = 0.05*10**18;
    uint256 public rate = 1000;
    uint256 public tokenNumber = 500000;
    uint256 public softCap = 0.1*10**18;
    uint256 public hardCap = 10**18;
    uint256 public startTime = 1683586800;
    uint256 public endTime = 1683745200;
    uint256 public depositAmount = 0;

    mapping(address => uint) public _deposit;

    constructor(
    ) ERC20("LKS-Token", "LKS") {
        _owner = msg.sender;
        // transferOwnership(msg.sender);
        _mint(_owner, tokenNumber);
    }

    function deposit() external payable {
        require(block.timestamp >= startTime, "ICO has not started yet");
        require(block.timestamp <= endTime, "ICO has ended");
        console.log(msg.value);

        uint256 amount = msg.value / rate;
        require(amount + _deposit[msg.sender] >= minPurchase, "Amount is below minimum purchase limit");
        require(amount + _deposit[msg.sender] <= maxPurchase, "Amount is above maximum purchase limit");
        require(amount + depositAmount < hardCap, "depositAmount over hardCap");
        depositAmount += amount;
        _deposit[msg.sender] += amount;
    }

    function withdraw() external {
        require(block.timestamp > endTime, "Date is not reached");
        require(depositAmount < softCap, "Soft cap not reached");
        require(_deposit[msg.sender] > 0, "user has no deposit");

        uint256 amount = _deposit[msg.sender];
        depositAmount -= amount;
        _deposit[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function claim() external {
        require(depositAmount > softCap, "softCap not reached");
        require(_deposit[msg.sender] > 0, "don't have deposit");
        require(block.timestamp >= endTime || depositAmount >= hardCap, "Success condition not reached");

        uint256 amount = _deposit[msg.sender] * rate;
        payable(_owner).transfer(_deposit[msg.sender]);
        _deposit[msg.sender] = 0;
        transferFrom(_owner, msg.sender, amount);
    }
}
