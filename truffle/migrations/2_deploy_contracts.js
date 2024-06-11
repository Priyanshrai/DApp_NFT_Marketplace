const NFT = artifacts.require("NFT");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function (deployer) {
  await deployer.deploy(NFT);
  const nft = await NFT.deployed();
  await deployer.deploy(NFTMarketplace, nft.address);
};
