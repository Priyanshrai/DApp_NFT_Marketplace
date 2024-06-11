// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./NFT.sol"; // Import the NFT contract
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct NFTDetails {
        address owner;
        uint price;
        bool isForSale;
    }

    mapping(uint => NFTDetails) public nfts;

    NFT public nftContract;

    event NFTMinted(uint tokenId, address owner);
    event NFTForSale(uint tokenId, uint price);
    event NFTSold(uint tokenId, address newOwner);

    constructor(address _nftContract) {
        nftContract = NFT(_nftContract);
    }

    function mintNFT(string memory tokenURI, uint price) public onlyOwner {
        uint tokenId = nftContract.createNFT(tokenURI);
        nfts[tokenId] = NFTDetails(msg.sender, price, true);
        emit NFTMinted(tokenId, msg.sender);
    }

    function listNFTForSale(uint tokenId, uint price) public {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT for sale");
        nfts[tokenId].price = price;
        nfts[tokenId].isForSale = true;
        emit NFTForSale(tokenId, price);
    }

    function buyNFT(uint tokenId) public payable {
        require(nfts[tokenId].isForSale, "NFT is not for sale");
        require(msg.value >= nfts[tokenId].price, "Insufficient funds");

        address seller = nfts[tokenId].owner;
        nfts[tokenId].owner = msg.sender;
        nfts[tokenId].isForSale = false;

        nftContract.safeTransferFrom(seller, msg.sender, tokenId);
        payable(seller).transfer(msg.value);

        emit NFTSold(tokenId, msg.sender);
    }
}
