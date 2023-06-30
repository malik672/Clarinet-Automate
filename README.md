# Clarinet-Automate
An application that uses chainhooks to mint Nfts to the user whenever a specified bitcoin address receives sats.

## What are chainhooks
Chainhook is a fork-aware transaction indexing engine aiming at helping developers focus on the information they need by helping with the on-chain data extraction. By focusing on the data they care about, developers work with much lighter datasets. <a href="https://docs.hiro.so/chainhooks/overview">learn more</a>

All onchain operation are done on clarinet devnet.

## How to use

Start a local Devnet with the command:

```bash
clarinet integrate

```
open another tab another tab in the terminal, then run:

```
cd serverless
yarn global add serverless    # Install serverless globally
yarn add --dev serverless-plugin-typescript@latest
yarn                          # Install dependencies
```


