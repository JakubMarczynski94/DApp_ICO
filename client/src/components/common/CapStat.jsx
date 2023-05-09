import React from "react";
import { Typography, Row, Col, Progress } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

const App = () => (
	<>
		<Row gutter={16} justify="space-around" align="middle">
			<Col span={8}>
				<Typography>
					<Title level={3}>Cap Status</Title>
					<Paragraph>
						<Progress
							percent={75}
							status="active"
							strokeColor={{ from: "#108ee9", to: "#87d068" }}
						/>
					</Paragraph>
				</Typography>
			</Col>
		</Row>
	</>
);

export default App;
