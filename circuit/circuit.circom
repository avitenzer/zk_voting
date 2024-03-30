pragma circom 2.1.6;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template VotingCircuit() {
    // Private inputs
    signal input voterAge;
    signal input voteSelection;

    // Public inputs
    signal input electionId;
    signal input voterHash;
    signal input nullifierHash;


    // Public output
    signal output isVoteValid;

    // Verify voter age
    component ageCheck = GreaterEqThan(18);
    ageCheck.in[0] <== voterAge;
    ageCheck.in[1] <== 18;

    // Verify vote selection
    component voteCheck = LessEqThan(4);
    voteCheck.in[0] <== voteSelection;
    voteCheck.in[1] <== 3;

    // Compute nullifier hash
    component nullifierHasher = Poseidon(3);
    nullifierHasher.inputs[0] <== voteSelection;
    nullifierHasher.inputs[1] <== electionId;
    nullifierHasher.inputs[2] <== voterHash;

    var nullifierCheck = nullifierHasher.out == nullifierHash ? 1 : 0;

    assert (nullifierCheck == 1);

    isVoteValid <== ageCheck.out * voteCheck.out;

}

component main = VotingCircuit();