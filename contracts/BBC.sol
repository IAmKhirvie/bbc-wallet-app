// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BigBlackCoin
 * @dev Implementation of the BBC token (ERC-20)
 * This is an educational project to learn about blockchain development
 */
contract BigBlackCoin is ERC20, ERC20Burnable, Ownable {
    // Events for tracking token activities
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    // Maximum supply cap (for learning supply controls)
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18; // 10 billion BBC

    /**
     * @dev Constructor that mints initial supply to the deployer
     * Initial supply: 1,000,000 BBC (1 million tokens)
     */
    constructor() ERC20("BigBlackCoin", "BBC") Ownable(msg.sender) {
        uint256 initialSupply = 1_000_000 * 10**18; // 1 million BBC
        _mint(msg.sender, initialSupply);
        emit TokensMinted(msg.sender, initialSupply);
    }

    /**
     * @dev Mints new tokens to a specified address
     * Only the owner can call this function
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint (in wei/smallest unit)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "BBC: Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "BBC: Exceeds maximum supply");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Burns tokens from the caller's balance
     * Overrides the burn function to add our custom event
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Returns the number of decimals used by the token
     * ERC20 standard uses 18 decimals
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @dev Get detailed token information
     * Returns name, symbol, decimals, total supply, and max supply
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 totalSupply_,
        uint256 maxSupply_,
        uint256 ownerBalance
    ) {
        return (
            ERC20.name(),
            ERC20.symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY,
            balanceOf(owner())
        );
    }

    /**
     * @dev Allows the owner to batch airdrop tokens to multiple addresses
     * @param recipients Array of addresses to receive tokens
     * @param amounts Array of amounts for each recipient
     */
    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "BBC: Arrays length mismatch");
        require(recipients.length > 0, "BBC: No recipients");
        require(recipients.length <= 200, "BBC: Too many recipients");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(totalSupply() + totalAmount <= MAX_SUPPLY, "BBC: Airdrop exceeds max supply");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            emit TokensMinted(recipients[i], amounts[i]);
        }
    }

    /**
     * @dev Get the circulating supply (total supply minus owner's balance)
     * This is useful for tokenomics analysis
     */
    function circulatingSupply() external view returns (uint256) {
        return totalSupply() - balanceOf(owner());
    }
}
