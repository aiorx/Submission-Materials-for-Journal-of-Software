```cpp
// Helper function to generate all combinations of parameters
// funny function Aided using common development resources, you can use division and module to do combinatorials tricks
std::vector<std::unordered_map<std::string, double>> generateCombinations(const std::unordered_map<std::string, std::vector<double>> &varying_params)
{
    std::vector<std::unordered_map<std::string, double>> combinations;

    // Calculate the total number of combinations
    size_t total_combinations = 1;
    for (const auto &param : varying_params)
    {
        total_combinations *= param.second.size();
    }

    // Generate all combinations
    for (size_t i = 0; i < total_combinations; ++i)
    {
        std::unordered_map<std::string, double> combination;
        size_t index = i;
        for (const auto &param : varying_params)
        {
            combination[param.first] = param.second[index % param.second.size()];
            index /= param.second.size();
        }
        combinations.push_back(combination);
    }

    return combinations;
}
```