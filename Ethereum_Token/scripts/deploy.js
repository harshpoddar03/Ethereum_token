const hre = require("hardhat");

async function main() {
    const DevToken = await hre.ethers.getContractFactory("DevToken");
    const devtoken = await DevToken.deploy(100000000, 50);

    // Wait for the contract to be deployed
    await devtoken.waitForDeployment();

    // Get the contract address
    const devtokenAddress = await devtoken.getAddress();

    console.log("DevToken deployed to:", devtokenAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});