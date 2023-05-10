const hre = require("hardhat");

async function main() {

  const ICO = await hre.ethers.getContractFactory("ICO");
  const ico = await ICO.deploy();
  await ico.deployed();
  console.log("ICO deployed to:", ico.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });