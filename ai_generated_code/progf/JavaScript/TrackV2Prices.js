//Resources: https://docs.uniswap.org/contracts/v2/reference/API/queries#eth-price
//https://github.com/pyth-network/pyth-js/
// :) Thanks chatGPT for cleaning up the code

import { ethers } from 'ethers';
import fs from 'fs';
import { fetchPythAssetPrice } from "./pyth.js";
import { fetchUniswapV2AssetPrice } from "./uniswapV2.js";

const url = 'https://eth.llamarpc.com';
const provider = new ethers.providers.JsonRpcProvider(url);

// Function to write data to file
function writeDataToFile(uniswapPrice, pythPrice) {
    // Check if the file exists to determine whether to write headers
    const fileExists = fs.existsSync('price_data.csv');

    // Construct the CSV row
    const csvRow = `${uniswapPrice},${pythPrice}\n`;

    // If the file doesn't exist, write headers along with the first row
    if (!fileExists) {
        const headers = 'Uni(WETH/USDC),Pyth(WETH/USD)\n';
        fs.writeFileSync('price_data.csv', headers);
    }

    fs.appendFile('price_data.csv', csvRow, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            //console.log("Data written to file successfully");
        }
    });
}

// Event listener for new Ethereum blocks
provider.on('block', async (blockNumber) => {
    console.log(`New block received: ${blockNumber}`);

    // Fetch prices from Uniswap and Pyth
    const uniswapPrice = await fetchUniswapV2AssetPrice();
    const pythPrice = await fetchPythAssetPrice();

    if (uniswapPrice !== null && pythPrice !== null) {
        // Write prices to file
        writeDataToFile(uniswapPrice, pythPrice);
    }
});