const hre = require("hardhat");

async function main() {
  console.log("\n=== Deploying BBC Wallet Contracts ===\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy MockOracle first
  console.log("\n1. Deploying MockOracle...");
  const MockOracle = await hre.ethers.getContractFactory("MockOracle");
  const oracle = await MockOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("   MockOracle deployed to:", oracleAddress);

  // Verify initial prices
  console.log("\n   Verifying MockOracle prices:");
  const bbcPrice = await oracle.getBBCPrice();
  console.log("   - BBC Price:", hre.ethers.formatUnits(bbcPrice, 8), "USD");

  // Deploy BigBlackCoin token
  console.log("\n2. Deploying BigBlackCoin (BBC)...");
  const BBC = await hre.ethers.getContractFactory("BigBlackCoin");
  const bbc = await BBC.deploy();
  await bbc.waitForDeployment();
  const bbcAddress = await bbc.getAddress();
  console.log("   BBC Token deployed to:", bbcAddress);

  // Get token info
  const tokenInfo = await bbc.getTokenInfo();
  console.log("\n   Token Info:");
  console.log("   - Name:", tokenInfo.tokenName);
  console.log("   - Symbol:", tokenInfo.tokenSymbol);
  console.log("   - Decimals:", tokenInfo.tokenDecimals);
  console.log("   - Total Supply:", hre.ethers.formatUnits(tokenInfo.totalSupply_, 18), "BBC");
  console.log("   - Max Supply:", hre.ethers.formatUnits(tokenInfo.maxSupply_, 18), "BBC");

  // Get deployer's BBC balance
  const deployerBalance = await bbc.balanceOf(deployer.address);
  console.log("\n   Deployer's BBC Balance:", hre.ethers.formatUnits(deployerBalance, 18), "BBC");

  // Save deployment addresses to a file for frontend use
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    contracts: {
      MockOracle: oracleAddress,
      BigBlackCoin: bbcAddress
    },
    deployer: deployer.address
  };

  const deploymentPath = "./frontend/src/deployment.json";
  const deploymentDir = "./frontend/src";

  // Create frontend/src directory if it doesn't exist
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n3. Deployment info saved to:", deploymentPath);

  // Fund test accounts with BBC for testing
  console.log("\n4. Funding test accounts with BBC...");

  // Get all Hardhat test accounts (except deployer)
  const accounts = await hre.ethers.getSigners();
  const fundAmount = hre.ethers.parseEther("10000"); // 10,000 BBC each

  for (let i = 1; i < Math.min(accounts.length, 6); i++) {
    const account = accounts[i];
    const tx = await bbc.transfer(account.address, fundAmount);
    await tx.wait();

    const balance = await bbc.balanceOf(account.address);
    console.log(`   - Account ${i} (${account.address}): ${hre.ethers.formatUnits(balance, 18)} BBC`);
  }

  console.log("\n=== Deployment Complete! ===\n");
  console.log("Contract Addresses:");
  console.log("- BBC Token:", bbcAddress);
  console.log("- Mock Oracle:", oracleAddress);
  console.log("\nTo verify on Etherscan (if on testnet):");
  console.log(`npx hardhat verify --network ${hre.network.name} ${bbcAddress}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${oracleAddress}\n`);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
