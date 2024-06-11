import React, { useState, useEffect, useContext } from 'react';
import { EthContext } from '../contexts/EthContext';
import NFTContract from '../contracts/NFT.json';
import MarketplaceContract from '../contracts/NFTMarketplace.json';
import './Marketplace.css'; // Import the CSS file

const Marketplace = () => {
  const { state } = useContext(EthContext);
  const { web3, accounts } = state;
  const [nfts, setNfts] = useState([]);
  const [newTokenURI, setNewTokenURI] = useState('');
  const [newTokenPrice, setNewTokenPrice] = useState('');
  const [nftContract, setNftContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);

  useEffect(() => {
    const initializeContracts = async () => {
      if (web3 && accounts && accounts.length > 0) {
        const networkId = await web3.eth.net.getId();
        const deployedNetworkNFT = NFTContract.networks[networkId];
        const deployedNetworkMarketplace = MarketplaceContract.networks[networkId];

        if (deployedNetworkNFT && deployedNetworkMarketplace) {
          const nftContractInstance = new web3.eth.Contract(
            NFTContract.abi,
            deployedNetworkNFT.address
          );
          const marketplaceContractInstance = new web3.eth.Contract(
            MarketplaceContract.abi,
            deployedNetworkMarketplace.address
          );
          setNftContract(nftContractInstance);
          setMarketplaceContract(marketplaceContractInstance);
          console.log("Contracts initialized", { nftContractInstance, marketplaceContractInstance });
        } else {
          console.error('Contracts not deployed on the current network');
        }
      }
    };

    initializeContracts();
  }, [web3, accounts]);

  const mintNFT = async () => {
    if (nftContract && accounts && accounts.length > 0 && newTokenURI && newTokenPrice) {
      try {
        console.log("Minting NFT with", { newTokenURI, newTokenPrice });
        await nftContract.methods.createNFT(newTokenURI).send({
          from: accounts[0]
        });
        const tokenId = await nftContract.methods.tokenCounter().call();
        await marketplaceContract.methods.mintNFT(newTokenURI, web3.utils.toWei(newTokenPrice, 'ether')).send({
          from: accounts[0]
        });
        setNewTokenURI('');
        setNewTokenPrice('');
        loadNFTs();
        console.log("NFT minted successfully with tokenId", tokenId);
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    } else {
      console.error("Minting conditions not met", { nftContract, accounts, newTokenURI, newTokenPrice });
    }
  };

  const loadNFTs = async () => {
    if (marketplaceContract && accounts && accounts.length > 0) {
      try {
        const nfts = await marketplaceContract.methods.getAllNFTs().call();
        setNfts(nfts);
        console.log("NFTs loaded", nfts);
      } catch (error) {
        console.error("Error loading NFTs:", error);
      }
    }
  };

  const buyNFT = async (tokenId, price) => {
    if (marketplaceContract && accounts && accounts.length > 0) {
      try {
        console.log("Buying NFT with tokenId", tokenId, "and price", price);
        await marketplaceContract.methods.buyNFT(tokenId).send({
          from: accounts[0],
          value: price
        });
        loadNFTs();
        console.log("NFT bought successfully with tokenId", tokenId);
      } catch (error) {
        console.error("Error buying NFT:", error);
      }
    }
  };

  useEffect(() => {
    if (marketplaceContract && accounts && accounts.length > 0) {
      loadNFTs();
    }
  }, [marketplaceContract, accounts, loadNFTs]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">NFT Marketplace</h1>
     
      <div className="instructions card mb-4">
        <div className="card-body">        
          <h5 className="card-title">Instructions</h5>
          <p>Welcome to the NFT Marketplace! Follow these steps to get started:</p>
          <ol>
            <li>Ensure you have MetaMask installed and connected to the appropriate network.</li>
            <li>Mint a new NFT by entering the token URI and the price in ETH.</li>
            <li>View available NFTs and purchase the ones you like.</li>
          </ol>
          <p>If you encounter any issues, check the console for error messages and ensure your contracts are deployed correctly.</p>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Mint a New NFT</h5>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={newTokenURI}
              onChange={(e) => setNewTokenURI(e.target.value)}
              placeholder="Enter Token URI"
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={newTokenPrice}
              onChange={(e) => setNewTokenPrice(e.target.value)}
              placeholder="Enter Token Price (in ETH)"
            />
          </div>
          <button className="btn btn-primary" onClick={mintNFT}>Mint NFT</button>
        </div>
      </div>

      <h2 className="text-center mb-4">Available NFTs</h2>
      <div className="row">
        {nfts.map((nft, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <img src={nft.tokenURI} className="card-img-top" alt="NFT" />
              <div className="card-body">
                <h5 className="card-title">NFT #{nft.tokenId}</h5>
                <p className="card-text">Price: {web3.utils.fromWei(nft.price, 'ether')} ETH</p>
                <button className="btn btn-success" onClick={() => buyNFT(nft.tokenId, nft.price)}>Buy</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
