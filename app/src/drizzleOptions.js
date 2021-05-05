import ComplexStorage from './contracts/ComplexStorage.json';
import SimpleStorage from './contracts/SimpleStorage.json';
import TutorialToken from './contracts/TutorialToken.json';
import BicycleOwnership from './contracts/BicycleOwnership.json';

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:9545',
    },
  },
  contracts: [SimpleStorage, ComplexStorage, TutorialToken, BicycleOwnership],
  events: {
    SimpleStorage: ['StorageSet'],
  },
  polls: { blocks: 3000, accounts: 1000 },
};

export default options;
