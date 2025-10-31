"use client";


import './globals.css'
import styles from "./page.module.css";
import img from "../../public/buNhbF7.png"
import { proposal, ProposalTuple, VotesYypes } from "./types/contract.types";
import {
  CryptoDevsDAOAddress,
  CryptoDevsDAOABI,
  CryptoDevsNFTAddress,
  CryptoDevsNFTABI
} from "../../constants/Contract_info"
import { Hash , Abi , formatEther  } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState , useEffect } from "react";
import { useAccount , useBalance , useReadContract , useConfig } from "wagmi";
import { readContract , waitForTransactionReceipt , writeContract}  from "wagmi/actions"
import { useWriteContract  } from "wagmi";
// import  "./page.module.css";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
import Head from "next/head";
import Image from "next/image";


export default function Home() {
  const {address,isConnected} = useAccount();
  //
  const  [isMounted , setIsMounted] = useState(false);
  const [loading , setloading] = useState(false);
  const [fakenftid,setfakenftid] = useState("");
const config = useConfig()
  const [proposal , setproposal] = useState<proposal[]>([])
  
  const numOfProposalsInDAO  = useReadContract({
    address:CryptoDevsDAOAddress,
    abi:CryptoDevsDAOABI,
    functionName:"numProposals"
  })

  const nftBalenceOfUser = useReadContract({
    address:CryptoDevsNFTAddress,
    abi:CryptoDevsNFTABI,
    functionName:"balanceOf",
    args:[address || "0x0000000000000000000000000000000000000000"]
  })

  const daoBalance = useBalance({
    address:CryptoDevsDAOAddress
  })

  const daoOwwner = useReadContract({
    address:CryptoDevsDAOAddress,
    abi:CryptoDevsDAOABI,
    functionName:"owner"
  })

const {writeContract : writeContract1 , isSuccess , isPending} =  useWriteContract();
  async function createProposal() {
    
     setloading(true);
     try{
        const data = await writeContract(config , {
          address:CryptoDevsDAOAddress,
          abi:CryptoDevsDAOABI,
          functionName:"createPraposal",
          args:[BigInt(fakenftid)],
          maxFeePerGas: undefined, // Let wallet decide
          maxPriorityFeePerGas: undefined,
          
        })
          await waitForTransactionReceipt(config,{
          hash:data
        })
        console.log(data)
      
      
        
     }catch(error){
        console.log(error)
     }finally{
     setloading(false);
     }
  }

  async function fetchproposalbyid(id:number):Promise<proposal | undefined>{
    setloading(true);
    try {
      const [nftid , deadline , yayvotes ,nayvotes , executed ]  = await readContract(config,{
        address:CryptoDevsDAOAddress,
        abi:CryptoDevsDAOABI,
        functionName:"proposals",
        args:[BigInt(id)]
      })

      const parsedproposal:proposal = {
        proposalid:id,
        nftTokenid:Number(nftid),
        deadline: new Date(parseInt(deadline.toString()) * 1000),
        yayvotes:Number(yayvotes),
        nayvotes:Number(nayvotes),
        executed:executed
      }

      return parsedproposal;
    } catch (error) {
      console.log(error)
    }
    setloading(false);
  }


  async function fetchAllProposals():Promise<proposal[]| undefined> {
    setloading(true);
    try {
      const proposals:proposal[] = [];
      for(let i=0;i<Number(numOfProposalsInDAO.data);i++){
          const proposal = await fetchproposalbyid(i);
          if(proposal){
            proposals.push(proposal);
          }
      }
      setproposal(proposals);
      return  proposals;
    } catch (error) {
      console.log(error)
    }finally{
      setloading(false);
    }
    
  }

  async function voteOnProposal(proposalid :number, voteType:VotesYypes){
    setloading(true);
    try {
        const tx : Hash = await writeContract(config,{
          address:CryptoDevsDAOAddress,
          abi:CryptoDevsDAOABI,
          functionName:"VoteOnProposal",
          args:[BigInt(proposalid),voteType === "YAY" ? 0 : 1]
        });
        await waitForTransactionReceipt(config,{
          hash:tx
        })
    } catch (error) {
      console.log(error)
    }
    setloading(false);
  }

  async function executeProposal(proposalid:bigint){
    setloading(true);
    try {
      const tx :Hash = await writeContract(config,{
        address:CryptoDevsDAOAddress,
        abi:CryptoDevsDAOABI,
        functionName:"executeProposal",
        args:[proposalid]
      })
      
      await waitForTransactionReceipt(config,{
        hash:tx
      })
    } catch (error) {
      console.log(error)
    }
    setloading(false);
  }

  async function withdrawDAOEther(){
    setloading(true);
    try{
      const tx = await writeContract(config,{
        address:CryptoDevsDAOAddress,
        abi:CryptoDevsDAOABI,
        functionName:"withdrawether",
        args:[]
      });
      const { status } = await waitForTransactionReceipt(config,{
        hash:tx
      })
      if(status === "success"){
        console.log("Ether withdrawn successfully");
      }else{
        throw new Error("Failed to withdraw ether");
        // console.log("Failed to withdraw ether");
      }

    }catch(error){
      console.log(error)
    }
    setloading(false);
  }

  const [selectedtab , setselectedtab] = useState("");

  function renderTabs() {
    if(selectedtab === "Create Proposal"){
      return renderCreateProposalTab();
    }else if (selectedtab === "View Proposals"){
      return renderViewProposalTab();
    }
   return null;
  }

  function renderCreateProposalTab(){
    if(loading){
      return (
        <div className={styles.description}>
          Loading... Waiting for transaction
        </div>
      );
    }else if(nftBalenceOfUser.data === BigInt(0) ){
          return (
        <div className={styles.description}>
          You do not own any CryptoDevs NFTs. <br />
          <b>You cannot create or vote on proposals</b>
        </div>
      );
    }else {
      return (
        <div className={styles.container}>
          <label>Fake NFT Token ID to Purchase: </label>

          <input

            placeholder="0"
            type="number"
            value={fakenftid}

            onChange={(e) => setfakenftid(e.target.value)}
          />
          <button className={styles.button2} onClick={createProposal}>
            Create
          </button>
        </div>
      );
    }
  }

  function renderViewProposalTab(){
    if(loading){
      return(
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      );
    }else if(proposal.length === 0){
       return (<div className={styles.description}>No proposals have been created</div>)
    }else{
      return(
        <div>
          {
            proposal.map( (p:proposal , index) => (
              <div key={index}  className={styles.card}>
                <p>Proposal ID : {p.proposalid}</p>
                <p>Fake NFT ID : {p.nftTokenid}</p>
                <p>Yay Votes: {p.yayvotes}</p>
                <p>Nay Votes: {p.nayvotes}</p>
                <p>DEADLINE : {p.deadline.toLocaleString()}</p>
                <p>Executed : {p.executed.toString()}</p>
                {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalid, "YAY")}
                  >
                    Vote YAY
                  </button>
                  <button
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalid, "NAY")}
                  >
                    Vote NAY
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => executeProposal(BigInt(p.proposalid))}
                  >
                    Execute Proposal{" "}
                    {p.yayvotes > p.nayvotes ? "(YAY)" : "(NAY)"}
                  </button>
                </div>
              ) : (
                <div className={styles.description}>Proposal Executed</div>
              )}
              </div>
            ))}
        </div>
      )
    }
  }
  const [call , setcall] = useState(false)

   useEffect(    ()   => {
       fetchAllProposals(); 
  }, [selectedtab]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isConnected)
    return (
      <div>
        <ConnectButton />
      </div>
    );

