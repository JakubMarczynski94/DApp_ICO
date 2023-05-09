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

	const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	const abi = ICO.abi;

	const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

	// Create an instance of the contract
	const contract = new web3.eth.Contract(abi, contractAddress);

	const updateBalance = async account => {
		const balance = await contract.methods.balanceOf(account).call();
		setBalance(balance);
	};

	const getStartDate = async () => {
		const _startDate = await contract.methods
			.getICODate()
			.send({ from: window.ethereum.selectedAddress });
		console.log("startdate: ", _startDate);
		return startDate;
	};

	const startDate = getStartDate();

	// useEffect(() => {
	// 	const getICOStat = async () => {
	// 		try {
	// 			const stat = await contract.methods
	// 				.getICOState()
	// 				.send({ from: window.ethereum.selectedAddress });
	// 			console.log("icostat: ", stat);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};
	// 	getICOStat();
	// }, []);

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
				startDate
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
