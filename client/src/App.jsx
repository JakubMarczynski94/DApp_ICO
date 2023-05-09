import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import GlobalContext from "./context/GlobalContext";
import connectWallet from "./utils/connectWallet";
import loadContract from "./utils/loadContract";

import MyHeader from "./components/common/HeaderCompo";
import AppHome from "./views/Home";

function App() {
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [account, setAccount] = useState({
		address: null,
		balance: null,
		chainID: null
	});

	const [contract, setContract] = useState(null);
	const [icoState, setIcoState] = useState({
		tokensAvailable: null,
		investorBalance: null
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
			handleConnectWallet();
		}
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	const handleConnectWallet = async () => {
		const {
			_provider,
			_signer,
			_address,
			_balance,
			_chainId
		} = await connectWallet(handleConnectWallet);

		// const { tokensAvailable, investorBalance } = await loadContract(
		// 	_signer,
		// 	_chainId,
		// 	setContract,
		// 	_address
		// );

		setProvider(_provider);
		setSigner(_signer);
		setAccount({
			address: _address,
			balance: _balance,
			chainID: _chainId
		});

		// setIcoState({
		// 	tokensAvailable,
		// 	investorBalance
		// });
	};

	return (
		<GlobalContext.Provider
			value={{
				provider,
				setProvider,
				signer,
				setSigner,
				account,
				setAccount,
				handleConnectWallet,
				contract,
				setContract,
				icoState,
				setIcoState,
				loading,
				setLoading
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
