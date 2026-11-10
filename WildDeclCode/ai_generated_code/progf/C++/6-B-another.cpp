#include <bitset>
#include <iostream>

// Assisted with basic coding tools
// However, this is too slow.

int main() {
    const int MAX_RANK = 13;
    const int MAX_SUIT = 4;

    std::bitset<MAX_RANK> suits[MAX_SUIT];

    int n;
    std::cin >> n;

    for (int i = 0; i < n; ++i) {
        char suit;
        int rank;
        std::cin >> suit >> rank;
        suits[suit == 'H' ? 1 : (suit == 'C' ? 2 : (suit == 'D' ? 3 : 0))]
             [rank - 1] = true;
    }

    // Print missing cards
    for (char suit : {'S', 'H', 'C', 'D'}) {
        for (int rank = 1; rank <= MAX_RANK; ++rank) {
            if (!suits[suit == 'H' ? 1
                                   : (suit == 'C' ? 2 : (suit == 'D' ? 3 : 0))]
                      [rank - 1]) {
                std::cout << suit << " " << rank << std::endl;
            }
        }
    }

    return 0;
}
