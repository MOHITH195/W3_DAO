// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

// Replace this line with the Interfaces
// import "./CryptoDevNft.sol";
// import "./FakeNFTMarketplace.sol";

interface ICryptoDevNft {
    
    function mintNFT() external;

    function balanceOf (address owner) external view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);
}

interface IFakeNftMarketPlace{
    
    function purchase(uint _tokenid) external payable;
    function getPrice() external view returns (uint256);
    function available(uint _tokenid) external view returns (bool);
}


    struct Proposal {
    uint nftid;
    uint deadline;
    uint yayvotes;
    uint nayvotes;
    bool executed;
    mapping(uint256 => bool) voters;

}
contract CryptoDevsDAO is Ownable  {
    
     enum VoteOption {
        YAY,
        NAY
    }
    ICryptoDevNft public cryptodrvnft;
    IFakeNftMarketPlace public fakenftmarkrtplace;
    mapping (uint256 => Proposal) public proposals;
    uint256 public numProposals;

    constructor(address _nftmarketplace , address _cryptodevnft) Ownable(msg.sender) payable{
            fakenftmarkrtplace = IFakeNftMarketPlace(_nftmarketplace);
            cryptodrvnft = ICryptoDevNft(_cryptodevnft);
        }

    modifier nftHolderOnly(){
        require(cryptodrvnft.balanceOf(msg.sender) > 0 , "You must own a cryptodev nft to vote on proposals");
        _;
    }

    function createPraposal(uint256 _nftid) external nftHolderOnly returns (uint256){
       require(fakenftmarkrtplace.available(_nftid),"NFT IS NOT AVALIBILE TO PURCAHSE");
        Proposal storage proposals = proposals[numProposals];
        proposals.nftid = _nftid;
        proposals.deadline = block.timestamp + 5 minutes;
        numProposals++;
        return numProposals - 1; // Return the proposal ID
    }

    modifier activeProposal(uint _proposalid){
        require(proposals[_proposalid].deadline > block.timestamp, "proposal is inactive , and Exipired");
        _;
    }

    function VoteOnProposal(uint _proposalid,VoteOption  _voteoption) external nftHolderOnly activeProposal(_proposalid) {
        Proposal storage proposal = proposals[_proposalid];
        // require(!proposal.voters[msg.sender],"You HAAve already Voted on thid proposal");

        uint256  voterNFTBalance = cryptodrvnft.balanceOf(msg.sender);
        uint numVotes;
        for(uint i=0; i<voterNFTBalance;i++){
            uint256 tokenid = cryptodrvnft.tokenOfOwnerByIndex(msg.sender, i);
            if(!proposal.voters[tokenid]){
                numVotes++;
                proposal.voters[tokenid] = true;
            }
        }
        require(numVotes > 0 , "You have already voted on this proposal");

        if(_voteoption == VoteOption.YAY){
            proposal.yayvotes += numVotes;
        }else{
            proposal.nayvotes += numVotes;
        }

    }

    // modifier inactiveProposal(uint _proposalid){
    //     Proposal storage proposal = proposals[_proposalid];
    //     require(proposal.deadline <= block.timestamp,"proposal is still active");

    // }
    
    modifier inactiveProposal(uint _proposalid){
        Proposal storage proposal = proposals[_proposalid];

        require(proposal.deadline <= block.timestamp, "Proposal is still active");
        require(proposal.executed == false, "Proposal has already been executed");
        _;
    }

    function executeProposal(uint _proposalid) external nftHolderOnly inactiveProposal(_proposalid){
        Proposal storage proposal = proposals[_proposalid];
        if(proposal.yayvotes > proposal.nayvotes){
            uint nftprice = fakenftmarkrtplace.getPrice();
            require(address(this).balance >=nftprice,"Not enough funds to purchase DAO" );            
            fakenftmarkrtplace.purchase{value:nftprice}(proposal.nftid);
        }
        proposal.executed=true;
    }

    function withdrawether() external onlyOwner(){
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");
        (bool sent ,) = payable(owner()).call{value:amount}("");
        require(sent, "Failed to withdraw ether");

    }

    receive() external payable {}

    fallback() external payable {}
    
}