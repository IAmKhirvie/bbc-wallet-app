const hre = require("hardhat");

/**
 * Faucet script to fund an address with BBC and ETH
 * Usage: npx hardhat run scripts/faucet.js --network localhost <address>
 */
async function main() {
  const targetAddress = process.argv[4];

  if (!targetAddress || !hre.ethers.isAddress(targetAddress)) {
    console.error("Please provide a valid address");
    console.log("Usage: npx hardhat run scripts/faucet.js --network localhost <address>");
    process.exit(1);
  }

  console.log("\n=== BBC Faucet ===\n");
  console.log("Funding address:", targetAddress);

  const [deployer] = await hre.ethers.getSigners();
  console.log("From account:", deployer.address);

  // Get the deployed BBC contract address from deployment.json
  const fs = require("fs");
  let bbcAddress;

  try {
    const deployment = JSON.parse(fs.readFileSync("./frontend/src/deployment.json", "utf8"));
    bbcAddress = deployment.contracts.BigBlackCoin;
  } catch (error) {
    console.error("Could not find deployment info. Please run deploy.js first.");
    process.exit(1);
  }

  // Connect to BBC contract
  const bbc = await hre.ethers.getContractAt("BigBlackCoin", bbcAddress);

  // Fund with BBC
  const bbcAmount = hre.ethers.parseEther("1000"); // 1,000 BBC
  console.log("\nSending 1,000 BBC...");

  const tx = await bbc.transfer(targetAddress, bbcAmount);
  await tx.wait();
  console.log("Transaction hash:", tx.hash);

  // Check new balance
  const balance = await bbc.balanceOf(targetAddress);
  console.log("\nNew BBC balance:", hre.ethers.formatUnits(balance, 18), "BBC");

  // Fund with ETH
  const ethAmount = hre.ethers.parseEther("1"); // 1 ETH
  console.log("\nSending 1 ETH...");

  const ethTx = await deployer.sendTransaction({
    to: targetAddress,
    value: ethAmount
  });
  await ethTx.wait();
  console.log("Transaction hash:", ethTx.hash);

  const ethBalance = await hre.ethers.provider.getBalance(targetAddress);
  console.log("\nNew ETH balance:", hre.ethers.formatEther(ethBalance), "ETH");

  console.log("\n=== Faucet Complete! ===\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
