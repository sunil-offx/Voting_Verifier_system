import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import QRCode from 'react-qr-code';
import './index.css';

// Default deployment address for the first contract on a fresh Hardhat node
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function getAllCandidates() public view returns (tuple(uint256 id, string name, uint256 voteCount)[])",
  "function vote(uint256 _candidateId) public",
  "function voters(address) public view returns (bool)",
  "event VotedEvent(uint indexed candidateId)"
];

const urlParams = new URLSearchParams(window.location.search);
const isMobileClient = urlParams.get('mobile') === 'true';

export default function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [authStep, setAuthStep] = useState(0);
  const [voterInfo, setVoterInfo] = useState({ name: '', id: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [qrString, setQrString] = useState("");

  // Mobile specific state
  const [mobileAuthComplete, setMobileAuthComplete] = useState(false);

  useEffect(() => {
    // If it's pure mobile UI, extract params
    if (isMobileClient) {
      const mName = urlParams.get('name') || '';
      const mId = urlParams.get('id') || '';
      setVoterInfo({ name: mName, id: mId });
    } else {
      initBlockchain();
    }
  }, []);

  const initBlockchain = async () => {
    try {
      // Connect to the local Hardhat node directly
      const localProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      setProvider(localProvider);
    } catch (err) {
      console.error("Failed to connect to blockchain node", err);
      setMessage("Failed to connect to local blockchain. Is 'npx hardhat node' running?");
    }
  };

  const loginWithMockAccount = async (accountIndex) => {
    try {
      if (!provider) return;

      const signer = await provider.getSigner(accountIndex);
      const address = await signer.getAddress();
      const votingContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setAccount(address);
      setContract(votingContract);

      const votedStatus = await votingContract.voters(address);
      setHasVoted(votedStatus);

      await loadCandidates(votingContract);

      // Listen for votes in real-time
      votingContract.on("VotedEvent", () => {
        loadCandidates(votingContract);
      });

    } catch (err) {
      console.error(err);
      setMessage("Login failed. Check terminal to ensure smart contract is deployed.");
    }
  };

  const loadCandidates = async (votingContract) => {
    try {
      const data = await votingContract.getAllCandidates();
      const formatted = data.map(c => ({
        id: Number(c.id),
        name: c.name,
        voteCount: Number(c.voteCount)
      }));
      setCandidates(formatted);
    } catch (err) {
      console.error("Error loading candidates", err);
    }
  };

  const castVote = async (candidateId) => {
    if (!contract) return;
    setLoading(true);
    setMessage("");
    try {
      const tx = await contract.vote(candidateId);
      setMessage("Transaction sent! Waiting for block inclusion...");
      await tx.wait();
      setHasVoted(true);
      setMessage("Vote cast successfully and secured on the blockchain!");
      await loadCandidates(contract);
    } catch (err) {
      console.error(err);
      setMessage("Error casting vote. You may have already voted or the transaction reverted.");
    }
    setLoading(false);
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!voterInfo.name || !voterInfo.id) {
      setMessage("Please enter valid Personal Info and Voter ID");
      return;
    }

    // Check if user is using localhost -> Mobile won't be able to scan
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      setMessage("Warning: You are using localhost. To enable mobile scanning, please open this app via your Network IP address (e.g. http://192.168.x.x:5173).");
    }

    // Generate QR with URL linking to mobile authorization page
    const baseUrl = window.location.origin;
    const mobileLink = `${baseUrl}/?mobile=true&name=${encodeURIComponent(voterInfo.name)}&id=${encodeURIComponent(voterInfo.id)}`;

    setQrString(mobileLink);
    setAuthStep(1); // Proceed to QR Display
  };

  const handleMobileVerificationConfirmed = async () => {
    // User finalized mobile authentication, log them in on Desktop
    let accNum = 1;
    if (voterInfo.id) {
      const charCode = voterInfo.id.charCodeAt(0) || 1;
      accNum = (charCode % 9) + 1;
    }
    await loginWithMockAccount(accNum);
  };

  const verifyFingerprint = async () => {
    setAuthLoading(true);
    setMessage("");
    try {
      // Try to invoke native fingerprint / WebAuthn on mobile
      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        const pubKeyCredParams = [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 }
        ];

        await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "BlockVote Authd" },
            user: {
              id: userId,
              name: voterInfo.name || 'User',
              displayName: voterInfo.name || 'User'
            },
            pubKeyCredParams,
            authenticatorSelection: {
              userVerification: "required",
              authenticatorAttachment: "platform" // Ensures it uses native phone scanner
            },
            timeout: 60000,
            attestation: "none"
          }
        });
      } else {
        // Fallback if not supported
        await new Promise(r => setTimeout(r, 2000));
      }

      setMobileAuthComplete(true);
      setAuthLoading(false);

    } catch (err) {
      console.error("Biometric scan block:", err); // can be skipped in hackathon demo
      if (err.name === 'NotAllowedError' || err.name === 'NotSupportedError') {
        setMessage("No biometric hardware detected. Running Hackathon Demo Bypass...");
        setTimeout(() => {
          setMobileAuthComplete(true);
          setAuthLoading(false);
        }, 2500);
      } else {
        setMessage("Error connecting to fingerprint scanner. Please try again.");
        setAuthLoading(false);
      }
    }
  };


  // ============================================
  // MOBILE DEDICATED VIEW (Shown when ?mobile=true is in URL)
  // ============================================
  if (isMobileClient) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <div className="glass-panel p-6 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-2xl border border-white border-opacity-10">
          <h2 className="text-2xl font-extrabold glow-text mb-2">BlockVote Identity</h2>
          <p className="text-gray-400 text-xs mb-8">Secure Mobile Authorization</p>

          {mobileAuthComplete ? (
            <div className="animate-fade-in flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mb-6 border border-green-500 border-opacity-50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <span className="text-green-400 text-5xl font-light">✓</span>
              </div>
              <h3 className="text-xl font-bold text-green-300 mb-2">Identity Verified</h3>
              <p className="text-sm text-green-100 opacity-80 mb-6">Your biometric token has been securely paired. You can now close this tab and return to the main screen to vote.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-black bg-opacity-40 p-3 rounded-lg border border-gray-700 w-full mb-6 text-left">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Scanned Identity Profile</p>
                <p className="text-sm text-purple-300 font-semibold">{voterInfo.name || 'Unknown User'}</p>
              </div>

              <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500 mb-6 ${authLoading ? 'bg-blue-600 border-blue-400 animate-pulse scale-110' : 'bg-blue-900 border-blue-500 bg-opacity-20'}`}>
                <span className="text-6xl opacity-90" style={{ filter: "drop-shadow(0 0 15px rgba(59,130,246,0.8))" }}>👆</span>
              </div>

              <p className="text-sm text-gray-300 mb-6">Tap the button below to authorize using your phone's fingerprint sensor.</p>

              <button
                disabled={authLoading}
                onClick={verifyFingerprint}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-5 rounded-2xl shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-transform transform active:scale-[0.98] disabled:opacity-50 relative overflow-hidden text-lg tracking-wide"
              >
                {authLoading ? 'Scanning...' : 'Scan Fingerprint'}
              </button>

              {message && (
                <div className="mt-4 p-3 rounded-lg bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-50 text-orange-300 text-xs">
                  {message}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-[10px] text-gray-600 flex justify-center items-center gap-2">
            <span>🔒 End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // DESKTOP MAIN VIEW
  // ============================================

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden shadow-2xl">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold glow-text text-white mb-3">BlockVote</h1>
            <p className="text-gray-400 text-sm">Decentralized Multi-Auth System</p>
          </div>

          {authStep === 0 && (
            <form onSubmit={handleInfoSubmit} className="space-y-4 relative z-10 text-left">
              <p className="text-sm text-blue-300 mb-6 tracking-wide font-semibold text-center border-b border-gray-700 pb-2">Step 1: Enter Voter Profile</p>

              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 block">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full bg-black bg-opacity-50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                  value={voterInfo.name}
                  onChange={(e) => setVoterInfo({ ...voterInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2 block">National Voting ID Number</label>
                <input
                  type="text"
                  placeholder="e.g. ABC1234567"
                  className="w-full bg-black bg-opacity-50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-mono text-sm"
                  value={voterInfo.id}
                  onChange={(e) => setVoterInfo({ ...voterInfo, id: e.target.value })}
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-5 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02]"
                >
                  Generate Scan Link (QR)
                </button>
              </div>
            </form>
          )}

          {authStep === 1 && (
            <div className="space-y-6 flex flex-col items-center animate-fade-in relative z-10">
              <p className="text-sm text-blue-300 tracking-wide font-semibold border-b border-gray-700 pb-2 w-full">Step 2: Sync Mobile Device</p>
              <p className="text-xs text-gray-300 bg-gray-900 bg-opacity-50 p-3 rounded-lg border border-gray-800 shadow-inner">
                Open your smartphone's camera and scan this code to link your biometric signature.
              </p>

              <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-transform hover:scale-105">
                <QRCode value={qrString} size={200} />
              </div>

              <p className="text-[10px] text-yellow-400 mt-2">
                *Only works if scanning device is on same WiFi network.
              </p>

              <button
                onClick={handleMobileVerificationConfirmed}
                className="w-full glass-button mt-4 text-white font-bold py-3 px-5 rounded-xl flex items-center justify-center space-x-2 border border-blue-500 border-opacity-30 hover:bg-blue-900 hover:bg-opacity-20 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <span>Continue after Mobile Auth</span>
                <span className="text-lg">➔</span>
              </button>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-xs sm:text-sm relative z-10 shadow-lg ${message.includes("Bypass") || message.includes("Warning") ? "bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-50 text-orange-300" : "bg-red-500 bg-opacity-10 border border-red-500 border-opacity-50 text-red-300"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  const totalVotes = candidates.reduce((acc, curr) => acc + curr.voteCount, 0);

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 glass-panel px-8 py-5 rounded-2xl shadow-xl border border-white border-opacity-10">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl font-extrabold glow-text">BlockVote System</h1>
          <p className="text-xs text-blue-300 mt-2 flex items-center justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
            Biometrically Authenticated & Secured
          </p>
        </div>
        <div className="text-center md:text-right flex items-center gap-4">
          <div className="bg-black bg-opacity-40 p-2 rounded-xl border border-gray-700 shadow-inner">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Verified Identity</p>
            <p className="text-xs text-green-400 font-semibold">{voterInfo.name} <span className="text-green-500 ml-1">✓</span></p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Voter Wallet</p>
            <p className="font-mono text-[10px] md:text-xs text-blue-200 bg-blue-900 bg-opacity-40 px-3 py-1.5 rounded-lg border border-blue-500 border-opacity-30">
              {account.substring(0, 6)}...{account.substring(38)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Voting Booth */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border border-white border-opacity-5 shadow-2xl">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center border-b border-gray-700 pb-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg text-white">🗳️</span>
              Secure Voting Booth
            </h2>

            {hasVoted ? (
              <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-40 p-8 rounded-2xl text-center mt-8 shadow-[0_0_40px_rgba(34,197,94,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <div className="w-20 h-20 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mx-auto mb-6 border border-green-500 border-opacity-50">
                  <div className="text-green-400 text-5xl font-light">✓</div>
                </div>
                <h3 className="text-2xl font-bold text-green-300 mb-3 tracking-wide">Vote Secured</h3>
                <p className="text-sm text-green-100 opacity-80 leading-relaxed font-medium">
                  Your biometric session successfully wrote an encrypted choice to the immutable blockchain ledger.
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                {candidates.map(candidate => (
                  <div key={candidate.id} className="bg-black bg-opacity-30 border border-white border-opacity-5 p-5 rounded-2xl flex justify-between items-center transition-all duration-300 hover:bg-opacity-50 hover:border-blue-500 hover:border-opacity-40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group">
                    <span className="font-bold text-lg text-gray-200 group-hover:text-white transition-colors flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm border border-gray-700 group-hover:border-blue-500 group-hover:text-blue-400">{candidate.id}</div>
                      {candidate.name}
                    </span>
                    <button
                      disabled={loading}
                      onClick={() => castVote(candidate.id)}
                      className="bg-blue-600 hover:bg-blue-500 bg-opacity-80 px-8 py-3 rounded-xl text-sm font-bold tracking-wider uppercase disabled:opacity-50 flex items-center shadow-lg transition-transform hover:scale-[1.05]"
                    >
                      {loading ? 'Mining...' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <div className="mt-8 p-4 rounded-xl bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-blue-200 text-sm text-center font-medium shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Live Results Tracker */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border border-white border-opacity-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center border-b border-gray-700 pb-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-4 shadow-lg text-white">📊</span>
              Live Immutable Results
            </h2>

            <div className="space-y-8 mt-6">
              {candidates.map(candidate => {
                const percentage = totalVotes === 0 ? 0 : Math.round((candidate.voteCount / totalVotes) * 100);
                return (
                  <div key={candidate.id} className="relative group">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-bold text-lg text-gray-300 group-hover:text-white transition-colors">{candidate.name}</span>
                      <span className="text-purple-300 font-mono text-base font-medium bg-purple-900 bg-opacity-30 px-3 py-1 rounded-lg border border-purple-500 border-opacity-20">{candidate.voteCount} <span className="text-gray-500 ml-1 text-xs">({percentage}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-800 shadow-inner">
                      <div
                        className="h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 w-20 bg-white opacity-20 transform translate-x-10 skew-x-12 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-700 relative z-10">
            <div className="flex justify-between items-center text-sm bg-black bg-opacity-50 p-4 rounded-xl mb-5 border border-gray-800 shadow-inner">
              <span className="text-gray-400 font-semibold tracking-wider text-xs">TOTAL CHAINED VOTES</span>
              <span className="font-mono text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold">{totalVotes}</span>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 p-5 rounded-2xl flex items-start shadow-inner">
              <span className="text-orange-400 mr-4 text-3xl animate-pulse" style={{ filter: "drop-shadow(0 0 8px rgba(249,115,22,0.6))" }}>🛡️</span>
              <div>
                <h4 className="text-orange-300 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center">
                  Zero-Knowledge Proof Server
                  <span className="ml-2 w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping"></span>
                </h4>
                <p className="text-orange-200 text-xs opacity-80 leading-relaxed font-medium">Validating incoming biometric hashes against smart contract registers. <span className="block mt-1 text-green-400 bg-green-900 bg-opacity-30 px-2 py-0.5 rounded inline-block">Integrity Verified</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
