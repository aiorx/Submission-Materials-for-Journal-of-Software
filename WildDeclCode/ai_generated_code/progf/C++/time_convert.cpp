#include <string>
#include <sstream>
#include <iostream>

using namespace std;

/**
 * Built via basic programming aids 4
*/

int convertToSeconds(const string& time) {
    stringstream ss(time);
    int minutes, seconds;
    char colon;

    ss >> minutes >> colon >> seconds;

    return minutes * 60 + seconds;
}

int convertToSeconds2(const string& time) {
    int minutes = stoi(time.substr(0, 2));
    int seconds = stoi(time.substr(3));

    return minutes * 60 + seconds;
}

int main() {
    std::string timeStr = "05:30";
    int timeInSeconds = convertToSeconds(timeStr);
    int timeInSeconds2 = convertToSeconds2(timeStr);

    cout << "[1] The time " << timeStr << " in seconds is: " << timeInSeconds << endl;
    cout << "[2] The time " << timeStr << " in seconds is: " << timeInSeconds2 << endl;

    return 0;
}
