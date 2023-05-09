import React, { useState, useEffect } from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const Clock: React.FC = () => {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const timerID = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timerID);
	}, []);

	return (
		<Paragraph style={{ textAlign: "center" }}>
			<Title level={2}>Current Time:</Title>
			<Title level={3}>{time.toUTCString()}</Title>
		</Paragraph>
	);
};

export default Clock;