// function handlecreateproposal(){
//   if(call){
//                 createProposal();
//             setcall(false);
//   }
// }
  return (


    <>
      <div className={styles.custom}>
        <img className={styles.image} src="https://i.imgur.com/buNhbF7.png" />
      <ConnectButton/>
      
      </div>
      
      {/* {console.log(isConnected ? "Connected" : "Not Connected")}
      {address}
       */}
       <div className={inter.className}>
          <Head >
          <title>CryptoDevs DAO</title>
          <meta name="description" content="CryptoDevs DAO" />
          </Head>
          <div className={styles.main}>
              <div className={styles.description}>Welcome to the DAO!</div>
              <div className={styles.description}>
                Your CryptoDevs NFT Balance: {nftBalenceOfUser.data?.toString()}
                <br />
                {daoBalance.data && (
                  <>
                    Treasury Balance:{" "}
                    {formatEther(daoBalance.data.value).toString()} ETH
                  </>
                )}
                <br />
                Total Number of Proposals: {numOfProposalsInDAO.data?.toString()}
              </div>
              <div className={styles.flex}>
                    <button
                      className={styles.button}
                      onClick={() => setselectedtab("Create Proposal")}
                    >
                      Create Proposal
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => setselectedtab("View Proposals")}
                    >
                  View Proposals
                  </button>
              </div>
                  {renderTabs()}
                  {address && address.toLowerCase() === daoOwwner.data?.toLowerCase() ? (
                    <div>
                      {loading ? (
                        <button className={styles.button}>Loading...</button>
                      ) : (
                        <button className={styles.button} onClick={withdrawDAOEther}>
                          Withdraw DAO ETH
                        </button>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
              </div>
              <div>
                {/* <Image 
                        className={styles.image}
                        src={img}
                        alt="Crypto Devs NFT"
                      />  */}
                
               </div>
            
        </div> 

    </>

  )
}
