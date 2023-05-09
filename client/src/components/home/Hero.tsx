import React, { useState } from "react";
import { Divider } from "antd";

import Clock from "../common/Clock";
import Deposit from "../common/Deposit";
import CapStat from "../common/CapStat";
import CountdownTimer from "../common/CountdownTimer";

const AppHero: React.FC = () => {
	const [startTime] = useState<Date>(new Date("May 8, 2023 10:00:00"));
	const [endTime] = useState<Date>(new Date("May 8, 2023 11:30:00"));

	return (
		<>
			<Clock />
			<Divider />
			<Deposit />
			<Divider />
			<CapStat />
			<Divider />
			<CountdownTimer startTime={startTime} endTime={endTime} />
		</>
	);
};

export default AppHero;
