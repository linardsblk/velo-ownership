const BicycleOwnership = artifacts.require('BicycleOwnership');

module.exports = function (deployer) {
  deployer.deploy(BicycleOwnership);
};
