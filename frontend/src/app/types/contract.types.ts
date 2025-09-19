
export type proposal = {
    proposalid:number,
    nftTokenid:number,
    deadline:Date,
    yayvotes:number,
    nayvotes:number,
    executed:boolean
}



export type ProposalTuple = [
  nftId: number,
  deadline: number,
  yayVotes: number,
  nayVotes: number,
  executed: boolean
];

export  type VotesYypes= "YAY" | "NAY"