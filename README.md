# Decentralized Voting Verifier System

## Overview
A comprehensive, secure, and decentralized voting verification system leveraging blockchain technology for tamper-proof vote recording, combined with secure mobile biometric authentication to ensure precise voter identification and prevent double-voting.

## Features & Implementation Highlights

Throughout the development of this project, we have successfully implemented and integrated several advanced systems modularly:

1. **Mobile Biometric Authentication:** 
   Instead of using external hardware, voters use their own smartphone's biometric sensors (fingerprint/face). The biometric data is validated, vectorized, and matched securely against records in the backend.
2. **Dynamic QR Code Pairing:** 
   A mobile application flow where the desktop view dynamically generates a QR code containing the server's local network IP. The mobile device scans it, creating an instant local bridge that streams biometric success/failure statuses.
3. **Multi-fingerprint Vector Storage:** 
   A dedicated local vector database (`biometric_vectors.db`) is configured to store multiple biometric vectors per individual (e.g., "Finger 1", "Finger 2") giving administrators strong flexibility regarding verifiable identity.
4. **Blockchain Vote Verifier:**
   A tamper-proof ledger implementation to transparently record who has voted, completely neutralizing the threat of double voting or data alteration.

## Architecture & Concepts Used

### 1. Blockchain (Decentralization & Security)
The core principle driving the verification logic is immutable transaction history.
- When an individual's biometric hash is successfully recognized, an authorization token is produced to cast a vote.
- The vote casting is recorded on the blockchain network.
- Because blockchain transactions cannot be reversed or altered, anyone can definitively audit the system to confirm proper voter turn-out without revealing who the person specifically voted for.

### 2. Backend (Python)
The central nervous system of the application, managing biometric matching and database routing:
- **`main.py` / App Structure:** Acts as the API gateway (likely FastAPI/Flask) that handles incoming requests.
- **Biometric Utilities (`biometric_utils.py`):** Translates raw authentication signals into quantifiable vectors that can be securely stored and compared.
- **Schemas & Models:** Manages structured data (like User, Vote, BiometricData) to safely query and store application state.

### 3. Frontend (React + TypeScript)
The user-facing ecosystem built to provide a modern, seamless experience.
- **Admin/Desktop Portal (`VerificationSite.tsx`):** The dashboard where the voting setup resides. It monitors live connections from devices and initiates the polling/verification status.
- **Mobile Client (`MobileVerify.tsx`):** A custom mobile-responsive routing layer. Upon scanning the Web Portal's QR code, it opens the environment to utilize WebAuthn/Mobile Biometric APIs and pipes the authorization back to the Web Portal seamlessly.

## How The Flow Works

1. **Setup & Network Sync:** The system's desktop terminal launches and displays a QR code referencing its internal IP Address.
2. **Pairing:** The voter scans the QR code using their mobile phone, syncing the phone screen directly to the active session.
3. **Biometric Scan:** The mobile screen prompts the user to place their finger on the smartphone sensor.
4. **Vector Verification:** A secure cryptographic token/vector is sent to the backend. The Python system retrieves `biometric_vectors.db` to approve the uniqueness of the scan.
5. **Vote Commitment:** Upon `SUCCESS`, the desktop terminal unlocks the voting interface. The user selects their choice, and the finalized decision is hashed and uploaded to the Blockchain.
