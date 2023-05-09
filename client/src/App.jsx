import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import GlobalContext from "./context/GlobalContext";
// import connectWallet from "./utils/connectWallet";
import Web3 from "web3";
import ICO from "./utils/ICO.json";

import MyHeader from "./components/common/HeaderCompo";
import AppHome from "./views/Home";

function App() {
	const [balance, setBalance] = useState(0);
	const [amount, setAmount] = useState(0);
	const [account, setAccount] = useState("");
	const [icoState, setIcoState] = useState("");
	const [startTime, setStartTime] = useState(0);
	const [endTime, setEndTime] = useState(0);
	const [depositAmount, setDepositAmount] = useState(0);
	const [softCap, setSoftCap] = useState(0);
	const [hardCap, setHardCap] = useState(0);

	const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
	const abi = ICO.abi;

	const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

	// Create an instance of the contract
	const contract = new web3.eth.Contract(abi, contractAddress);

	const updateBalance = async account => {
		const balance = await contract.methods.balanceOf(account).call();
		console.log("Balance: ", balance);
		setBalance(balance);
	};

	const fetchTime = async () => {
		const startTime = await contract.methods.startTime().call();
		setStartTime(startTime * 1000);
		const endTime = await contract.methods.endTime().call();
		setEndTime(endTime * 1000);
	};

	useEffect(() => {
		fetchTime();
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				web3,
				balance,
				setBalance,
				amount,
				setAmount,
				contract,
				updateBalance,
				account,
				setAccount,
				startTime,
				endTime,
				depositAmount,
				setDepositAmount,
				softCap,
				setSoftCap,
				hardCap,
				setHardCap
			}}
		>
			<Layout>
				<MyHeader />
				<Layout.Content>
					<AppHome />
				</Layout.Content>
			</Layout>
		</GlobalContext.Provider>
	);
}

export default App;
