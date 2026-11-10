// Underlying functions and things needed for the UI functions
extern int printListGuide; // Browse products/show search results printing guide thingy
extern wstring receiptLocation = L""; // Where to write the receipt
extern bool writeReceipt = true; // To write the receipt or not
DWORD outMode = 0; // Thingy

// To store state of enabling ANSI ESC Code support of terminal
enum ansiEnableState
{
	ANSICON_ENABLED,
	VT_PROCESSING_ENABLED,
	ENABLE_FAIL
};
ansiEnableState ansiState;

// Std Exception to teleport execution back to Actions Panel as the result of selecting the "Back to Home" button (thanks to ChatGPT)
class BackToHome : public std::runtime_error {
public:
	BackToHome(const std::string& msg) : std::runtime_error(msg) {}
};

// Layout information for one cell of a button console
struct buttonConsoleCell
{
	string name;
	string colorCode;
	buttonConsoleCell(string initializeName = "", string initializeColorCode = "")
	{
		name = initializeName;
		colorCode = initializeColorCode;
	}
};

// Easily print out details of a product
ostream& operator<<(ostream& out, product* product)
{
	out << "\033[97m" << setw(4) << left << printListGuide << "|\033[32m " << product->getFullName() << "\n    \033[97m|\033[0m " << product->coutPrice() << " | " << product->coutQty()
		<< " | " << product->coutAmountBought();
	return out;
}

// Better cin string
string promptStringInput(const string& promptText, const string& retryPromptText, bool EOFasESC = false)
{
	string input;
	cout << promptText;
	getline(cin, input);
	if (cin.eof() || input.empty() || input.back() == '\x1A')
	{
		do
		{
			if (cin.eof() && EOFasESC)
			{
				cin.clear();
				return "";
			}
			if (input.back() == '\x1A')
			{
				cout << "\033[F\r\033[J";
			}
			cout << "\033[F\r\033[J";
			cin.clear();
			cout << retryPromptText;
			getline(cin, input);
		} while (cin.fail() || input.empty() || input.back() == '\x1A');
	}
	return input;
}

// Better cin int (if activate EOFasESC, use optional int)
optional<int> promptIntInput(string promptText, const string& retryPromptText, bool EOFasESC = false)
{
	optional<int> returnInt;
	bool retryPromting = false;
	do
	{
		retryPromting = false;
		string input = promptStringInput(promptText, retryPromptText, EOFasESC);
		if (input.empty() && EOFasESC)
		{
			return nullopt;
		}
		try
		{
			size_t pos;
			returnInt = stoi(input, &pos);
			// Check if the entire string was converted (no extra characters)
			if (pos != input.length())
			{
				throw invalid_argument("");
			}
		}
		catch (const invalid_argument& e)
		{
			cerr << "Error: Non-numeric characters were found";
			Sleep(1000);
			cout << "\033[F\r\033[J";
			retryPromting = true;
			promptText = retryPromptText;
		}
		catch (const out_of_range& e)
		{
			cerr << "Error: Integer overflow";
			Sleep(1000);
			cout << "\033[F\r\033[J";
			retryPromting = true;
			promptText = retryPromptText;
		}
	} while (retryPromting);
	return returnInt.value();
}

// Get keyboard presses for button console navigation (thanks ChatGPT)
char getKey()
{
	while (true) 
	{
		char key = _getch();  // Read first key
		if (key == '\r') return 'E';  // Enter key
		// Arrow keys and special keys return two characters
		if (key == 0 || key == -32) 
		{
			key = _getch();  // Read the actual key code
			switch (key) 
			{
				case 72: 
					return 'U';
				case 80: 
					return 'D';
				case 75: 
					return 'L';
				case 77: 
					return 'R';
				default:
					return 'N';
			}
		}
		return 'N';  // Ignore any other key
	}
}

