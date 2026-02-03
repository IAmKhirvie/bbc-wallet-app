const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockOracle", function () {
  let oracle;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const MockOracle = await ethers.getContractFactory("MockOracle");
    oracle = await MockOracle.deploy();
    await oracle.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the owner correctly", async function () {
      expect(await oracle.owner()).to.equal(owner.address);
    });

    it("Should have initial prices set", async function () {
      const bbcPrice = await oracle.getPrice("BBC");
      expect(bbcPrice).to.be.gt(0);

      const ethPrice = await oracle.getPrice("ETH");
      expect(ethPrice).to.be.gt(0);
    });

    it("Should return supported currencies", async function () {
      const currencies = await oracle.getSupportedCurrencies();
      expect(currencies.length).to.be.gt(0);
      expect(currencies).to.include("BBC");
      expect(currencies).to.include("ETH");
    });
  });

  describe("Price Queries", function () {
    it("Should return BBC price correctly", async function () {
      const price = await oracle.getBBCPrice();
      expect(price).to.equal(100000000); // $1.00 with 8 decimals
    });

    it("Should return price with timestamp", async function () {
      const [price, timestamp] = await oracle.getPriceWithTimestamp("BBC");
      expect(price).to.be.gt(0);
      expect(timestamp).to.be.gt(0);
    });

    it("Should revert for unsupported currency", async function () {
      await expect(
        oracle.getPrice("XYZ")
      ).to.be.revertedWith("Price not found for: XYZ");
    });
  });

  describe("Price Updates", function () {
    it("Should allow owner to update price", async function () {
      const newPrice = 200000000; // $2.00
      await oracle.updatePrice("BBC", newPrice);

      const price = await oracle.getPrice("BBC");
      expect(price).to.equal(newPrice);
    });

    it("Should emit PriceUpdated event", async function () {
      const newPrice = 200000000;
      await expect(oracle.updatePrice("BBC", newPrice))
        .to.emit(oracle, "PriceUpdated")
        .withArgs("BBC", newPrice);
    });

    it("Should not allow non-owner to update price", async function () {
      await expect(
        oracle.connect(addr1).updatePrice("BBC", 200000000)
      ).to.be.revertedWithCustomError(oracle, "OwnableUnauthorizedAccount");
    });
  });

  describe("Batch Operations", function () {
    it("Should allow batch price updates", async function () {
      const currencies = ["BBC", "ETH"];
      const newPrices = [150000000, 250000000000];

      await oracle.batchUpdatePrices(currencies, newPrices);

      expect(await oracle.getPrice("BBC")).to.equal(newPrices[0]);
      expect(await oracle.getPrice("ETH")).to.equal(newPrices[1]);
    });

    it("Should revert on mismatched arrays", async function () {
      const currencies = ["BBC", "ETH"];
      const newPrices = [150000000];

      await expect(
        oracle.batchUpdatePrices(currencies, newPrices)
      ).to.be.revertedWith("Arrays length mismatch");
    });

    it("Should get batch prices", async function () {
      const currencies = ["BBC", "ETH", "BTC"];
      const prices = await oracle.getBatchPrices(currencies);

      expect(prices.length).to.equal(3);
      expect(prices[0]).to.be.gt(0);
      expect(prices[1]).to.be.gt(0);
      expect(prices[2]).to.be.gt(0);
    });
  });

  describe("Currency Conversion", function () {
    it("Should convert BBC to USD", async function () {
      const amount = ethers.parseEther("100"); // 100 BBC (18 decimals)
      const converted = await oracle.convert(amount, "BBC", "USD");

      // BBC price is $1.00, so 100 BBC = 100 USD (scaled)
      expect(converted).to.be.closeTo(amount, ethers.parseEther("1"));
    });

    it("Should convert USD to BBC", async function () {
      const amount = ethers.parseEther("100"); // 100 USD (18 decimals)
      const converted = await oracle.convert(amount, "USD", "BBC");

      expect(converted).to.be.closeTo(amount, ethers.parseEther("1"));
    });

    it("Should convert ETH to BBC", async function () {
      const ethAmount = ethers.parseEther("1"); // 1 ETH
      const converted = await oracle.convert(ethAmount, "ETH", "BBC");

      // ETH price is $3000, BBC price is $1
      // So 1 ETH = 3000 BBC
      const expected = ethers.parseEther("3000");
      expect(converted).to.be.closeTo(expected, ethers.parseEther("10"));
    });

    it("Should revert for invalid currency", async function () {
      const amount = ethers.parseEther("100");

      await expect(
        oracle.convert(amount, "BBC", "XYZ")
      ).to.be.revertedWith("Invalid price data");
    });
  });

  describe("Adding Currencies", function () {
    it("Should allow owner to add new currency", async function () {
      await oracle.addCurrency("SOL", 50000000); // $0.50

      const price = await oracle.getPrice("SOL");
      expect(price).to.equal(50000000);
    });

    it("Should emit CurrencyAdded event", async function () {
      await expect(oracle.addCurrency("SOL", 50000000))
        .to.emit(oracle, "CurrencyAdded")
        .withArgs("SOL");
    });

    it("Should not add duplicate currency", async function () {
      await expect(
        oracle.addCurrency("BBC", 100000000)
      ).to.be.revertedWith("Currency already exists");
    });

    it("Should not allow non-owner to add currency", async function () {
      await expect(
        oracle.connect(addr1).addCurrency("SOL", 50000000)
      ).to.be.revertedWithCustomError(oracle, "OwnableUnauthorizedAccount");
    });

    it("Should include new currency in supported list", async function () {
      const initialCount = (await oracle.getSupportedCurrencies()).length;

      await oracle.addCurrency("SOL", 50000000);

      const currencies = await oracle.getSupportedCurrencies();
      expect(currencies.length).to.equal(initialCount + 1);
      expect(currencies).to.include("SOL");
    });
  });
});
