import { ethers } from "ethers";
import { stakingICOAddress, stakingICOAbi } from "./constants";
// import React from "react";
// import { message } from "antd";

async function loadContract(signer, chainId, setContract, address) {
	// const [messageApi, contextHolder] = message.useMessage();

	// {
	// 	contextHolder;
	// }

	// if (chainId !== 5) {
	// 	// messageApi.open({
	// 	// 	type: "error",
	// 	// 	content:
	// 	// 		"Please Change your network to Goerli Network for Buying Tokens"
	// 	// });
	// 	alert("Chain id error");
	// 	return;
	// }
	const _stknICOContract = new ethers.Contract(
		stakingICOAddress,
		stakingICOAbi,
		signer
	);

	setContract({
		stknICO: _stknICOContract
	});

	//Read From Contract

	const tokensAvailable = ethers.utils.formatEther(
		await _stknICOContract.getICOTokenBalance()
	);

	const investorBalance = ethers.utils.formatEther(
		await _stknICOContract.investorBalanceOf(address)
	);

	return {
		tokensAvailable,
		investorBalance
	};
}

export default loadContract;