// Button console navigation
string buttonConsole(array<array<buttonConsoleCell, 4>, 3>& buttonArray, int row, int column, int setW = 0)
{
	setW++;
	int rSelection = 0;
	int cSelection = 0;
	char keyPress = 'N';
	do
	{
		for (int r = 0; r < row; r++)
		{
			for (int c = 0; c < column; c++)
			{
				if (rSelection != r || cSelection != c)
				{
					cout << buttonArray[r][c].colorCode << setw(setW) << buttonArray[r][c].name << "\033[0m";
				}
				else
				{
					cout << buttonArray[r][c].colorCode << "\033[1;47m" << setw(setW) << buttonArray[r][c].name
						<< "\033[0m";
				}
			}
			cout << "\n";
		}
		keyPress = getKey();
		switch (keyPress)
		{
			case 'E':
				return buttonArray[rSelection][cSelection].name;
			case 'U':
				if (rSelection > 0)
				{
					rSelection--;
				}
				break;
			case 'D':
				if (rSelection < (row - 1))
				{
					rSelection++;
				}
				break;
			case 'L':
				if (cSelection > 0)
				{
					cSelection--;
				}
				break;
			case 'R':
				if (cSelection < (column - 1))
				{
					cSelection++;
				}
				break;
			default:
				break;
		}
		for (int i = 0; i < row; i++)
		{
			cout << "\033[F";
		}
		cerr << "\r\033[J";
	} while (true);
}

// Random number generator for discounting prices (thanks to ChatGPT)
int genRand(bool doTheOtherGenInstead = false) {
	// Random device and generator
	static random_device rd;
	static ranlux48_base gen(rd());
	if (!doTheOtherGenInstead)
	{
		static uniform_real_distribution<double> probDist(0.0, 1.0);
		double p = probDist(gen);
		if (p < 0.2)
		{
			return -99; // 2% chance: -99
		}
		else if (p < 0.32)
		{
			return uniform_int_distribution<int>(-20, -1)(gen); // 30% chance: -20 to -1
		}
		else if (p < 0.62)
		{
			return 0; // 30% chance: 0
		}
		else if (p < 0.89)
		{
			return uniform_int_distribution<int>(1, 50)(gen); // 27% chance: 1 to 50
		}
		else if (p < 0.99)
		{
			return uniform_int_distribution<int>(51, 80)(gen); // 10% chance: 51 to 80
		}
		else
		{
			return uniform_int_distribution<int>(81, 100)(gen); // 1% chance: 81 to 100
		}
	}
	else
	{
		static uniform_real_distribution<double> prob(300.0, 460.0);
		return static_cast<int>(prob(gen));
	}
}

// Open select folder dialog and return a wstring directory path thanks to ChatGPT
wstring selectFolder()
{
	wstring result;

	HRESULT hr = CoInitializeEx(NULL, COINIT_APARTMENTTHREADED |
		COINIT_DISABLE_OLE1DDE);
	if (SUCCEEDED(hr)) {
		IFileDialog* pFileDialog = nullptr;

		// Create the FileOpenDialog object
		hr = CoCreateInstance(CLSID_FileOpenDialog, NULL, CLSCTX_INPROC_SERVER,
			IID_PPV_ARGS(&pFileDialog));

		if (SUCCEEDED(hr)) {
			// Set options to pick folders only
			DWORD dwOptions;
			if (SUCCEEDED(pFileDialog->GetOptions(&dwOptions))) {
				pFileDialog->SetOptions(dwOptions | FOS_PICKFOLDERS);
			}

			// Show the dialog
			if (SUCCEEDED(pFileDialog->Show(NULL))) {
				IShellItem* pItem = nullptr;
				if (SUCCEEDED(pFileDialog->GetResult(&pItem))) {
					PWSTR pszPath = nullptr;
					if (SUCCEEDED(pItem->GetDisplayName(SIGDN_FILESYSPATH, &pszPath))) {
						result = pszPath;
						CoTaskMemFree(pszPath);
					}
					pItem->Release();
				}
			}
			pFileDialog->Release();
		}
		CoUninitialize();
	}

	return result;
}

