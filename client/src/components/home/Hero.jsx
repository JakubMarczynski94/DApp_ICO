import React, { useContext, useState } from "react";
import { Divider } from "antd";

import Clock from "../common/Clock";
import Deposit from "../common/Deposit";
import CapStat from "../common/CapStat";
import CountdownTimer from "../common/CountdownTimer";
import GlobalContext from "../../context/GlobalContext";

const AppHero = () => {
	return (
		<>
			<Clock />
			<Divider />
			<Deposit />
			<Divider />
			<CapStat />
			<Divider />
			<CountdownTimer />
		</>
	);
};

export default AppHero;
