import React, { useState, useContext } from "react";
import { Input, Button, Row, Col, Statistic, Card, message } from "antd";
import GlobalContext from "../../context/GlobalContext";

const MyComponent = () => {
	const { web3, contract, updateBalance } = useContext(GlobalContext);

	const [value, setValue] = useState("");
	const [messageApi, contextHolder] = message.useMessage();

	const handleInputChange = e => {
		const inputValue = e.target.value;
		setValue(inputValue);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		console.log(value); // Do something with the input value
		if (!isNaN(value)) {
			// check if input is a number
			console.log(typeof value, value);
			try {
				const _value = web3.utils.toWei(value, "ether");
				await contract.methods.deposit().send({
					from: window.ethereum.selectedAddress,
					value: _value
				});

				messageApi.open({
					type: "success",
					content: "Deposit success"
				});
				updateBalance(window.ethereum.selectedAddress);
			} catch (error) {
				console.log(error);
				messageApi.open({
					type: "error",
					content: "Deposit failed"
				});
			}
		}
	};

	return (
		<>
			{contextHolder}
			<Row gutter={16} justify="space-around" align="middle">
				<Col span={8}>
					<Card bordered={false}>
						<Statistic
							title="Total Deposit"
							value={56}
							precision={2}
							valueStyle={{ color: "#3f8600" }}
							prefix="$"
						/>
					</Card>
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", gap: "10px", marginTop: 16 }}
					>
						<Input
							placeholder="Enter amount here"
							value={value}
							onChange={handleInputChange}
							style={{ flex: 1 }}
						/>
						<Button type="primary" htmlType="submit">
							Deposit
						</Button>
					</form>
				</Col>
			</Row>
		</>
	);
};

export default MyComponent;
