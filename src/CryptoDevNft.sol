// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
contract CryptoDevNft is ERC721Enumerable {

    constructor() ERC721("CRYPTO DEV","CD"){

    }

    function mintNFT() external {
        _safeMint(msg.sender, this.totalSupply()+1);
    }
    
}