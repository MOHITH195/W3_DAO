// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {CryptoDevsDAO} from "../src/CryptoDevsDAO.sol";

contract CounterScript is Script {
    

    function setUp() public {}

    function run() public {
        address nftaddress = vm.envAddress("NFT");
        address marketplace = vm.envAddress("MARKETPLACE");
        vm.startBroadcast();

        CryptoDevsDAO dao = new CryptoDevsDAO{value:0.2 ether}(marketplace, nftaddress);

        vm.stopBroadcast();
    }
}
