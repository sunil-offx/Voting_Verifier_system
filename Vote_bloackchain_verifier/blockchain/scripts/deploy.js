const hre = require("hardhat");

async function main() {
    const voting = await hre.ethers.deployContract("Voting");

    await voting.waitForDeployment();

    console.log(
        `Voting contract deployed to: ${await voting.getAddress()}`
    );

    // Let's add some initial candidates automatically
    console.log("Adding default candidates...");
    let tx = await voting.addCandidate("Alice");
    await tx.wait();
    tx = await voting.addCandidate("Bob");
    await tx.wait();
    tx = await voting.addCandidate("Charlie");
    await tx.wait();

    console.log("Candidates added!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
