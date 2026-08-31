#include"fileIOs_wordPairs.h"


// Split the file into sentences
void sentenceSplitter( std::string& fname, std::vector<std::string>& sentences)
{
    std::ifstream inFS;
    // outSS is used to store the current sentence
    std::ostringstream outSS;
    inFS.open(fname);
    // If file fails to open, print error message and exit program
    if (!inFS.is_open()) {
        std::cout << "Could not open file Reviews.txt."<< std::endl;
        exit(EXIT_FAILURE);
    }

    // Read each line of the file
    std::string line;
    while (getline(inFS, line)) {
        // Add a special sign to the end of each line, referring to the end of a sentence like . ?
        line = line + "&";
        if (!inFS.fail()) {
            int size = static_cast<int>(line.size());
            for (int i = 0; i < size-1; i++) {
                // Skip leading spaces
                if (line.at(i) == ' ' && outSS.str().empty()) {
                    continue;
                }
                // Skip sentence delimiters . ? ." ?" &
                if (line.at(i) == '.' || line.at(i) == '?') {
                    i = line.at(i+1) == '"' ? i+2 : i+1;
                    continue;
                }
                // Append character to outSS
                outSS << line.at(i);
                // If next character is sentence delimiters . or ? or &, then append current sentence to sentences and clear outSS
                if (line.at(i+1) == '.' || line.at(i+1) == '?' || line.at(i+1) == '&') {
                    sentences.push_back(outSS.str());
                    outSS.str("");
                }
            }
        }
    }

    // If end-of-file not reached, then an error occurred
    if (!inFS.eof()) {
        std::cout << "Error reading " << fname << "." << std::endl;
        exit(EXIT_FAILURE);
    }
    // Close file
    inFS.close();
}

// Map the word pairs to their frequencies
void wordpairMapping(std::vector<std::string>& sentences, std::map<std::pair<std::string, std::string>, int> &wordpairFreq_map)
{
    for(auto &sentence : sentences)
    {
        std::istringstream iss(sentence);
        std::set<std::string> uniqueWords;
        std::string word;
        // Split the sentence into words, and store the words in a set
        while (iss >> word)
        {
            // Convert the word to lowercase
            std::transform(word.begin(), word.end(), word.begin(), ::tolower);
            uniqueWords.insert(word);
        }
        // Iterate through the set of unique words
        for(auto i = uniqueWords.begin(); i != uniqueWords.end(); i++)
        {
            for(auto j = std::next(i); j != uniqueWords.end(); j++)
            {
                std::string word1 = *i;
                std::string word2 = *j;
                // Order the words in a lexicographical order
                if(word1 > word2)
                {
                    std::swap(word1, word2);
                }
                // Make a pair of words
                std::pair<std::string, std::string> wordPair(word1, word2);
                // Add the pair and its frequency into wordpairFreq_map
                wordpairFreq_map[wordPair]++;
            }
        }
    }


}
// Map the word pairs to their frequencies
void freqWordpairMmap(std::map< std::pair<std::string,std::string>, int> &wordpairFreq_map, std::multimap<int, std::pair<std::string,std:: string> > &freqWordpair_mmap ) {
    // Iterate through the wordpairFreq_map
    for (auto &wordpairFreq : wordpairFreq_map) {
        // Insert the word pair and its frequency into freqWordpair_mmap
        freqWordpair_mmap.insert(std::make_pair(wordpairFreq.second, wordpairFreq.first));
    }
}

// Supported by standard GitHub tools
void printWordpairs(std::multimap<int, std::pair<std::string, std::string> > &freqWordpair_multimap, std::string outFname, int topCnt, int botCnt)
{
    std::ofstream outFile(outFname);

    if (!outFile.is_open()) {
        std::cerr << "Error opening the output file." << std::endl;
        return;
    }

    // Print top word pairs
    int countTop = 0;
    for (auto it = freqWordpair_multimap.rbegin(); it != freqWordpair_multimap.rend() && countTop < topCnt; ++it) {
        outFile << "<" << it->second.first << ", " << it->second.second << ">: " << it->first << std::endl;
        ++countTop;
    }

    // Print bottom word pairs
    int countBot = 0;
    for (auto it = freqWordpair_multimap.begin(); it != freqWordpair_multimap.end() && countBot < botCnt; ++it) {
        outFile << "<" << it->second.first << ", " << it->second.second << ">: " << it->first << std::endl;
        ++countBot;
    }

    // Close the output file
    outFile.close();
}


