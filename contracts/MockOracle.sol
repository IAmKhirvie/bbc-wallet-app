// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockOracle
 * @dev A mock price oracle for educational purposes
 * Returns mock prices for cryptocurrencies in USD
 * In production, you would use Chainlink Price Feeds or similar
 */
contract MockOracle is Ownable {
    // Price data structure (price with 8 decimals, like Chainlink)
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        bool exists;
    }

    // Mapping of token symbol to price data
    mapping(string => PriceData) private prices;

    // Supported currencies
    string[] public supportedCurrencies;

    // Events
    event PriceUpdated(string currency, uint256 newPrice);
    event CurrencyAdded(string currency);

    /**
     * @dev Constructor sets initial mock prices
     */
    constructor() Ownable(msg.sender) {
        // Initialize with mock prices (in USD with 8 decimals)
        _setPrice("BBC", 100000000);      // $1.00 per BBC
        _setPrice("ETH", 300000000000);  // $3,000 per ETH
        _setPrice("BTC", 50000000000);   // $50,000 per BTC
        _setPrice("USD", 100000000);     // $1.00 (base currency)
        _setPrice("EUR", 108000000);     // $1.08 per EUR
        _setPrice("GBP", 127000000);     // $1.27 per GBP

        // Add to supported currencies
        supportedCurrencies = ["BBC", "ETH", "BTC", "USD", "EUR", "GBP"];
    }

    /**
     * @dev Get the price of a currency in USD (with 8 decimals)
     * @param currency The currency symbol (e.g., "BBC", "ETH")
     * @return The price in USD (8 decimals)
     */
    function getPrice(string memory currency) external view returns (uint256) {
        PriceData memory data = prices[currency];
        require(data.exists, string(abi.encodePacked("Price not found for: ", currency)));
        return data.price;
    }

    /**
     * @dev Get the price of a currency with timestamp
     * @param currency The currency symbol
     * @return price The price in USD (8 decimals)
     * @return timestamp When the price was last updated
     */
    function getPriceWithTimestamp(string memory currency) external view returns (uint256 price, uint256 timestamp) {
        PriceData memory data = prices[currency];
        require(data.exists, string(abi.encodePacked("Price not found for: ", currency)));
        return (data.price, data.timestamp);
    }

    /**
     * @dev Convert an amount from one currency to another
     * @param amount The amount to convert (with 18 decimals)
     * @param fromCurrency The source currency symbol
     * @param toCurrency The destination currency symbol
     * @return The converted amount (with 18 decimals)
     */
    function convert(
        uint256 amount,
        string memory fromCurrency,
        string memory toCurrency
    ) external view returns (uint256) {
        uint256 fromPrice = prices[fromCurrency].price;
        uint256 toPrice = prices[toCurrency].price;

        require(fromPrice > 0 && toPrice > 0, "Invalid price data");

        // Convert: amount * fromPrice / toPrice
        // Adjust for decimal differences (amount has 18, prices have 8)
        return (amount * fromPrice) / toPrice;
    }

    /**
     * @dev Get the BBC price specifically
     * @return The price of BBC in USD (8 decimals)
     */
    function getBBCPrice() external view returns (uint256) {
        return prices["BBC"].price;
    }

    /**
     * @dev Update the price of a currency (owner only)
     * @param currency The currency symbol
     * @param newPrice The new price in USD (8 decimals)
     */
    function updatePrice(string memory currency, uint256 newPrice) external onlyOwner {
        _setPrice(currency, newPrice);
        emit PriceUpdated(currency, newPrice);
    }

    /**
     * @dev Batch update multiple prices
     * @param currencies Array of currency symbols
     * @param newPrices Array of new prices
     */
    function batchUpdatePrices(
        string[] calldata currencies,
        uint256[] calldata newPrices
    ) external onlyOwner {
        require(currencies.length == newPrices.length, "Arrays length mismatch");

        for (uint256 i = 0; i < currencies.length; i++) {
            _setPrice(currencies[i], newPrices[i]);
            emit PriceUpdated(currencies[i], newPrices[i]);
        }
    }

    /**
     * @dev Add a new supported currency
     * @param currency The currency symbol
     * @param initialPrice The initial price in USD (8 decimals)
     */
    function addCurrency(string memory currency, uint256 initialPrice) external onlyOwner {
        require(!prices[currency].exists, "Currency already exists");
        supportedCurrencies.push(currency);
        _setPrice(currency, initialPrice);
        emit CurrencyAdded(currency);
    }

    /**
     * @dev Get all supported currencies
     * @return Array of currency symbols
     */
    function getSupportedCurrencies() external view returns (string[] memory) {
        return supportedCurrencies;
    }

    /**
     * @dev Get multiple prices at once
     * @param currencies Array of currency symbols
     * @return Array of prices
     */
    function getBatchPrices(string[] calldata currencies) external view returns (uint256[] memory) {
        uint256[] memory priceArray = new uint256[](currencies.length);

        for (uint256 i = 0; i < currencies.length; i++) {
            PriceData memory data = prices[currencies[i]];
            require(data.exists, string(abi.encodePacked("Price not found for: ", currencies[i])));
            priceArray[i] = data.price;
        }

        return priceArray;
    }

    /**
     * @dev Internal function to set price data
     */
    function _setPrice(string memory currency, uint256 price) private {
        prices[currency] = PriceData({
            price: price,
            timestamp: block.timestamp,
            exists: true
        });
    }

    /**
     * @dev Get formatted price for display (scales to 2 decimals)
     * @param currency The currency symbol
     * @return The price as a formatted string (for frontend use)
     */
    function getFormattedPrice(string memory currency) external view returns (string memory) {
        uint256 price = prices[currency].price;
        // Return price / 100000000 as a number
        // In a real app, this would be formatted differently
        return ""; // Frontend handles formatting
    }
}
