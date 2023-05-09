import React, { useContext, useState } from "react";
import { Divider } from "antd";

import Clock from "../common/Clock";
import Deposit from "../common/Deposit";
import CapStat from "../common/CapStat";
import CountdownTimer from "../common/CountdownTimer";
import GlobalContext from "../../context/GlobalContext";

const AppHero = () => {
	const { startDate } = useContext(GlobalContext);

	const [startTime] = useState(new Date(startDate));
	const [endTime] = useState(new Date("May 8, 2023 11:30:00"));

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
