# ArcAO Clients  

## Welcome, Player 👾  

You've just unlocked the gateway to **AO Development**. These docs will be your **catalyst**, providing a streamlined way to interact with every process on **AO**. Whether you're transferring tokens, managing NFTs, or tapping into randomness—this is your command center.  

---

## 🚀 Install  

```sh
npm i ao-process-clients
```

---

## ⚡ Quick Start  

```ts
import { TokenClient } from 'ao-process-clients'

// Initialize token client
const tokenClient = TokenClient.autoConfiguration()

// Transfer tokens
const success = await tokenClient.transfer(
    "recipient-address",
    "100000000000000000000"
)
console.log(success) // true if successful
```

---

## 🌍 Environment  

### **Node**  
Create a `.env` file:  

```ini
# Defaults to wallet.json if not specified
PATH_TO_WALLET="wallet.json" 
```

And a `JWKInterface` JSON file representing a wallet.  

### **Browser**  
Ensure `globalThis.arweaveWallet` is set to an Arweave wallet.  

---

## 🛠 Features  

Seamless interaction with **Arweave/AO**, including but not limited to:  

- 🎭 **NFT Collections**  
- 🏪 **Bazar Profiles**  
- 🎲 **Randomness Generation**  
- 💰 **Tokens & Staking**  
- 📜 **Arweave Transaction Data** ([Viewblock](https://viewblock.io/arweave))  
- 🌐 **ARIO Domain Lookup** ([ar.io/arns](https://ar.io/arns))  

---

**Good luck on your development journey, Player.** The AO ecosystem awaits your creations.  

<p align="center">  
  With ❤️ from the ArcAO Team.  
</p>  
