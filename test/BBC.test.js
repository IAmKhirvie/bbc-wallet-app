const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BigBlackCoin (BBC)", function () {
  let bbc;
  let owner;
  let addr1;
  let addr2;

  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 million BBC
  const MINT_AMOUNT = ethers.parseEther("100");
  const TRANSFER_AMOUNT = ethers.parseEther("50");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const BBC = await ethers.getContractFactory("BigBlackCoin");
    bbc = await BBC.deploy();
    await bbc.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await bbc.name()).to.equal("BigBlackCoin");
      expect(await bbc.symbol()).to.equal("BBC");
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await bbc.balanceOf(owner.address);
      expect(await bbc.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the owner correctly", async function () {
      expect(await bbc.owner()).to.equal(owner.address);
    });

    it("Should return correct token info", async function () {
      const info = await bbc.getTokenInfo();
      expect(info.tokenName).to.equal("BigBlackCoin");
      expect(info.tokenSymbol).to.equal("BBC");
      expect(info.tokenDecimals).to.equal(18);
      expect(info.totalSupply_).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      await bbc.transfer(addr1.address, TRANSFER_AMOUNT);

      const addr1Balance = await bbc.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(TRANSFER_AMOUNT);
    });

    it("Should fail when sender doesn't have enough tokens", async function () {
      const initialBalance = await bbc.balanceOf(owner.address);

      await expect(
        bbc.connect(addr1).transfer(owner.address, TRANSFER_AMOUNT)
      ).to.be.revertedWithCustomError(bbc, "ERC20InsufficientBalance");

      expect(await bbc.balanceOf(owner.address)).to.equal(initialBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await bbc.balanceOf(owner.address);

      await bbc.transfer(addr1.address, TRANSFER_AMOUNT);
      await bbc.transfer(addr2.address, TRANSFER_AMOUNT);

      const finalOwnerBalance = await bbc.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - TRANSFER_AMOUNT * 2n);

      const addr1Balance = await bbc.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(TRANSFER_AMOUNT);

      const addr2Balance = await bbc.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(TRANSFER_AMOUNT);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      await bbc.mint(addr1.address, MINT_AMOUNT);

      const addr1Balance = await bbc.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(MINT_AMOUNT);

      const totalSupply = await bbc.totalSupply();
      expect(totalSupply).to.equal(INITIAL_SUPPLY + MINT_AMOUNT);
    });

    it("Should not allow non-owner to mint", async function () {
      await expect(
        bbc.connect(addr1).mint(addr2.address, MINT_AMOUNT)
      ).to.be.revertedWithCustomError(bbc, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting to zero address", async function () {
      await expect(
        bbc.mint(ethers.ZeroAddress, MINT_AMOUNT)
      ).to.be.revertedWith("BBC: Cannot mint to zero address");
    });

    it("Should enforce max supply cap", async function () {
      const MAX_SUPPLY = await bbc.MAX_SUPPLY();
      const currentSupply = await bbc.totalSupply();
      const excess = MAX_SUPPLY - currentSupply + 1n;

      await expect(
        bbc.mint(addr1.address, excess)
      ).to.be.revertedWith("BBC: Exceeds maximum supply");
    });

    it("Should emit TokensMinted event", async function () {
      await expect(bbc.mint(addr1.address, MINT_AMOUNT))
        .to.emit(bbc, "TokensMinted")
        .withArgs(addr1.address, MINT_AMOUNT);
    });
  });

  describe("Burning", function () {
    it("Should allow token burning", async function () {
      await bbc.transfer(addr1.address, MINT_AMOUNT);

      await bbc.connect(addr1).burn(ethers.parseEther("10"));

      const addr1Balance = await bbc.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(MINT_AMOUNT - ethers.parseEther("10"));
    });

    it("Should emit TokensBurned event", async function () {
      await bbc.transfer(addr1.address, MINT_AMOUNT);

      const burnAmount = ethers.parseEther("10");
      await expect(bbc.connect(addr1).burn(burnAmount))
        .to.emit(bbc, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });

    it("Should not burn more than balance", async function () {
      await bbc.transfer(addr1.address, MINT_AMOUNT);

      await expect(
        bbc.connect(addr1).burn(MINT_AMOUNT + 1n)
      ).to.be.revertedWithCustomError(bbc, "ERC20InsufficientBalance");
    });
  });

  describe("Airdrop", function () {
    it("Should allow owner to airdrop to multiple addresses", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];

      await bbc.airdrop(recipients, amounts);

      expect(await bbc.balanceOf(addr1.address)).to.equal(amounts[0]);
      expect(await bbc.balanceOf(addr2.address)).to.equal(amounts[1]);
    });

    it("Should require matching array lengths", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseEther("100")];

      await expect(
        bbc.airdrop(recipients, amounts)
      ).to.be.revertedWith("BBC: Arrays length mismatch");
    });

    it("Should not allow non-owner to airdrop", async function () {
      const recipients = [addr2.address];
      const amounts = [ethers.parseEther("100")];

      await expect(
        bbc.connect(addr1).airdrop(recipients, amounts)
      ).to.be.revertedWithCustomError(bbc, "OwnableUnauthorizedAccount");
    });

    it("Should enforce max supply on airdrop", async function () {
      const recipients = new Array(201).fill(addr1.address);
      const amounts = new Array(201).fill(ethers.parseEther("1"));

      await expect(
        bbc.airdrop(recipients, amounts)
      ).to.be.revertedWith("BBC: Too many recipients");
    });
  });

  describe("Circulating Supply", function () {
    it("Should calculate circulating supply correctly", async function () {
      const ownerBalance = await bbc.balanceOf(owner.address);
      const totalSupply = await bbc.totalSupply();
      const expectedCirculating = totalSupply - ownerBalance;

      expect(await bbc.circulatingSupply()).to.equal(expectedCirculating);
    });

    it("Should update circulating supply after transfer", async function () {
      const transferAmount = ethers.parseEther("1000");
      await bbc.transfer(addr1.address, transferAmount);

      const ownerBalance = await bbc.balanceOf(owner.address);
      const totalSupply = await bbc.totalSupply();
      const expectedCirculating = totalSupply - ownerBalance;

      expect(await bbc.circulatingSupply()).to.equal(expectedCirculating);
    });
  });

  describe("Approvals and TransferFrom", function () {
    it("Should approve and transferFrom correctly", async function () {
      await bbc.approve(addr1.address, MINT_AMOUNT);
      expect(await bbc.allowance(owner.address, addr1.address)).to.equal(MINT_AMOUNT);

      await bbc.connect(addr1).transferFrom(owner.address, addr2.address, TRANSFER_AMOUNT);
      expect(await bbc.balanceOf(addr2.address)).to.equal(TRANSFER_AMOUNT);
    });

    it("Should not allow transferFrom without approval", async function () {
      await expect(
        bbc.connect(addr1).transferFrom(owner.address, addr2.address, TRANSFER_AMOUNT)
      ).to.be.revertedWithCustomError(bbc, "ERC20InsufficientAllowance");
    });

    it("Should update allowance after transferFrom", async function () {
      await bbc.approve(addr1.address, MINT_AMOUNT);

      await bbc.connect(addr1).transferFrom(owner.address, addr2.address, TRANSFER_AMOUNT);

      const remainingAllowance = await bbc.allowance(owner.address, addr1.address);
      expect(remainingAllowance).to.equal(MINT_AMOUNT - TRANSFER_AMOUNT);
    });
  });
});
