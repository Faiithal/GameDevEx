# GameDevEX: SEA Developer Hub

A decentralized commission and verification hub built on Stellar's Soroban platform. GameDevEX allows game developers in Southeast Asia to register immutable certificates of their work and enables recruiters to hire talent via secure, on-chain payment links.

---

## Features

- **Verified Portfolios** — developers register SHA-256 hashes of their assets or code; creates an immutable link between a wallet and a body of work.
- **On-Chain Escrow** — payments are linked to specific developer addresses; funds are reserved on-chain to ensure recruiter liquidity.
- **Verification Badges** — optional administrative verification for top-tier talent, visible via the 'Soroban Verified' status.
- **Permissionless Discovery** — anyone can query the ledger to find developers, view their registered certificates, and check their commission history.
- **Multi-Wallet Support** — fully compatible with the @creit.tech/stellar-wallets-kit (v2.0.1) for Freighter, xBull, and Albedo.

---

## How It Works

---

## Commission Lifecycle

| Status | Description |
|---|---|
| Pending | Recruiter has initiated the link; awaiting developer acknowledgement. |
| Funded | Funds are locked in the contract; developer is actively working. |
| Completed | Work approved; funds transferred to developer; irreversible. |
| Cancelled | Cancelled by recruiter (if permitted) or admin; funds returned. |

---

## Storage Layout

| Key | Type | Scope | Description |
|---|---|---|---|
| INIT | bool | Instance | Initialization guard. |
| Config | Config | Instance | Admin, token types, and fee structures. |
| DevProfile(addr) | Profile | Persistent | Developer metadata and verification status. |
| Cert(hash) | Certificate | Persistent | Specific project/asset verification records. |
| Commission(id) | Commission | Persistent | Record of active and past payments. |
| DevCertIndex(addr)| Vec<Hash> | Persistent | List of all certificates owned by a developer. |

---

## Public Interface

### Setup

#### initialize
```rust
pub fn initialize(env: Env, admin: Address, payment_token: Address, fee_bps: u32)
```

Deploy the hub. Can only be called once.

---

### Developer Actions

#### register_certificate
```rust
pub fn register_certificate(env: Env, developer: Address, work_hash: BytesN<32>, metadata_uri: String)
```

Registers a work sample. Developer must provide a SHA-256 hash of the asset/code.

---

### Recruiter Actions

#### link_payment
```rust
pub fn link_payment(env: Env, recruiter: Address, developer: Address, amount: i128) -> u64
```

Initiates a commission. Funds are transferred from the recruiter to the contract's escrow.

#### complete_commission
```rust
pub fn complete_commission(env: Env, recruiter: Address, commission_id: u64)
```

Finalizes the deal. Transfers the amount from escrow to the developer.

---

### Admin Actions

#### verify_developer
```pub fn verify_developer(env: Env, admin: Address, developer: Address)```

Adds the 'Soroban Verified' status to a profile. Admin only.

---

## Data Types

### Config
pub struct Config {
    pub admin: Address,
    pub payment_token: Address,
    pub fee_bps: u32,
}

### Commission
pub struct Commission {
    pub id: u64,
    pub recruiter: Address,
    pub developer: Address,
    pub amount: i128,
    pub status: CommissionStatus,
    pub created_at: u64,
}

---

## Getting Started

### 1. Build the Contract
```cargo build --target wasm32-unknown-unknown --release```

### 2. Deploy to Testnet
```stellar contract deploy --wasm target/wasm32-unknown-unknown/release/gamedevex.wasm --source deployer --network testnet```

### 3. Initialize
```stellar contract invoke --id CDCMG6T4QZRPAEDUD5DVNYFBHRFWLZNH47RM7YIPPOFPWLSPTEWE34GM --source deployer --network testnet -- initialize --admin <ADMIN_ADDRESS> --payment_token <NATIVE_XLM_ADDRESS> --fee_bps 250```

---

## Testnet Contract Information
* Contract ID: CDCMG6T4QZRPAEDUD5DVNYFBHRFWLZNH47RM7YIPPOFPWLSPTEWE34GM
* Explorer: [Open in StellarExpert](https://stellar.expert/explorer/testnet/contract/CDCMG6T4QZRPAEDUD5DVNYFBHRFWLZNH47RM7YIPPOFPWLSPTEWE34GM)
<img width="1867" height="920" alt="image" src="https://github.com/user-attachments/assets/d2253f2e-cfd5-49e7-96b8-bd21d2de569e" />

---

## License
MIT
