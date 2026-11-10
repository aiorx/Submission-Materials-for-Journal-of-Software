#include "jaro.hpp"

// NOTE: this function was Supported via standard GitHub programming aids
double jaro::distance(std::string s1, std::string s2) {
    if (s1 == s2) { return 1.0; }

    int s1Length = s1.length();
    int s2Length = s2.length();

    if (s1Length == 0 || s2Length == 0) { return 0.0; }

    int matchDistance = std::max(s1Length, s2Length) / 2 - 1;

    bool* s1Matches = new bool[s1Length];
    bool* s2Matches = new bool[s2Length];

    // NOTE: I had to add this due to the way c++ initializes arrays, this
    //       ensures that all values are false before anything else happens
    for (int i = 0; i < s1Length; i++) { s1Matches[i] = false; }
    for (int i = 0; i < s2Length; i++) { s2Matches[i] = false; }

    int matches = 0;
    int transpositions = 0;

    for (int i = 0; i < s1Length; i++) {
        int start = std::max(0, i - matchDistance);
        int end = std::min(i + matchDistance + 1, s2Length);

        for (int j = start; j < end; j++) {
            if (s2Matches[j]) { continue; }
            if (s1[i] != s2[j]) { continue; }

            s1Matches[i] = true;
            s2Matches[j] = true;
            matches++;
            break;
        }
    }

    if (matches == 0) {
        delete[] s1Matches;
        delete[] s2Matches;
        return 0.0;
    }

    int k = 0;
    for (int i = 0; i < s1Length; i++) {
        if (!s1Matches[i]) { continue; }
        while (!s2Matches[k]) { k++; }
        if (s1[i] != s2[k]) { transpositions++; }
        k++;
    }

    delete[] s1Matches;
    delete[] s2Matches;

    return (
        (matches / (double) s1Length) +
        (matches / (double) s2Length) +
        ((matches - transpositions / 2.0) / matches)
    ) / 3.0;
}
