import {dotenv} from "config";
import scripts from "bitcore-lib/lib/script";
import { StacksTestnet } from '@stacks/network';
import {BitcoinChainEvent} from "@hirosystems/orchestra-types";
import {
  getNonce,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  addressFromHashMode,
  AddressHashMode,
  TransactionVersion,
  standardPrincipalCVFromAddress,
  addressToString,
} from '@stacks/transactions';

const main = (address) => {
  
  //an object containing contract address,name and token name of the contract
  const Contract = {
    contractAddress: "",
    contractName: "",
    tokenName:""
  }

  //Bitcoin node URL
  const BITCOIN_NODE_URL = "http://localhost:18443";

  module.exports.
}