require('dotenv').config();
import { BitcoinChainEvent} from "@hirosystems/orchestra-types";
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
import { StacksTestnet } from '@stacks/network';
const Script = require('bitcore-lib/lib/script');

interface HttpEvent {
  routeKey: string,
  body: string
  authorization: string,
}

const Contract = {
  contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  contractName: "minter",
  assetName: "minter"
}

const STACKS_NODE_URL = "http://localhost:20443";


module.exports.minter = async (event: HttpEvent) => {
  let chainEvent: BitcoinChainEvent = JSON.parse(event.body);
  
  // In this protocol, we're assuming that BTC transactions include 2 outputs:
  // - 1 funding the authority address
  // - 1 getting the change. p2pkh is being expected on this 2nd output
  // that we're using for inferring the Stacks address to fund.
  let satsAmount = chainEvent.apply[0].transaction.metadata.outputs[0].value;

  if (satsAmount != 100000000) {
    return {
      statusCode: 301,
    }
  }
  //get bitcoin address
  let recipientPubkey = chainEvent.apply[0].transaction.metadata.outputs[1].script_pubkey;

  // Build Stack address
  /// replace recipientPubkey with recipientyour bitcoin address
  let script = Script.fromBuffer(Buffer.from(recipientPubkey, "hex"));
  let hashBytes = script.getPublicKeyHash().toString('hex');
  let recipientAddress = addressFromHashMode(AddressHashMode.SerializeP2PKH, TransactionVersion.Testnet, hashBytes)

  // Build a Stacks transaction
  const network = new StacksTestnet({ url: STACKS_NODE_URL });
  //use user address to build transaction
  const nonce = await getNonce(addressToString(recipientAddress), network);
  const txOptions = {
    contractAddress: Contract.contractAddress,
    contractName: Contract.contractName,
    functionName: "claim",
    functionArgs: [],
    fee: 1000,
    nonce,
    network,
    anchorMode: AnchorMode.OnChainOnly,
    postConditionMode: PostConditionMode.Allow,
    senderKey: process.env.AUTHORITY_SECRET_KEY!,
  };
  const tx = await makeContractCall(txOptions);

  // Broadcast transaction to our Devnet stacks node
  const result = await broadcastTransaction(tx, network)

  console.log("Result: ", result);
  

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        result: result,
      },
      null,
      2
    ),
  };
};