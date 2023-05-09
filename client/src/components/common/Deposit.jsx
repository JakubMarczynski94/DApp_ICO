import React, { useState } from "react";
import { Input, Button, Row, Col, Statistic, Card } from "antd";

const MyComponent = () => {
	const [value, setValue] = useState("");

	const handleInputChange = e => {
		setValue(e.target.value);
	};

	const handleSubmit = e => {
		e.preventDefault();
		console.log(value); // Do something with the input value
	};

	return (
		<Row gutter={16} justify="space-around" align="middle">
			<Col span={8}>
				<Card bordered={false}>
					<Statistic
						title="Total Deposit"
						value={11.28}
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
						placeholder="Enter text here"
						value={value}
						onChange={handleInputChange}
						style={{ flex: 1 }}
					/>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</form>
			</Col>
		</Row>
	);
};

export default MyComponent;
