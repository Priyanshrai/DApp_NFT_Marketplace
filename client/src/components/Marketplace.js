import React, { useState, useEffect, useContext } from 'react';
import { EthContext } from '../contexts/EthContext';
import Web3 from 'web3';
import NFTContract from '../contracts/NFT.json';
import MarketplaceContract from '../contracts/NFTMarketplace.json';
import './Marketplace.css'; // Import the CSS file

const Marketplace = () => {
  const { web3, accounts } = useContext(EthContext);
  const [nfts, setNfts] = useState([]);
  const [newTokenURI, setNewTokenURI] = useState('');
  const [newTokenPrice, setNewTokenPrice] = useState('');
  const [contract, setContract] = useState(null);
  const [marketplace, setMarketplace] = useState(null);

  useEffect(() => {
    const initializeContracts = async () => {
      if (web3) {
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
          setContract(nftContractInstance);
          setMarketplace(marketplaceContractInstance);
        } else {
          console.error('Contracts not deployed on the current network');
        }
      }
    };

    initializeContracts();
  }, [web3]);

  const mintNFT = async () => {
    if (contract && accounts.length > 0 && newTokenURI && newTokenPrice) {
      try {
        await contract.methods.createNFT(newTokenURI).send({
          from: accounts[0],
          gas: 300000,
          gasPrice: web3.utils.toWei('20', 'gwei')
        });
        const tokenId = await contract.methods.tokenCounter().call();
        await marketplace.methods.mintNFT(newTokenURI, web3.utils.toWei(newTokenPrice, 'ether')).send({
          from: accounts[0],
          gas: 300000,
          gasPrice: web3.utils.toWei('20', 'gwei')
        });
        setNewTokenURI('');
        setNewTokenPrice('');
        loadNFTs();
      } catch (error) {
        console.error("Error minting NFT: ", error);
      }
    }
  };

  const loadNFTs = async () => {
    if (marketplace && accounts.length > 0) {
      try {
        const nfts = await marketplace.methods.getAllNFTs().call();
        setNfts(nfts);
      } catch (error) {
        console.error("Error loading NFTs: ", error);
      }
    }
  };

  const buyNFT = async (tokenId, price) => {
    if (marketplace && accounts.length > 0) {
      try {
        await marketplace.methods.buyNFT(tokenId).send({
          from: accounts[0],
          value: price,
          gas: 300000,
          gasPrice: web3.utils.toWei('20', 'gwei')
        });
        loadNFTs();
      } catch (error) {
        console.error("Error buying NFT: ", error);
      }
    }
  };

  useEffect(() => {
    loadNFTs();
  }, [marketplace, accounts]);

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
