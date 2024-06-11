# NFT Marketplace DApp

A decentralized NFT marketplace application built on the Ethereum blockchain using Solidity, React, Web3.js, and Bootstrap. This DApp allows users to mint, buy, and sell NFTs in a transparent and secure manner.

![NFT Marketplace DApp Screenshot](https://github.com/Priyanshrai/DApp_NFT_Marketplace/assets/105690577/06b7db3e-3c3d-4c8e-ab22-4313e6f3bac7)


## Features

- Mint new NFTs.
- Display NFTs in a marketplace.
- Allow users to buy and sell NFTs.
- Transparent and secure transactions using blockchain technology.

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Truffle (v5.x or later)
- Ganache (v6.x or later)
- MetaMask browser extension

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nft-marketplace-dapp.git
   cd nft-marketplace-dapp
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Navigate to the `client` directory and install its dependencies:**
   ```bash
   cd client
   npm install
   ```

## Setting Up the Development Environment

1. **Start Ganache:**
   ```bash
   ganache-cli
   ```

2. **Compile and deploy the smart contracts:**
   ```bash
   cd ..
   truffle compile
   truffle migrate
   ```

3. **Configure MetaMask:**
   - Open MetaMask and create a new custom network.
   - Set the network name to "Ganache" (or any desired name).
   - Set the RPC URL to `http://127.0.0.1:8545`.
   - Set the Chain ID to `1337` (or the ID displayed in Ganache).
   - Import one of the Ganache accounts into MetaMask using its private key.

4. **Update the `NFT.json` and `NFTMarketplace.json` files in the `client/src/contracts` directory:**
   - Copy the contract ABIs from the `build/contracts/NFT.json` and `build/contracts/NFTMarketplace.json` files.
   - Paste the ABIs into the respective files in the `client/src/contracts` directory.
   - Update the contract addresses in the respective files with the deployed contract addresses from Ganache.

## Running the Application

1. **Start the React development server:**
   ```bash
   cd client
   npm start
   ```

2. **Open your browser and navigate to `http://localhost:3000` to access the NFT Marketplace DApp.**

## Usage

- **Mint NFTs**: Enter the token URI and price in ETH, then click "Mint NFT".
- **Buy NFTs**: View available NFTs and click the "Buy" button next to an NFT to purchase it.

## Smart Contracts

The `NFT.sol` and `NFTMarketplace.sol` smart contracts are located in the `contracts` directory. They define the following functions:

### `NFT.sol`

- `createNFT(string memory tokenURI)`: Mints a new NFT with the given token URI.
- `tokenCounter()`: Returns the total number of NFTs minted.

### `NFTMarketplace.sol`

- `mintNFT(string memory tokenURI, uint price)`: Mints a new NFT and lists it for sale.
- `listNFTForSale(uint tokenId, uint price)`: Lists an existing NFT for sale.
- `buyNFT(uint tokenId)`: Buys an NFT listed for sale.

### Contract Logic & Limitations

This NFT marketplace system has the following rules and limitations:

- **Each user can mint new NFTs** by providing a token URI and setting a price.
- **Users can buy NFTs** listed in the marketplace by paying the specified price.
- **Transparency and security** are ensured by recording all transactions on the blockchain.
- **Users must have MetaMask** installed and connected to the appropriate network to interact with the DApp.

## Project Structure

- `contracts/`: Contains the Solidity smart contracts.
- `migrations/`: Contains migration scripts for deploying the smart contracts.
- `client/src/components/`: Contains the React components.
- `client/src/contracts/`: Contains the ABIs and contract addresses for interacting with the smart contracts.
- `client/src/Marketplace.css`: Contains the CSS for styling the Marketplace component.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

