# Hackathon Secure Voting Prototype

This repository contains the backend and blockchain logic for the Secure Blockchain-Based Voting System.

## Prerequisites
- Node.js (for Hardhat)
- Python 3.9+ (for FastAPI backend)

## 1. Blockchain Setup (Hardhat)

1. Open a terminal and navigate to the `blockchain` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local Hardhat node (this will keep running in the terminal):
   ```bash
   npx hardhat node
   ```
4. In a separate terminal (also in the `blockchain` folder), deploy the smart contract to the local node:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
5. You must copy the **0x5FbDB2315678afecb367f032d93F642f64180aa3** printed in the console.

## 2. Backend Setup (FastAPI & SQLite)

1. Open a terminal and navigate to the root directory `Vote_bloackchain_verifier` (the folder containing both `blockchain` and `backend`).
2. Create python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Set the `CONTRACT_ADDRESS` environment variable using the address you copied from the deployment script earlier. Or edit `backend/blockchain_utils.py` and set `CONTRACT_ADDRESS` to the deployed address.
5. Start the backend Server:
   ```bash
   uvicorn backend.main:app --reload
   ```

## 3. Testing the Logic
The FastAPI server will be running on `http://127.0.0.1:8000`.
You can visit `http://127.0.0.1:8000/docs` to see the interactive Swagger UI and test the endpoints:
1. **`/register`**: Create a new user.
2. **`/token`**: Login to get a JWT bearer token.
3. **`/candidates`**: Fetch candidates directly from the local Hardhat blockchain.
4. **`/vote`**: Cast a vote to the blockchain. **Requires JWT Token Authorization** from step 2.
