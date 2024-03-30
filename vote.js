const snarkjs = require('snarkjs');
const circomlibjs = require('circomlibjs');
const fs = require('fs');

async function generateProof(voterAge, voteSelection, electionId, voterHash, nullifierHash) {
    const input = {
        voterAge: voterAge,
        voteSelection: voteSelection,
        electionId: electionId,
        voterHash: voterHash,
        nullifierHash: nullifierHash,
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        './circuit/circuit_js/circuit.wasm',
        './circuit/circuit_final.zkey'
    );

    console.log('Public Signals:', publicSignals);

    return { proof, publicSignals };
}

async function verifyProof(proof, publicSignals) {

    const expectedSignals = ['1'];
    const vKey = JSON.parse(fs.readFileSync('./circuit/verification_key.json'));

    const res = await snarkjs.groth16.verify(vKey, expectedSignals, proof);
    console.log('Verification result:', res);

    if (res === true) {
        console.log('Proof verified successfully');
        // Process the vote (e.g., submit to the smart contract)
        return true;
    } else {
        console.log('Invalid proof');
        return false;
    }
}

async function calculateNullifierHash(voteSelection, electionId, voterHash) {
    const poseidon = await circomlibjs.buildPoseidon();
    const nullifierHash = poseidon.F.toObject(poseidon([voteSelection, electionId, voterHash]));
    return nullifierHash;
}

async function calculateVoterHash(uniqueId) {
    const poseidon = await circomlibjs.buildPoseidon();
    const voterHash = poseidon.F.toObject(poseidon([uniqueId]));
    return voterHash;
}




async function main() {

    const voterAge = 25;
    const uniqueId = 123456789;
    const voteSelection = 3;
    const electionId = 987654321;

    try {
        const voterHash = await calculateVoterHash(uniqueId);
        console.log('Voter Hash:', voterHash);

        const nullifierHash = await calculateNullifierHash(voteSelection, electionId, voterHash);
        console.log('Nullifier Hash:', nullifierHash);

        const  { proof, publicSignals } = await generateProof(voterAge, voteSelection, electionId, voterHash, nullifierHash);

        const isValid = await verifyProof(proof, publicSignals);
        console.log('Voting process completed');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

main();



