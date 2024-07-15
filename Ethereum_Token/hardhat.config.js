require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
  },
  // If you need to specify custom file names or contract names:
  // sourcesPath is the directory where your contracts are located
  // contractNames is an object mapping file names to contract names
  sourcesPath: "./contracts",
  contractNames: {
    "devtoken.sol": "DevToken"
  }
};