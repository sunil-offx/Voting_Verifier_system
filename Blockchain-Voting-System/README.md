# Secure Blockchain-Based Voting System

This monolithic repository contains everything you need to run the hackathon prototype: the Frontend (React), the Backend (NodeJS), and the Blockchain Layer (Hardhat local network).

## Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
Because this project runs three separate components, you must open **THREE separate terminals (or terminal tabs)** inside VS Code / PowerShell to run them simultaneously.

### Terminal 1: Run the Backend
1. Open a new terminal.
2. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the server (runs on `localhost:5000`):
   ```powershell
   npm start
   ```

### Terminal 2: Run the Local Blockchain Node
1. Open a second, separate terminal.
2. Navigate to the blockchain folder:
   ```powershell
   cd blockchain
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the local Ethereum node:
   ```powershell
   npx hardhat node
   ```
*(Leave this terminal running. It will print out 20 test accounts with private keys)*

### Terminal 3: Deploy Smart Contract & Run Frontend
1. Open a third, separate terminal.
2. Navigate to the blockchain folder to deploy the contract onto the node you just started:
   ```powershell
   cd blockchain
   npx hardhat ignition deploy ./ignition/modules/Voting.js --network localhost
   ```
3. Navigate back out and start the frontend:
   ```powershell
   cd ../frontend
   npm install
   npm run dev
   ```
*(This will open the React app on `localhost:5173`)*
