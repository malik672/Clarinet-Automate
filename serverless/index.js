require("dotenv").config();
const scripts = require("bitcore-lib/lib/script");
import { StacksTestnet } from "@stacks/network";
import { BitcoinChainEvent } from "@hirosystems/orchestra-types";
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
} from "@stacks/transactions";

const main = async(address) => {
  //an object containing contract address,name and token name of the contract
  const Contract = {
    contractAddress: "",
    contractName: "",
    tokenName: "",
  };

  //Bitcoin node URL
  const BITCOIN_NODE_URL = "http://localhost:18443";
  const STACKS_NODE_URL = "http://localhost:20443";

  module.exports.minter = async (event) => {
    let chainEvent = JSON.parse(event.body);

    let satsAmount = chainEvent.apply[0].transaction.metadata.outputs[0].value;

    // Build Stack address
    let script = scripts.fromBuffer(Buffer.from(address, "hex"));
    let hashBytes = script.getPublicKeyHash().toString("hex");
    let recipientAddress = addressFromHashMode(
      AddressHashMode.SerializeP2PKH,
      TransactionVersion.Testnet,
      hashBytes
    );
  };

  const network = new StacksTestnet({url: STACKS_NODE_URL});
  const nonce = await getNonce(recipientAddress, network);
  const txOptions = {
    contractAddress: Contract.contractAddress,
    contractName: Contract.contractName,
    functionName: "mint",
    functionArgs:  [standardPrincipalCVFromAddress(recipientAddress)],
    fee: 1000,
    nonce,
    network,
    anchorMode: AnchorMode.OnChainOnly,
    postConditionMode: PostConditionMode.Allow,
    senderKey: "",
  }
  const tx = await makeContractCall(txOptions);

  // Broadcast transaction to our Devnet stacks node
  const result = await broadcastTransaction(tx, network);

  console.log("Result", result);

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
