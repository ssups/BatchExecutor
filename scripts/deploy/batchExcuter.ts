import hre from "hardhat";

async function main() {
  const factory = await hre.ethers.getContractFactory("BatchExecutor");
  const contract = await factory.deploy();
  await contract.deployed();
  const tx = contract.deployTransaction;
  const receipt = await hre.ethers.provider.getTransactionReceipt(tx.hash);

  console.log("ca: ", contract.address);
  console.log("gas used: ", receipt.gasUsed);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
