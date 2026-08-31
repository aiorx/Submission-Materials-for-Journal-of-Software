```cpp
// Code Aided using common development resources to study how input similarity affects algorithm performance
// the code takes as input a sequence, how many characters you want to (randomly) change, and a string of characters
// to choose from
std::string mutate_amino_acids(const std::string& sequence, int num_mutations, const std::string& amino_acids) {
    if (sequence.empty() || num_mutations <= 0) {
        return sequence;
    }

    std::string mutated = sequence;
    int len = mutated.size();
    num_mutations = std::min(num_mutations, len);

    std::random_device rd;
    std::mt19937 gen(rd());
    std::unordered_set<int> mutated_indices;

    while (mutated_indices.size() < static_cast<size_t>(num_mutations)) {
        mutated_indices.insert(gen() % len);
    }

    for (int idx : mutated_indices) {
        char original = mutated[idx];

        // Create a pool excluding the original character
        std::vector<char> options;
        for (char c : amino_acids) {
            if (c != original) {
                options.push_back(c);
            }
        }

        if (!options.empty()) {
            std::uniform_int_distribution<> dis(0, options.size() - 1);
            mutated[idx] = options[dis(gen)];
        }
    }

    return mutated;
}
```