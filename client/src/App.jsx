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
	const [status, setStatus] = useState("");
	const [account, setAccount] = useState("");

	const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
	const abi = ICO.abi;

	const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

	// Create an instance of the contract
	const contract = new web3.eth.Contract(abi, contractAddress);

	const updateBalance = async account => {
		const balance = await contract.methods.balanceOf(account).call();
		setBalance(balance);
	};

	return (
		<GlobalContext.Provider
			value={{
				web3,
				balance,
				setBalance,
				amount,
				setAmount,
				status,
				setStatus,
				contract,
				updateBalance,
				account,
				setAccount
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
