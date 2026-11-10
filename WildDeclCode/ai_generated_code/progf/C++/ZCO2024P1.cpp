#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
using ll = long long;

struct Veg {
    ll benefit; // water saved per upgrade (B[i] if A[i] < B[i], else A[i])
    ll cost;    // maximum upgrades allowed on this vegetable (A[i] if A[i] < B[i], else B[i])
};

int main(){
    // Disable synchronization with C I/O for faster input/output
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // N = number of vegetables, Q = number of queries
    int N, Q;
    cin >> N >> Q;
    
    // A[i] = amount of water needed per day for vegetable i
    // B[i] = number of days vegetable i needs to be watered
    vector<ll> A(N), B(N);
    ll totalWater = 0;
    
    // Read the water needed per day (A) for each vegetable
    for (int i = 0; i < N; i++){
        cin >> A[i];
    }
    
    // Read the number of days (B) for each vegetable
    for (int i = 0; i < N; i++){
        cin >> B[i];
    }
    
    // Calculate total water needed without any upgrades
    // Total water = sum of (water per day × number of days) for each vegetable
    for (int i = 0; i < N; i++){
        totalWater += A[i] * B[i];
    }
    
    // Create a vector to store the best upgrade strategy for each vegetable
    vector<Veg> vegs;
    for (int i = 0; i < N; i++){
        // For each vegetable, we can either:
        // 1. Reduce the water per day (A[i])
        // 2. Reduce the number of days (B[i])
        
        // If A[i] is less than B[i], it's better to reduce A[i]
        // Because reducing A[i] by 1 saves B[i] water
        if (A[i] < B[i]) {
            // benefit = water saved per upgrade (B[i])
            // cost = maximum possible upgrades (A[i])
            vegs.push_back({B[i], A[i]});
        } else {
            // Otherwise, it's better to reduce B[i]
            // Because reducing B[i] by 1 saves A[i] water
            vegs.push_back({A[i], B[i]});
        }
    }
    
    // Sort vegetables by benefit (water saved per upgrade)
    // Higher benefit vegetables come first
    sort(vegs.begin(), vegs.end(), [](const Veg &v1, const Veg &v2) {
        return v1.benefit > v2.benefit;
    });
    
    // Process each query
    for (int qi = 0; qi < Q; qi++){
        // X = number of upgrades available for this query
        ll X;
        cin >> X;
        
        // Track how much water we can save with the upgrades
        ll saved = 0;
        
        // Try to use upgrades on vegetables, starting with the most beneficial
        for (int i = 0; i < vegs.size() && X > 0; i++){
            // Calculate how many upgrades we can use on this vegetable
            // We take the minimum of:
            // 1. How many upgrades are possible for this vegetable (vegs[i].cost)
            // 2. How many upgrades we have left (X)
            ll use = min(vegs[i].cost, X);
            
            // Calculate water saved from these upgrades
            saved += use * vegs[i].benefit;
            
            // Reduce remaining upgrades
            X -= use;
        }
        
        // Print the final water needed after upgrades
        cout << totalWater - saved << "\n";
    }
    return 0;
}





































// this is my own code for this problem (it exceeds the time limit on a few cases so the result was 46/100.).
typedef long long ll;

#include <bits/stdc++.h>
using namespace std;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n , q;
    cin >> n >> q;
    vector<ll> Demand(n);
    vector<ll> Water(n);
    vector<ll> Queries(q);
    vector<pair<ll,ll>> pairs(n);
    for(int i = 0; i < n; i++)
    {
        cin >> Demand[i];
    }
    for(int i = 0; i < n; i++)
    {
        cin >> Water[i];
    }
    for(int i = 0; i < n; i++)
    {
        pairs[i].first = max(Demand[i], Water[i]);
        if(Demand[i] != Water[i])
        {
            pairs[i].second = min(Demand[i],Water[i]);
        }
        else
        {
            pairs[i].second = Demand[i];
        }
    }
    for (int i = 0; i < q; i++)
    {
        ll x;
        cin >> x;
        Queries[i] = x;
    }
    for (int i = 0; i < q; i++)
    {
        vector<pair<ll,ll>> temp = pairs;
        ll sum = 0;
        sort(temp.begin(),temp.end());// putting this inisde the very next loop does not work! 
        //i will do some reseach on this but for now i have found an indipendent solution to this problem
        //i found this solution while trying to make the problem more efficient so that we do not have to sort the whole array everytime
        for(int j = 0; j < Queries[i]; j++)
        {
            if(temp[n-1].second == 0)
            {
                temp[n-1].first = 0;
                sort(temp.begin(),temp.end());
            }
            temp[n-1].second--;
        }
        for(int j = 0; j < n; j++)
        {
            sum += temp[j].first * temp[j].second;
        }
        cout << sum << "\n";
    }
}





















