// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public owner;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    // To prevent double voting, we track which addresses/users have voted.
    // For a hackathon, we might identify voters by their frontend wallet or backend-generated ID.
    mapping(string => bool) public hasVoted; // Voter ID (like Aadhaar card / student ID) hash

    event Voted(string indexed voterId, uint256 indexed candidateId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // A wallet agnostic vote function where user passes their unique identifier hash
    function vote(string memory _voterId, uint256 _candidateId) public {
        require(!hasVoted[_voterId], "Voter has already cast their vote");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        hasVoted[_voterId] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(_voterId, _candidateId);
    }

    function getCandidate(uint256 _candidateId) public view returns (uint256, string memory, uint256) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory currentCandidates = new Candidate[](candidatesCount);
        for (uint256 i = 1; i <= candidatesCount; i++) {
            currentCandidates[i-1] = candidates[i];
        }
        return currentCandidates;
    }
}
