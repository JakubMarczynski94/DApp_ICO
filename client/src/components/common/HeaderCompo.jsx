import React, { useContext } from "react";
import { Layout, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Web3 from "web3";

import GlobalContext from "../../context/GlobalContext";

const { Header } = Layout;

const MyHeader = () => {
	const { web3, account, setAccount, updateBalance } = useContext(
		GlobalContext
	);

	const handleConnectWallet = async () => {
		try {
			// Get the user's account address from MetaMask
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts"
			});
			const account = accounts[0];
			setAccount(account);

			// Call the updateBalance function to get the initial token balance
			await updateBalance(account);

			// Set up event listener for account change using the on() method
			window.ethereum.on("accountsChanged", accounts => {
				const account = accounts[0];
				updateBalance(account);
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Header
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center"
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center"
				}}
			>
				<Avatar
					src={
						"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0FkTcjO3TpjKLOFu04gxmm-XcnY8lBfvuRPkN2UcOMg&s"
					}
					size="large"
					style={{ marginRight: "8px" }}
				/>
			</div>
			{account ? (
				// `${account.address.substring(
				// 	0,
				// 	6
				// )}......${account.address.substring(36, 42)}`
				<Button type="primary" onClick={() => alert("disconnect")}>
					Disconnect
				</Button>
			) : (
				<Button type="primary" onClick={handleConnectWallet}>
					Connect
				</Button>
			)}
		</Header>
	);
};

export default MyHeader;
