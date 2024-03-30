const { expect } = require("chai");
const { ethers } = require("hardhat");
const snarkjs = require("snarkjs");

describe("VotingContract", function () {
    let votingContract;
    let verifierContract;

    beforeEach(async function () {
        // Deploy the verifier contract
        const Verifier = await ethers.getContractFactory("Verifier");
        verifierContract = await Verifier.deploy();
        await verifierContract.deployed();

        // Deploy the voting contract
        const VotingContract = await ethers.getContractFactory("VotingContract");
        votingContract = await VotingContract.deploy(verifierContract.address);
        await votingContract.deployed();
    });

    it("should allow voting with a valid proof", async function () {
        // Generate the zk-SNARK proof
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            "circuit_js/circuit.wasm",
            "circuit_final.zkey"
        );

        // Submit the vote with the proof
        await votingContract.vote(proof.a, proof.b, proof.c, publicSignals);

        // Check the vote count
        const voteCount = await votingContract.voteCount();
        expect(voteCount).to.equal(1);
    });

    // Add more test cases as needed
});