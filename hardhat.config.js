require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require('solidity-coverage');
require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-solhint');
require("@nomiclabs/hardhat-etherscan");

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_TEST_KEY = process.env.PRIVATE_TEST_KEY;

let nonDevelopmentNetworks = {}

// If we have a private key, we can setup non dev networks
if (PRIVATE_KEY) {
  nonDevelopmentNetworks = {
    mainnet: {
      gasPrice: 118000000000, // 20 gwei
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_TEST_KEY}`],
      gasPrice: 130000000000, // 13o gwei
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_TEST_KEY}`]
    },
    testnetbsc: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnetbsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnetfantom: {
      url: `https://rpc.ftm.tools/`,
      accounts: [`${PRIVATE_KEY}`]
    },
    testnetfantom: {
      url: `https://rpc.testnet.fantom.network/`,
      accounts: [`${PRIVATE_KEY}`]
    }
  }
}

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    currency: 'USD',
    enabled: false,
    gasPrice: 50
  },
  networks: {
    ...nonDevelopmentNetworks,
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    coverage: {
      url: 'http://localhost:8555',
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};