// Get executable path of the ors.exe thanks to ChatGPT
wstring getExePath()
{
	wchar_t buffer[MAX_PATH];
	DWORD length = GetModuleFileNameW(NULL, buffer, MAX_PATH);
	return wstring(buffer, length);
}

// Write to receipt file, some parts are created thanks to ChatGPT
bool writeToReceipt()
{
	// Open file using wstring paths but it's ofstream, thanks to ChatGPT
	ofstream rcpt(filesystem::path(receiptLocation.append(L"\\ORS Receipt.rtf")), ios::out | ios::trunc);
	if (!rcpt)
	{
		return false;
	}

	// Get a receipt code by having a randomly generated unsigned int via UuidCreate() underhooad thanks to ChatGPT
	UUID uuid;
	UuidCreate(&uuid);

	unsigned int raw = 0;
	raw |= static_cast<unsigned int>(uuid.Data4[0]) << 24;
	raw |= static_cast<unsigned int>(uuid.Data4[1]) << 16;
	raw |= static_cast<unsigned int>(uuid.Data4[2]) << 8;
	raw |= static_cast<unsigned int>(uuid.Data4[3]);

	const unsigned int min = 1000000000;
	const unsigned int max = 4294967295;
	unsigned int range = max - min + 1;

	unsigned int receiptCode = (raw % range) + min;

	// Get a detailed time value string stream thanks to ChatGPT
	SYSTEMTIME st;
	GetLocalTime(&st);

	string days[] = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
	string months[] = { "January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December" };

	string dayName = days[st.wDayOfWeek];
	string monthName = months[st.wMonth - 1];

	TIME_ZONE_INFORMATION tzInfo;
	GetTimeZoneInformation(&tzInfo);

	int biasMinutes = -tzInfo.Bias;
	int hours = biasMinutes / 60;
	int minutes = abs(biasMinutes % 60);

	ostringstream tzOffset;
	tzOffset << "GMT" << (hours >= 0 ? "+" : "") << hours;
	if (minutes != 0)
		tzOffset << ":" << setfill('0') << setw(2) << minutes;

	ostringstream timeDetail;
	timeDetail << dayName << ", " << monthName << " " << st.wDay << " " << st.wYear << ", "
		<< setfill('0') << setw(2) << st.wHour << ":"
		<< setw(2) << st.wMinute << ":"
		<< setw(2) << st.wSecond << ", "
		<< tzOffset.str();

	// Writing stuff starts here
	rcpt << left
		 << R"({\rtf1\ansi\deff0)" << R"({\fonttbl{\f0 Consolas;}})" << R"(\f0\fs21)" << "\\line "
	     << "Online Retail Store Receipt #" << receiptCode << "\\line "
		 << "Time: " << timeDetail.str() << "\\line "
		 << "-----------------------------------------------------------\\par "
		 << setw(4) << "ID" << "| " << setw(21) << "Product name" << "| " << setw(10) << "Unit cost" << "| " << setw(7) << "Amount" << "| " << "Price\\line ";
	for (int i = 0; i < totalEntries; i++)
	{
		int nameIndex = 0;
		int lineCount = entriesList[i]->getFullName().length() / 20;
		if ((entriesList[i]->getFullName().length() % 20) > 0)
		{
			lineCount;
		}
		rcpt << setw(4) << (i + 1) << "| "
			 << setw(21) << entriesList[i]->getFullName().substr(nameIndex, 20);
		nameIndex += 20;
		lineCount--;
		ostringstream oss;
		oss << "$" << entriesList[i]->getPrice();
		rcpt << "| " << setw(10) << oss.str() << "| " << setw(7) << entriesList[i]->getAmountBought() << "| ";
		oss.str("");
		oss << "$" << (1UL * entriesList[i]->getPrice() * entriesList[i]->getAmountBought());
		rcpt << oss.str();
		rcpt << "\\line ";
		while (lineCount >= 0)
		{
			rcpt << "    | " << setw(21) << entriesList[i]->getFullName().substr(nameIndex, 20) << "|           |        |\\line ";
			nameIndex += 20;
			lineCount--;
		}
	}
	rcpt << "-----------------------------------------------------------\\par ";
	rcpt << ((totalProductAmount == 1) ? "Total product: " : "Total products: ") << totalProductAmount << ((totalProductAmount == 1) ? " product\\line " : " products\\line ")
		 << ((totalEntries == 1) ? "Total entry: " : "Total entries: ") << totalEntries << ((totalEntries == 1) ? " entry\\line " : " entries\\line ")
		 << "Total price: $" << totalPrice << "\\line "
		 << "Price discount: " << discount << "%\\line "
		 << "Final price: $" << finalPrice << "\\line ";
	rcpt << "-----------------------------------------------------------\\par ";
	rcpt << "Thanks for shopping!";

	rcpt << "}\\line ";
	rcpt.close();
	return true;
}