// this is a readable solution the same as in the actual file and Formed using common development resources
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
typedef long long longIntegerType;

// A structure representing the characteristics of each vegetable.
// The variable 'reductionValuePerOperation' represents the maximum of the demand and water values,
// which is the amount by which the vegetable's value is reduced per operation.
// The variable 'totalOperationsAllowedForVegetable' represents the minimum of the demand and water values
// (or it is equal to the maximum if they are the same) and corresponds to the maximum number of operations
// that can be applied to that vegetable.
struct VegetableCharacteristics {
    longIntegerType reductionValuePerOperation;
    longIntegerType totalOperationsAllowedForVegetable;
};

int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // Read the number of vegetables and the number of queries.
    int numberOfVegetables, numberOfQueries;
    cin >> numberOfVegetables >> numberOfQueries;
    
    // Read the demand values for each vegetable.
    vector<longIntegerType> vegetableDemandValues(numberOfVegetables);
    // Read the water requirement values for each vegetable.
    vector<longIntegerType> vegetableWaterRequirementValues(numberOfVegetables);
    
    for (int indexForVegetable = 0; indexForVegetable < numberOfVegetables; indexForVegetable++){
        cin >> vegetableDemandValues[indexForVegetable];
    }
    
    for (int indexForVegetable = 0; indexForVegetable < numberOfVegetables; indexForVegetable++){
        cin >> vegetableWaterRequirementValues[indexForVegetable];
    }
    
    // Create a vector of structures to store the computed characteristics for each vegetable.
    vector<VegetableCharacteristics> characteristicsForEachVegetable(numberOfVegetables);
    for (int indexForVegetable = 0; indexForVegetable < numberOfVegetables; indexForVegetable++){
        // The reduction value per operation is the maximum between the demand and water requirement.
        longIntegerType reductionValuePerOperationForVegetable = max(vegetableDemandValues[indexForVegetable], vegetableWaterRequirementValues[indexForVegetable]);
        // The maximum number of operations that can be applied is the minimum between the demand and water requirement,
        // or equal to the demand if both are equal.
        longIntegerType maximumOperationsAllowedForVegetable;
        if (vegetableDemandValues[indexForVegetable] == vegetableWaterRequirementValues[indexForVegetable]) {
            maximumOperationsAllowedForVegetable = vegetableDemandValues[indexForVegetable];
        } else {
            maximumOperationsAllowedForVegetable = min(vegetableDemandValues[indexForVegetable], vegetableWaterRequirementValues[indexForVegetable]);
        }
        characteristicsForEachVegetable[indexForVegetable] = {reductionValuePerOperationForVegetable, maximumOperationsAllowedForVegetable};
    }
    
    // Compute the total initial value which is the sum for each vegetable of:
    // (reductionValuePerOperation * totalOperationsAllowedForVegetable).
    longIntegerType initialTotalValueOfAllVegetables = 0;
    for (int indexForVegetable = 0; indexForVegetable < numberOfVegetables; indexForVegetable++){
        initialTotalValueOfAllVegetables += characteristicsForEachVegetable[indexForVegetable].reductionValuePerOperation *
                                               characteristicsForEachVegetable[indexForVegetable].totalOperationsAllowedForVegetable;
    }
    
    // Sort the vegetables in descending order based on the reductionValuePerOperation.
    // This ensures that vegetables which give the largest reduction per operation are considered first.
    sort(characteristicsForEachVegetable.begin(), characteristicsForEachVegetable.end(), [](const VegetableCharacteristics &firstVegetable, const VegetableCharacteristics &secondVegetable){
        return firstVegetable.reductionValuePerOperation > secondVegetable.reductionValuePerOperation;
    });
    
    // Precompute prefix sums for the maximum operations allowed and for the potential reduction values.
    // The vector 'prefixSumOfTotalOperationsAllowed' stores at each index the sum of totalOperationsAllowedForVegetable
    // for all vegetables from the beginning up to that index.
    // The vector 'prefixSumOfReductionValues' stores at each index the cumulative reduction value, which is
    // the sum of (reductionValuePerOperation * totalOperationsAllowedForVegetable) for all vegetables up to that index.
    int numberOfSortedVegetables = characteristicsForEachVegetable.size();
    vector<longIntegerType> prefixSumOfTotalOperationsAllowed(numberOfSortedVegetables), prefixSumOfReductionValues(numberOfSortedVegetables);
    
    prefixSumOfTotalOperationsAllowed[0] = characteristicsForEachVegetable[0].totalOperationsAllowedForVegetable;
    prefixSumOfReductionValues[0] = characteristicsForEachVegetable[0].reductionValuePerOperation * 
                                      characteristicsForEachVegetable[0].totalOperationsAllowedForVegetable;
    for (int indexForVegetable = 1; indexForVegetable < numberOfSortedVegetables; indexForVegetable++){
        prefixSumOfTotalOperationsAllowed[indexForVegetable] = prefixSumOfTotalOperationsAllowed[indexForVegetable - 1] +
                                                               characteristicsForEachVegetable[indexForVegetable].totalOperationsAllowedForVegetable;
        prefixSumOfReductionValues[indexForVegetable] = prefixSumOfReductionValues[indexForVegetable - 1] +
                                                        characteristicsForEachVegetable[indexForVegetable].reductionValuePerOperation * 
                                                        characteristicsForEachVegetable[indexForVegetable].totalOperationsAllowedForVegetable;
    }
    
    // Process each query.
    // Each query provides a total number of operations available.
    // We aim to use the available operations on vegetables in the order of descending reductionValuePerOperation,
    // so that we achieve maximum total reduction.
    while (numberOfQueries--){
        longIntegerType totalAvailableOperationsForThisQuery;
        cin >> totalAvailableOperationsForThisQuery;
        
        // If the total available operations are greater than or equal to the sum of all allowed operations,
        // then every vegetable is completely processed and the final value becomes 0.
        if (totalAvailableOperationsForThisQuery >= prefixSumOfTotalOperationsAllowed[numberOfSortedVegetables - 1]){
            cout << 0 << "\n";
            continue;
        }
        
        // Perform a binary search to determine the last vegetable index for which the cumulative allowed operations
        // do not exceed the total available operations for this query.
        int lowerBoundIndex = 0, upperBoundIndex = numberOfSortedVegetables - 1;
        int indexOfLastFullyProcessedVegetable = -1;
        while (lowerBoundIndex <= upperBoundIndex){
            int middleIndex = lowerBoundIndex + (upperBoundIndex - lowerBoundIndex) / 2;
            if (prefixSumOfTotalOperationsAllowed[middleIndex] <= totalAvailableOperationsForThisQuery){
                indexOfLastFullyProcessedVegetable = middleIndex;
                lowerBoundIndex = middleIndex + 1;
            } else {
                upperBoundIndex = middleIndex - 1;
            }
        }
        
        // Calculate the total reduction that comes from completely processing all vegetables
        // up to indexOfLastFullyProcessedVegetable.
        longIntegerType totalReductionAchieved = (indexOfLastFullyProcessedVegetable >= 0 ? prefixSumOfReductionValues[indexOfLastFullyProcessedVegetable] : 0);
        longIntegerType operationsConsumedSoFar = (indexOfLastFullyProcessedVegetable >= 0 ? prefixSumOfTotalOperationsAllowed[indexOfLastFullyProcessedVegetable] : 0);
        
        // For the next vegetable (if it exists), use the remaining operations (which is less than its total allowed operations).
        int indexOfPartiallyProcessedVegetable = indexOfLastFullyProcessedVegetable + 1;
        if (indexOfPartiallyProcessedVegetable < numberOfSortedVegetables){
            longIntegerType remainingOperationsForThisVegetable = totalAvailableOperationsForThisQuery - operationsConsumedSoFar;
            totalReductionAchieved += characteristicsForEachVegetable[indexOfPartiallyProcessedVegetable].reductionValuePerOperation * 
                                        remainingOperationsForThisVegetable;
        }
        
        // The final result for this query is the initial total value minus the total reduction achieved by applying operations.
        longIntegerType finalRemainingValueAfterOperations = initialTotalValueOfAllVegetables - totalReductionAchieved;
        cout << finalRemainingValueAfterOperations << "\n";
    }
    
    return 0;
}
