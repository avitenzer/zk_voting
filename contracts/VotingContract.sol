pragma solidity ^0.8.0;

import "./Verifier.sol";

contract VotingContract {

    Verifier public verifier;
    uint256 public voteCount;
    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => uint256) public voteCounts;

    constructor(address _verifierAddress) {
        verifier = Verifier(_verifierAddress);
    }

    function vote(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) public {
        require(verifier.verifyProof(a, b, c, input), "Invalid proof");

        uint256 nullifierHash = input[0];
        //uint256 voteChoice = input[1];

        require(!nullifierHashes[nullifierHash], "Nullifier already used");

        nullifierHashes[nullifierHash] = true;
        //voteCounts[voteChoice]++;
        voteCount++;
    }

    function getVoteCount(uint256 voteChoice) public view returns (uint256) {
        return voteCounts[voteChoice];
    }
}