// Function to try to start Ansicon partly thanks to ChatGPT
ansiEnableState startAnsicon()
{
	// Start up Ansicon given that it's in PATH
	STARTUPINFOA si = {sizeof(si)};
    PROCESS_INFORMATION pi;
	char prompt[] = "ansicon.exe -p";
	bool ansiconSuccess = CreateProcessA(NULL, prompt, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi);
	if (!ansiconSuccess)
	{
		return ENABLE_FAIL;
	}
	// Wait until Ansicon finishes DLL injection then closes
	WaitForSingleObject(pi.hProcess, INFINITE);
	CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);
	return ANSICON_ENABLED;
}

// Function to try to enable VT processing partly thanks to ChatGPT
ansiEnableState enableVTProcessing()
{
	HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut == INVALID_HANDLE_VALUE) 
	{
		return ENABLE_FAIL;
	}
	if (!GetConsoleMode(hOut, &outMode))
	{
		return ENABLE_FAIL;
	}
    DWORD requestedOutMode = outMode | ENABLE_VIRTUAL_TERMINAL_PROCESSING;
	if (!SetConsoleMode(hOut, requestedOutMode)) 
	{
        return ENABLE_FAIL;
    }
	DWORD actualMode = 0;
	if (!GetConsoleMode(hOut, &actualMode))
	{
        return ENABLE_FAIL;
    }
	if ((actualMode & ENABLE_VIRTUAL_TERMINAL_PROCESSING) == 0) 
	{
        return ENABLE_FAIL;
    }
	return VT_PROCESSING_ENABLED;
}

// Function to remove VT processing when program ends
void revertTerminalSetting()
{
	HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
	if (hOut == INVALID_HANDLE_VALUE)
	{
		return;
	}
	SetConsoleMode(hOut, outMode);
	return;
}

// Function to change terminal window dimensions thanks to ChatGPT
bool setConsoleDimensions(int bufferWidth, int bufferHeight, int windowWidth, int windowHeight) {
	HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
	if (hOut == INVALID_HANDLE_VALUE) return false;

	// Validate bounds
	if (windowWidth > bufferWidth || windowHeight > bufferHeight)
		return false;

	// Step 1: Resize buffer
	COORD bufferSize = { (SHORT)bufferWidth, (SHORT)bufferHeight };
	if (!SetConsoleScreenBufferSize(hOut, bufferSize)) return false;

	// Step 2: Resize visible window
	SMALL_RECT windowRect = {
		0, 0,
		(SHORT)(windowWidth - 1),
		(SHORT)(windowHeight - 1)
	};
	if (!SetConsoleWindowInfo(hOut, TRUE, &windowRect)) return false;

	return true;
}