import BicycleOwnership from './contracts/BicycleOwnership.json';

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545',
    },
  },
  contracts: [BicycleOwnership],
  syncAlways: true,
  polls: { blocks: 3000 },
};

export default options;
