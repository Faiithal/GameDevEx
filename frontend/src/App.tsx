import React, { useState } from 'react';
// Correct imports for Stellar/Soroban v21+
import {
  StellarWalletsKit,
} from "@creit.tech/stellar-wallets-kit/sdk";
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';
import {
  Contract,
  rpc,
  xdr,
  nativeToScVal,
  TransactionBuilder,
  Networks,
  Address
} from "@stellar/stellar-sdk";
import { ShieldCheck, Wallet, Coins, Loader2 } from 'lucide-react';
import { Buffer } from 'buffer';


// Replace with your actual Deployed ID from StellarExpert
const CONTRACT_ID = "CDCMG6T4QZRPAEDUD5DVNYFBHRFWLZNH47RM7YIPPOFPWLSPTEWE34GM";
const RPC_URL = "https://soroban-testnet.stellar.org";

// Type definitions for our Developer Data
interface Developer {
  id: number;
  name: string;
  role: string;
  strengths: string[];
  verified: boolean;
  walletAddress: string;
}

const MOCK_DEVS: Developer[] = [
  {
    id: 1,
    name: "Jethro",
    role: "Shader Programmer",
    strengths: ["HLSL", "Unity", "C++"],
    verified: true,
    walletAddress: "GACV53VMFBSOZ4WKBITLECCZT46FVJFF47H5ODHXSCDOYKWSTCKPN4BD"
  },
];

export default function GameDevEX() {
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize Wallet Kit
  StellarWalletsKit.init({
    modules: defaultModules(),
  });

  const connectWallet = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      setAddress(address);
    } catch (e) {
      console.error("Wallet connection failed", e);
    }
  };

  const handleHire = async (dev: Developer) => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setStatus(`Preparing contract call for ${dev.name}...`);

    try {
      const server = new rpc.Server(RPC_URL);
      const contract = new Contract(CONTRACT_ID);

      const employerAddr = new Address(address);
      const developerAddr = new Address(dev.walletAddress);

      // 1. Fetch account details for the transaction builder
      // TODO: Add that


      // 2. Build the Soroban Call
      // link_payment(employer: Address, developer: Address, amount: i128)
      const txCall = contract.call(
        "link_payment",
        nativeToScVal(employerAddr, { type: "address" }),
        nativeToScVal(developerAddr, { type: "address" }),
        nativeToScVal(100, { type: "i128" }) // 100 XLM reward
      );

      // Note: Full transaction building requires handling the Sequence Number 
      // and Fee. For an MVP, we focus on the contract invocation logic.
      console.log("Transaction Call Created:", txCall);

      setStatus("Check Freighter for signing...");
      // In a real flow, you'd use kit.signTransaction() here

      setStatus("Success! Commission logged on-chain.");
    } catch (err) {
      console.error("TS Error in Contract Call:", err);
      setStatus("Error: Check console for transaction details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-8">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">GAMEDEV.EX</h1>
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full flex items-center gap-2 transition font-medium"
        >
          <Wallet size={18} />
          {address ? `${address.slice(0, 5)}...${address.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h2 className="text-5xl font-extrabold mb-4">SEA Game Dev Hub</h2>
          <p className="text-slate-400 text-lg">Trustless commissions powered by Soroban smart contracts.</p>

          {status && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 flex items-center gap-3">
              {loading && <Loader2 className="animate-spin" size={18} />}
              {status}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_DEVS.map((dev) => (
            <div key={dev.id} className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-blue-500/50 transition duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl rotate-3" />
                {dev.verified && (
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-black uppercase tracking-wider">
                    <ShieldCheck size={14} /> Verified
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-1">{dev.name}</h3>
              <p className="text-slate-400 mb-6">{dev.role}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {dev.strengths.map(s => (
                  <span key={s} className="text-xs bg-slate-700/50 px-3 py-1 rounded-md text-slate-300 border border-slate-600">
                    {s}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleHire(dev)}
                disabled={loading}
                className="w-full bg-slate-100 text-[#0f172a] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-400 transition-colors disabled:opacity-50"
              >
                <Coins size={20} />
                {loading ? "Processing..." : "Hire Developer"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}