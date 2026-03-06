const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingModule", (m) => {
    const candidates = [["Alpha", "Beta", "Gamma"]];
    const voting = m.contract("Voting", candidates);

    return { voting };
});
