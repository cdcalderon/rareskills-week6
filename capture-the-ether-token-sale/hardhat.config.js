require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      {
        version: "0.8.15",
      },
      {
        version: "0.7.3",
      },
      {
        version: "0.4.21",
      },
    ],
  },
};
