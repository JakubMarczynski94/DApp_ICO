import React, { useContext } from "react";
import { Layout, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

import GlobalContext from "../../context/GlobalContext";

const { Header } = Layout;

const MyHeader = () => {
	const { provider, account, handleConnectWallet } = useContext(
		GlobalContext
	);

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
					icon={<UserOutlined />}
					size="large"
					style={{ marginRight: "8px" }}
				/>
				<span>My App</span>
			</div>
			{provider && account ? (
				`${account.address.substring(
					0,
					6
				)}......${account.address.substring(36, 42)}`
			) : (
				<Button
					type="primary"
					onClick={!provider ? handleConnectWallet : null}
				>
					Connect
				</Button>
			)}
		</Header>
	);
};

export default MyHeader;
