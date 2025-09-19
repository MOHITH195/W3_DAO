// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.13;

contract FakeNftMarketPlace {
    mapping(uint256 => address) public tokens;
    uint private price = 0.01 ether;

    function purchase(uint _tokenid) external payable {
        require(msg.value == price , "This NFT coste 0.01 ether");
        tokens[_tokenid] = msg.sender;
    }

    function getPrice() external view returns (uint256) {
        return price;
    }

    function available(uint _tokenid) external view returns (bool) {
        if(tokens[_tokenid] == address(0)){
            return true;
        }
        return false;
    }
        
}