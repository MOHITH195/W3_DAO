// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {CryptoDevsDAO} from "../src/CryptoDevsDAO.sol";
import {CryptoDevNft} from "../src/CryptoDevNft.sol";
import {FakeNftMarketPlace} from "../src/FakeNFTMarketplace.sol";

contract CryptoDevsDAOTest is Test {
    CryptoDevsDAO public dao;
    CryptoDevNft public nft;
    FakeNftMarketPlace public marketplace;
    
    address public owner = address(1);
    address public nftHolder = address(2);
    address public nonNftHolder = address(3);
    
    uint256 public constant NFT_PRICE = 0.01 ether;
    uint256 public constant PROPOSAL_DURATION = 5 minutes;

    function setUp() public {
        // Deploy contracts
        nft = new CryptoDevNft();
        marketplace = new FakeNftMarketPlace();
        
        // Deploy DAO with initial funding
        vm.deal(owner, 1 ether);
        vm.startPrank(owner);
        dao = new CryptoDevsDAO{value: 0.5 ether}(address(marketplace), address(nft));
        vm.stopPrank();
        
        // Setup NFT holder
        vm.startPrank(nftHolder);
        nft.mintNFT();
        vm.stopPrank();
        
        // Verify setup
        assertEq(nft.balanceOf(nftHolder), 1);
        assertEq(nft.balanceOf(nonNftHolder), 0);
        assertEq(address(dao).balance, 0.5 ether);
    }

    // function test_CreateProposal_Success() public {
    //     uint256 nftId = 1; // NFT ID to propose purchasing
        
    //     vm.startPrank(nftHolder);
    //     uint256 proposalId = dao.createPraposal(nftId);
    //     vm.stopPrank();
        
    //     assertEq(proposalId, 0);
    //     assertEq(dao.numProposals(), 1);
        
    //     (uint256 storedNftId, uint256 deadline, uint256 yayVotes, uint256 nayVotes, bool executed) = dao.proposals(0);
    //     assertEq(storedNftId, nftId);
    //     assertEq(deadline, block.timestamp + PROPOSAL_DURATION);
    //     assertEq(yayVotes, 0);
    //     assertEq(nayVotes, 0);
    //     assertEq(executed, false);
    // }
}
