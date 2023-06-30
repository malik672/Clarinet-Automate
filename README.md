# Clarinet-Automate
An application that uses chainhooks to mint Nfts to the user whenever a specified bitcoin address receives sats.

## What are chainhooks
Chainhook is a fork-aware transaction indexing engine aiming at helping developers focus on the information they need by helping with the on-chain data extraction. By focusing on the data they care about, developers work with much lighter datasets. <a href="https://docs.hiro.so/chainhooks/overview">learn more</a>

All onchain operation are done on clarinet devnet.

## How to use

Start a local Devnet with the command:

```bash
$ clarinet integrate

```
open another tab another tab in the terminal, then run:

```
$ cd serverless
$ yarn global add serverless    # Install serverless globally
$ yarn add --dev serverless-plugin-typescript@latest
$ yarn                          # Install dependencies

```

and making sure that the command `serverless` is available in your `$PATH`, the lambda functions can be started locally with the following command:

```bash
$ serverless offline --verbose

```

Once the message `Protocol deployed` appears on the screen, transfers tokens back and forth between the Bitcoin Blockchain and the Stacks Blockchain can be performed
thanks to the deployment plans:

- `deployments/minter.yaml`: a BTC transaction is being performed, using the following parameters:
```yaml
- btc-transfer:
    expected-sender: mjSrB3wS4xab3kYqFktwBzfTdPg367ZJ2d
    recipient: mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC
    sats-amount: 100000000
    sats-per-byte: 10

```
A chainhook predicate, specified in `chainhooks/minter.json` is observing BTC transfers being performed to the address `mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC` thanks to the following configuration:

```json
"if_this": {
    "scope": "outputs",
    "p2pkh": {
        "equals": "mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC"
    }
},
"then_that": {
    "http_post": {
        "url": "http://localhost:3000/api/v1/minter",
        "authorization_header": "Bearer cn389ncoiwuencr"
    }
}
```
Whenever this address receives btc, we mint nft to the stacks address of the equivalent using 

```
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

```
When the address process this chainhook occurences, it transfers btc to the address specified in the deployment plan.

The deployment plan can both be respectively performed with the command:

```bash
$ clarinet deployment apply -p deployments/minter.devnet.yaml
```
