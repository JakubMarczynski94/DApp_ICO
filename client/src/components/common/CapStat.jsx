import React, { useEffect, useContext } from "react";
import { Typography, Row, Col, Progress } from "antd";
import GlobalContext from "../../context/GlobalContext";

const { Title, Paragraph, Text, Link } = Typography;

const App = () => {
	const {
		contract,
		softCap,
		setSoftCap,
		hardCap,
		setHardCap,
		depositAmount
	} = useContext(GlobalContext);

	const fetchcap = async () => {
		const softCap = await contract.methods.softCap().call();
		console.log(softCap);
		setSoftCap(softCap);
		const hardCap = await contract.methods.hardCap().call();
		setHardCap(hardCap);
		console.log(hardCap);
	};

	useEffect(() => {
		fetchcap();
	}, []);

	return (
		<>
			<Row gutter={16} justify="space-around" align="middle">
				<Col span={8}>
					<Typography>
						<Title level={3}>Cap Status</Title>
						<Title level={4}>SoftCap: {softCap}</Title>
						<Title level={4}>HardCap: {hardCap}</Title>
						<Paragraph>
							<Progress
								percent={(depositAmount / hardCap) * 100}
								status="active"
								success={{
									percent: hardCap
										? (Math.min(softCap, depositAmount) /
												hardCap) *
										  100
										: 100
								}}
								// strokeColor={{ from: "#108ee9", to: "#87d068" }}
							/>
						</Paragraph>
					</Typography>
				</Col>
			</Row>
		</>
	);
};

export default App;
