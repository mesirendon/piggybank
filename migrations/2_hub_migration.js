const Hub = artifacts.require("Hub");

module.exports = function (deployer) {
  deployer.deploy(Hub);
};
