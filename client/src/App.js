import { useState } from "react";
import Web3 from "web3";
import ICO from "./ICO.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const ContractInteraction = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  // Define the contract address and ABI
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const abi = ICO.abi;

  // Create an instance of the contract
  const contract = new web3.eth.Contract(abi, contractAddress);

  const updateBalance = async (account) => {
    const balance = await contract.methods.balanceOf(account).call();
    setBalance(balance);
  };

  const handleAccountRequest = async () => {
    try {
      // Get the user's account address from MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];

      // Call the updateBalance function to get the initial token balance
      await updateBalance(account);

      // Set up event listener for account change using the on() method
      window.ethereum.on("accountsChanged", (accounts) => {
        const account = accounts[0];
        updateBalance(account);
      });

    } catch (error) {
      console.error(error);
    }
  };

  // Deposit BNB to purchase tokens
  const deposit = async () => {
    try {
      const value = web3.utils.toWei(amount, "ether");
      await contract.methods.deposit().send({ from: window.ethereum.selectedAddress, value: value });
      setStatus("Deposit successful");
      updateBalance(window.ethereum.selectedAddress);
    } catch (error) {
      console.error(error);
      setStatus("Deposit failed");
    }
  };

  // Stop the ICO
  const stopICO = async () => {
    try {
      await contract.methods.stopICO().send({ from: window.ethereum.selectedAddress });
      setStatus("ICO stopped");
    } catch (error) {
      console.error(error);
      setStatus("Failed to stop ICO");
    }
  };

  // Withdraw funds
  const withdraw = async () => {
    try {
      await contract.methods.withdraw().send({ from: window.ethereum.selectedAddress });
      setStatus("Withdrawal successful");
      updateBalance(window.ethereum.selectedAddress);
    } catch (error) {
      console.error(error);
      setStatus("Failed to withdraw");
    }
  };

  // Claim tokens after the ICO has ended
  const claim = async () => {
    try {
      await contract.methods.claim().send({ from: window.ethereum.selectedAddress });
      setStatus("Tokens claimed");
      updateBalance(window.ethereum.selectedAddress);
    } catch (error) {
      console.error(error);
      setStatus("Failed to claim tokens");
    }
  };

  return (
    <div>
      <p>Your token balance: {balance}</p>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleAccountRequest}>Connect Wallet</button>
      <button onClick={deposit}>!Deposit!</button>
      <button onClick={stopICO}>Stop ICO</button>
      <button onClick={withdraw}>Withdraw</button>
      <button onClick={claim}>Claim Tokens</button>
      <p>{status}</p>
    </div>
  );
};

export default ContractInteraction;