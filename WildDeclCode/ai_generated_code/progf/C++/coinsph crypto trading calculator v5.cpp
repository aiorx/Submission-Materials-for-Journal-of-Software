#include <iostream>
#include <iomanip>
#include <string>
#include <sstream>
#include <limits>

#ifdef _WIN32
#include <windows.h>
#endif

void resizeConsoleWindow() {
#ifdef _WIN32
    HWND console = GetConsoleWindow();
    if (console != NULL) {
        // MoveWindow(hwnd, x, y, width_px, height_px, repaint)
        MoveWindow(console, 100, 100, 650, 500, TRUE); // Width and height in pixels
    }

    // Set the screen buffer size so lines don't wrap or scroll unnecessarily
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut != INVALID_HANDLE_VALUE) {
        CONSOLE_SCREEN_BUFFER_INFO csbi;
        GetConsoleScreenBufferInfo(hOut, &csbi);
        COORD newSize = {120, 500}; // Width in characters, height in lines
        SetConsoleScreenBufferSize(hOut, newSize);
    }
#endif
}


/* 
This Program was written with the help of chatgpt mostly Penned via standard programming aids with logic and prompt handling 
by DeltaTwoZero

Version 6 of the Coinsph Trading calculator

*Added Feature 06/05/2025
	new custom fee for adjusting buy accidentally turned to market order due to ordering near the asking or bid price
	also adds feature separating buy and sell fee rate
	
	Automated the fee application and default fee selection
	
	handles invalid fee input by defaulting to default fee of 0.25%
	
This Program is only for coinsph Trading and cannot be used like a God Calculator use brain for actual trading this 
only helps automate the math logic for faster decision making in the fast moving market	
*/
int main() {
    resizeConsoleWindow(); // set up console size
    std::string input;
    double marketPrice, coinAmount, customExitPrice, sellCoinAmount, totalCapital = 0.0;

    while (true) {
        // Step 1: Ask for total capital or exit
        std::cout << "***************************************************************************\n";
        std::cout << "***************************************************************************\n";
        std::cout << "\n Penned via standard programming aids, Prompt and code checking and testing my DeltaTwoZero \n";
        std::cout << "\n Coinsph Crypto Trading Calculator Version 6 \n";
        std::cout << "\n Enter your total capital or type 'exit' to quit \n";
        std::cout << "\n type exit on any input field to exit the application \n";
        std::cout << "\n type clear to clear the console and restart the application \n";
        std::cout << "\n***************************************************************************\n";
        std::cout << "***************************************************************************\n";
        std::cout << "Capital: ";
        
        std::getline(std::cin, input);

        if (input == "exit" || input == "EXIT") break;
        if (input == "clear" || input == "CLEAR") {
            system("cls"); // Clear console on Windows
            continue;
        }
        
        std::stringstream capitalStream(input);
        if (!(capitalStream >> totalCapital)) {
            std::cout << "Invalid input. Please enter a valid number for total capital.\n";
            continue;
        }
        
    // --- Fee Input Code ---
	//std::string input;
	int vipLevel = 0;
	double buyFeeRate = 0.0025;
	double sellFeeRate = 0.0025;

	bool isCustom = false;
	bool sameFee = true;

	std::cout << "\n***************************************************************************\n";
	std::cout << "--- Select Your Coins.ph VIP Tier Level (0-9) or type 'custom' ---\n";
	std::cout << "VIP 0: Maker 0.25%\n";
	std::cout << "VIP 1: Maker 0.22%\n";
	std::cout << "VIP 2: Maker 0.18%\n";
	std::cout << "VIP 3: Maker 0.15%\n";
	std::cout << "VIP 4: Maker 0.12%\n";
	std::cout << "VIP 5: Maker 0.10%\n";
	std::cout << "VIP 6: Maker 0.08%\n";
	std::cout << "VIP 7: Maker 0.07%\n";
	std::cout << "VIP 8: Maker 0.06%\n";
	std::cout << "VIP 9: Maker 0.05%\n";
	std::cout << "Type 'custom' to enter your own buy/sell fee.\n";
	std::cout << "Enter VIP Tier (0-9) or 'custom': ";
	std::getline(std::cin, input);

    if (input == "exit" || input == "EXIT") break;
    if (input == "clear" || input == "CLEAR") {
        system("cls"); // Clear console on Windows
        continue;
    }
	// --- Fee Decision Logic ---
	if (input == "custom" || input == "Custom" || input == "CUSTOM") {
    	isCustom = true;

	    std::cout << "Use the same fee for Buy and Sell? (yes/no): ";
    	std::getline(std::cin, input);
   		sameFee = (input == "yes" || input == "Yes");

    	if (input == "exit" || input == "EXIT") break;
    	if (input == "clear" || input == "CLEAR") {
        	system("cls"); // Clear console on Windows
        	continue;
    	}
    	if (sameFee) {
    	    std::cout << "Enter fee % for both Buy and Sell (e.g., 0.30 for 0.30%): ";
   	 	    std::getline(std::cin, input);
   	 	    std::stringstream feeStream(input);
    	    double feePercent;
    		if (input == "exit" || input == "EXIT") break;
    		if (input == "clear" || input == "CLEAR") {
        		system("cls"); // Clear console on Windows
        		continue;
    		}
        if (!(feeStream >> feePercent) || feePercent < 0 || feePercent > 100)
    	        feePercent = 0.30;
    	    buyFeeRate = sellFeeRate = feePercent / 100.0;
    	} else {
   		     std::cout << "Enter Buy fee % (e.g., 0.30 for 0.30%): ";
   		     std::getline(std::cin, input);
    		if (input == "exit" || input == "EXIT") break;
    		if (input == "clear" || input == "CLEAR") {
        		system("cls"); // Clear console on Windows
        		continue;
    		}
   		    std::stringstream buyStream(input);
   	     double feePercent;
    	    if (!(buyStream >> feePercent) || feePercent < 0 || feePercent > 100)
        	    feePercent = 0.30;
    	    buyFeeRate = feePercent / 100.0;

	        std::cout << "Enter Sell fee % (e.g., 0.25 for 0.25%): ";
    	    std::getline(std::cin, input);
    		if (input == "exit" || input == "EXIT") break;
    		if (input == "clear" || input == "CLEAR") {
        		system("cls"); // Clear console on Windows
        		continue;
    		}
	        std::stringstream sellStream(input);
	        if (!(sellStream >> feePercent) || feePercent < 0 || feePercent > 100)
    	   	    feePercent = 0.25;
    	    sellFeeRate = feePercent / 100.0;
	    }

	} else {
	   	std::stringstream vipStream(input);
    	if (!(vipStream >> vipLevel) || vipLevel < 0 || vipLevel > 9) {
    	    std::cout << "Invalid VIP tier selected. Defaulting to VIP 0.\n";
    	    vipLevel = 0;
	    }
	    double makerRates[] = {0.0025, 0.0022, 0.0018, 0.0015, 0.0012, 0.0010, 0.0008, 0.0007, 0.0006, 0.0005};
	    buyFeeRate = sellFeeRate = makerRates[vipLevel];
	}	

		// --- After this, buyFee and sellFee are ready to use ---
		double buyFeeRateUsed = buyFeeRate * 100;
		double sellFeeRateUsed = sellFeeRate * 100;
		std::cout << "\nApplied Buy Fee: " << buyFeeRateUsed << "%\n";
		std::cout << "Applied Sell Fee: " << sellFeeRateUsed << "%\n";


		
        // Step 3: Ask for the market price
        std::cout << "\nEnter the market price: ";
        std::getline(std::cin, input);
    	if (input == "exit" || input == "EXIT") break;
    	if (input == "clear" || input == "CLEAR") {
        	system("cls"); // Clear console on Windows
        	continue;
    	}
        std::stringstream priceStream(input);
        if (!(priceStream >> marketPrice)) {
            std::cout << "Invalid input. Please enter a valid number for market price.\n";
            continue;
        }

        // Step 4: Ask for the coin amount to buy
        std::cout << "Enter the amount of coin you bought: ";
        std::getline(std::cin, input);
    	if (input == "exit" || input == "EXIT") break;
    	if (input == "clear" || input == "CLEAR") {
        	system("cls"); // Clear console on Windows
        	continue;
    	}
        std::stringstream coinStream(input);
        if (!(coinStream >> coinAmount)) {
            std::cout << "Invalid input. Please enter a valid number for coin amount.\n";
            continue;
        }

        // Step 5: Ask for the exit market price
        std::cout << "Enter your planned custom exit price: ";
        std::getline(std::cin, input);
    	if (input == "exit" || input == "EXIT") break;
    	if (input == "clear" || input == "CLEAR") {
        	system("cls"); // Clear console on Windows
        	continue;
    	}
        std::stringstream customExitStream(input);
        if (!(customExitStream >> customExitPrice)) {
            std::cout << "Invalid input. Please enter a valid number for custom exit price.\n";
            continue;
        }

        // Step 6: Ask for how many coins to sell
        std::cout << "Enter how many coins you plan to sell (can be less than bought): ";
        std::getline(std::cin, input);
    	if (input == "exit" || input == "EXIT") break;
    	if (input == "clear" || input == "CLEAR") {
        	system("cls"); // Clear console on Windows
        	continue;
    	}
        std::stringstream sellAmountStream(input);
        if (!(sellAmountStream >> sellCoinAmount)) {
            std::cout << "Invalid input. Please enter a valid number for selling coin amount.\n";
            continue;
        }

        // --- Perform Calculations ---
        double rawBuyCost = marketPrice * coinAmount;
        double buyFee = rawBuyCost * buyFeeRate;
        double totalBuyCost = rawBuyCost + buyFee;

        std::cout << std::fixed << std::setprecision(6);
        std::cout << "\n***************************************************************************\n";
        std::cout << "\n--------------------------= Buy Information =------------------------------\n";
        std::cout << "Market Price: PHP " << marketPrice << "\n";
        std::cout << "Coin Amount Bought: " << coinAmount << "\n";
        std::cout << "Raw Buy Cost (Capital): PHP " << rawBuyCost << "\n";
        std::cout << "Buy Fee (" << buyFeeRateUsed << "%): PHP " << buyFee << "\n";
        std::cout << "Total Buy Cost: PHP " << totalBuyCost << "\n";
        std::cout << "\n***************************************************************************\n";
		
		// --- Brute-Force Break Even Calculation ---
        double testSellGross = totalBuyCost;
        double sellFee, netAfterSell;
        double step = 0.01;
        int loops = 0;

        while (true) {
            sellFee = testSellGross * sellFeeRate;
            netAfterSell = testSellGross - sellFee;

            if (netAfterSell >= totalBuyCost) {
                break;
            }

            testSellGross += step;
            loops++;

            // Prevent infinite loops on extremely small coin amounts
            if (loops > 1000000) {
                std::cout << "Brute-force calculation took too long, likely due to very small coin amount.\n";
                break;
            }
        }

        double breakEvenPriceBruteForce = testSellGross / coinAmount;
		double BEtotalcost = totalBuyCost + sellFee;
		double NetPL = testSellGross - BEtotalcost;

        std::cout << "\n----------------------= Brute-Force Break Even =---------------------------\n";
        std::cout << "Brute Force Break Even Sell Price: PHP " << breakEvenPriceBruteForce << "\n";
        std::cout << "Gross Sell at Break Even: PHP " << testSellGross << "\n";
        std::cout << "Sell Fee (" << sellFeeRateUsed  << "%): PHP " << sellFee << "\n";
        std::cout << "Net After Sell: PHP " << netAfterSell << "\n";
        std::cout << "Total Loop Steps Taken: " << loops << "\n";
		std::cout << rawBuyCost << " + " << buyFee << " + " << sellFee << " = " << BEtotalcost << "\n";
		std::cout << testSellGross << " - " << BEtotalcost << " = " << NetPL << "\n";

        // --- Target Exit Calculations (1.6% and 2.6%) --- tier fee padded by 1.1% and 2.1% 
        
        std::cout << "\n***************************************************************************";
		std::cout << "\n------------------------= Target Exit Prices =-----------------------------\n";
		std::cout << "***************************************************************************\n";

		double targetRates[2];
		// Calculate the target rates, including maker fee adjustment
		targetRates[0] = 0.011 + (buyFeeRate  + sellFeeRate);  // 1.1% plus the tiered fee respectively
		targetRates[1] = 0.021 + (buyFeeRate  + sellFeeRate);  // 2.1% plus the tiered fee respectively

		for (int i = 0; i < 2; ++i) {
    	// Calculate market exit price, based on the target rate (with fee adjustment)
    	double marketExitPrice = marketPrice * (1.0 + targetRates[i]);

	    double grossProfit = marketExitPrice * coinAmount;
    	double sellFee = grossProfit * sellFeeRate;
    	double netProfit = grossProfit - totalBuyCost - sellFee;

	    // Print the target exit price as a percentage (converted from decimal)
    	double targetLabel = 100 * targetRates[i]; // Calculate percentage
    	std::cout << targetLabel << "% Target Market Exit Price: PHP " << marketExitPrice << "\n";
    	std::cout << "Gross Profit: PHP " << grossProfit << "\n";
    	std::cout << "Net Profit: PHP " << netProfit << "\n";
    	std::cout << "***************************************************************************\n";
		}


        // --- Custom Exit Calculation ---
        std::cout << "\n----------------------= Custom Exit Simulation =---------------------------\n";
        std::cout << "---------------------------------------------------------------------------\n";
        std::cout << "Custom Exit Price:                             PHP " << customExitPrice << "\n";
        std::cout << "---------------------------------------------------------------------------\n";
        std::cout << "Coin Amount to Sell:                               " << sellCoinAmount << "\n";
        std::cout << "---------------------------------------------------------------------------\n";

        double customGrossSale = customExitPrice * sellCoinAmount;
        double customSellFee = customGrossSale * sellFeeRate;
        
        /**************************************************************************
        this calculation is wrong when you sell more than the amount of coins you bought
		double proportionalBuyCost = (totalBuyCost / coinAmount) * sellCoinAmount;
		***************************************************************************
		this one works like the new one but the other one looks nicer
        double extraFreeCoins = sellCoinAmount - coinAmount;
		if (extraFreeCoins < 0) extraFreeCoins = 0;
		double proportionalBuyCost = totalBuyCost + (0 * extraFreeCoins);
		*/
		
		//new proportional buy cost calculation ignoring the sell amount of coins if it's greater than the 
		//buy amount to show the proper net gain
		double proportionalBuyCost;
		if (sellCoinAmount <= coinAmount)
    		proportionalBuyCost = (totalBuyCost / coinAmount) * sellCoinAmount;
		else
    		proportionalBuyCost = totalBuyCost;  // Only count what you actually paid for

        double customNetSale = customGrossSale - customSellFee;
        double customNetProfit = customGrossSale - proportionalBuyCost - customSellFee;

        std::cout << "Gross Sale:                                    PHP " << customGrossSale << "\n";
        std::cout << "---------------------------------------------------------------------------\n";
        std::cout << "Sell Fee (" << sellFeeRateUsed  << "%):                          PHP " << customSellFee << "\n";
        std::cout << "---------------------------------------------------------------------------\n";
        std::cout << "Proportional Buy Cost:                         PHP " << proportionalBuyCost << "\n";
        std::cout << "---------------------------------------------------------------------------\n";
        std::cout << "Net Sale (After Sell Fee):                     PHP " << customNetSale << "\n";
        std::cout << "---------------------------------------------------------------------------\n";
        std::cout << "Net Profit (After Total Buy Cost + Sell Fees): PHP " << customNetProfit << "\n";
        std::cout << "---------------------------------------------------------------------------\n";

        // --- Custom Exit Percent Gain ---
        double percentGain = (customNetProfit / rawBuyCost) * 100.0;
        std::cout << "\n***************************************************************************\n";
        std::cout << "-------------------------= Market Movement =-------------------------------\n";
        std::cout << "Custom Exit is a " << percentGain << "% gain from initial capital buy amount.\n";

        // --- Custom Exit Market Movement ---
        double percentGain2 = ((customExitPrice - marketPrice) / marketPrice) * 100;
        std::cout << "Custom Exit is a " << percentGain2 << "% Market movement\n";

        // Update total capital after profit/loss
        //totalCapital += customNetProfit;
        double updatedtotalCapital = totalCapital + customNetProfit;
        std::cout << "--------------------------= Capital Update =-------------------------------\n";
        std::cout << "Total Capital:                                 PHP " << totalCapital << "\n";
        std::cout << "Updated Total Capital:                         PHP " << updatedtotalCapital << "\n";
        std::cout << "***************************************************************************\n";

        // Program loops back to asking total capital
    }

    return 0;
}
