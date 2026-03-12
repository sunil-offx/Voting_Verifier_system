from web3 import Web3
import json
import os

# Connect to standard Hardhat local node
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# The address below is the default first deployed contract on hardhat node
# Update if your contract deploys to a different address
CONTRACT_ADDRESS = os.getenv("0x5FbDB2315678afecb367f032d93F642f64180aa3", "0x5FbDB2315678afecb367f032d93F642f64180aa3")

def get_contract():
    try:
        # Resolve path relative to where it runs (usually project root)
        artifact_path = os.path.join(
            os.path.dirname(__file__), 
            "../blockchain/artifacts/contracts/Voting.sol/Voting.json"
        )
        with open(artifact_path, "r") as f:
            contract_json = json.load(f)
            abi = contract_json["abi"]
        return w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
    except Exception as e:
        print(f"Error loading contract (Make sure hardhat is compiled and deployed): {e}")
        return None

def cast_vote(voter_id_hash: str, candidate_id: int):
    contract = get_contract()
    if not contract:
        raise Exception("Smart contract not initialized")
        
    # We use the first hardhat account as the relayer/sender for this backend prototype
    account = w3.eth.accounts[0] 
    
    tx_hash = contract.functions.vote(voter_id_hash, candidate_id).transact({'from': account})
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt

def get_all_candidates():
    contract = get_contract()
    if not contract:
        raise Exception("Smart contract not initialized")
    
    candidates = contract.functions.getAllCandidates().call()
    return candidates
