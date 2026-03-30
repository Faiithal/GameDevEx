# 🎨 GameDevEX: SEA Developer Hub
A Decentralized Commission Ecosystem for Game Developers in Southeast Asia.

GameDevEX is a trustless platform built on the Stellar Network using Soroban Smart Contracts. It allows recruiters to hire game developers with verifiable on-chain certificates and secure payment links.

## 🚀 Live on Testnet
The core logic is handled by a Soroban smart contract deployed on the Stellar Testnet.

Contract ID: CDCMG6T4QZRPAEDUD5DVNYFBHRFWLZNH47RM7YIPPOFPWLSPTEWE34GM

Explorer: [View on StellarExpert](https://stellar.expert/explorer/testnet/contract/CDCMG6T4QZRPAEDUD5DVNYFBHRFWLZNH47RM7YIPPOFPWLSPTEWE34GM)

## 🛠 Tech Stack
Smart Contract: Rust + Soroban SDK

Frontend: React (TypeScript) + Vite

Styling: Tailwind CSS (v4)

Wallet Integration: @creit.tech/stellar-wallets-kit (v2.0.1)

Blockchain Communication: @stellar/stellar-sdk (v21.0.0)

## 📖 Key Features & Functions
1. Developer Verification (register_certificate)
Developers can link their portfolio work (via SHA-256 hashes) to their wallet address. This creates a permanent, immutable record of their skills.

2. Trustless Commissions (link_payment)
Recruiters can initiate a commission by linking a payment amount to a specific developer. This emits a "payment link" event that serves as a green light for the developer to start working.

3. On-Chain Events
The frontend listens for symbols like reg_cert and reward to update the UI in real-time, providing transparency for both the dev and the employer.

## ⚙️ Setup & Installation
Prerequisites
Node.js (v18+)

Freighter Wallet (Browser Extension)

Yarn (For internal SDK dependencies)

Step 1: Clone and Install
```PowerShell
# Create the project using Vite
npm create vite@latest gamedevex -- --template react-ts
cd gamedevex

# Install dependencies (use quotes for PowerShell compatibility)
npm install "@stellar/stellar-sdk" "@creit.tech/stellar-wallets-kit" lucide-react "buffer" --ignore-scripts
```
Step 2: Configure TypeScript
In tsconfig.json, ensure moduleResolution is set to bundler to support the modular wallet kit:

```JSON
"moduleResolution": "bundler"
```
Step 3: Global Polyfill
In src/main.tsx, add the Buffer polyfill to support Stellar SDK in the browser:

```TypeScript
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
```
🖥 Usage Guide
Running Locally
```PowerShell
npm run dev
```
Connecting Your Wallet
Open your Freighter extension.

Switch the network to Testnet.

Click "Connect Wallet" on the GameDevEX dashboard.

Accept the connection request.

Hiring a Developer
Find a "Verified" developer card.

Click "Hire with XLM".

Sign the Soroban transaction in the Freighter popup.

Once confirmed, the transaction hash will appear on StellarExpert.

## 🧠 Behind the Scenes: How it Works
When you click "Hire," the app performs the following:

Address Parsing: Converts the human-readable G... address into a 32-byte XDR Address object.

Simulation: The Soroban RPC simulates the contract call to calculate resources.

Signing: The Wallet Kit sends the XDR to Freighter for your secure signature.

Submission: The signed transaction is sent to the Stellar network, where it is validated by nodes and written to the ledger.
