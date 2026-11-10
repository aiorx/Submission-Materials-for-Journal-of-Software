//Resources: https://docs.uniswap.org/contracts/v2/reference/API/queries#eth-price
//https://github.com/pyth-network/pyth-js/
// :) Thanks chatGPT for cleaning up the code

var ethers = require('ethers').ethers;
var fs = require('fs');
var fetchPythAssetPrice = require('./pyth.js').fetchPythAssetPrice;
var fetchUniswapV2AssetPrice = require('./uniswapV2.js').fetchUniswapV2AssetPrice;

var url = 'https://eth.llamarpc.com';
var provider = new ethers.providers.JsonRpcProvider(url);

// Function to write data to file
function writeDataToFile(uniswapPrice, pythPrice) {
    // Check if the file exists to determine whether to write headers
    var fileExists = fs.existsSync('price_data.csv');

    // Construct the CSV row
    var csvRow = "" + (uniswapPrice) + "," + (pythPrice) + "\n";

    // If the file doesn't exist, write headers along with the first row
    if (!fileExists) {
        var headers = 'Uni(WETH/USDC),Pyth(WETH/USD)\n';
        fs.writeFileSync('price_data.csv', headers);
    }

    fs.appendFile('price_data.csv', csvRow, function (err) {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            //console.log("Data written to file successfully");
        }
    });
}

// Event listener for new Ethereum blocks
provider.on('block', async function (blockNumber) {
    console.log("New block received: " + (blockNumber) + "");

    // Fetch prices from Uniswap and Pyth
    var uniswapPrice = await fetchUniswapV2AssetPrice();
    var pythPrice = await fetchPythAssetPrice();

    if (uniswapPrice !== null && pythPrice !== null) {
        // Write prices to file
        writeDataToFile(uniswapPrice, pythPrice);
    }
});