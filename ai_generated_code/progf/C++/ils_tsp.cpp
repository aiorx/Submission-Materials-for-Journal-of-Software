#include <ctime> 
#include <iomanip>
#include <algorithm>
#include "ils_tsp.h"

std::vector<int> ILS_TSP::m_get4SortedRandom() {  // Designed via basic programming aids
    std::vector<int> pool;
    for (int i=1; i<getSize(); i++)
        pool.push_back(i);

    std::shuffle(pool.begin(), pool.end(), rng);

    std::vector<int> result(pool.begin(), pool.begin() + 4);
    std::sort(result.begin(), result.end());

    return result;
}

bool ILS_TSP::m_stochasticChange(double oldValue, double newValue, double temp) {
    double delta = (newValue - oldValue) / oldValue;
    double p = exp(-delta / temp);

    return ((double)rng() / rng.max()) < p;
}

void ILS_TSP::m_perturb() { // double-bridge move
    std::vector<int> sortedRandoms = m_get4SortedRandom();

    m_removeEdge(sortedRandoms[0]-1, sortedRandoms[0]);
    m_removeEdge(sortedRandoms[1]-1, sortedRandoms[1]);
    m_removeEdge(sortedRandoms[2]-1, sortedRandoms[2]);
    m_removeEdge(sortedRandoms[3]-1, sortedRandoms[3]);

    m_addEdge(sortedRandoms[2]-1, sortedRandoms[0]);
    m_addEdge(sortedRandoms[1]-1, sortedRandoms[3]);
    m_addEdge(sortedRandoms[0]-1, sortedRandoms[2]);
    m_addEdge(sortedRandoms[3]-1, sortedRandoms[1]);

    std::vector<int> aux;
    for (int i=0; i<sortedRandoms[0]; i++)
        aux.emplace_back(m_solutionOrder[i]);
    for (int i=sortedRandoms[2]; i<sortedRandoms[3]; i++)
        aux.emplace_back(m_solutionOrder[i]);
    for (int i=sortedRandoms[1]; i<sortedRandoms[2]; i++)
        aux.emplace_back(m_solutionOrder[i]);
    for (int i=sortedRandoms[0]; i<sortedRandoms[1]; i++)
        aux.emplace_back(m_solutionOrder[i]);
    for (int i=sortedRandoms[3]; i<getSize(); i++)
        aux.emplace_back(m_solutionOrder[i]);
    
    int i = 0;
    for (int elem: aux)
        m_solutionOrder[i++] = elem;
}

void ILS_TSP::m_accept(Solution &lastSolution, int newValue, int t, double temp) {
    int oldValue = lastSolution.value;
    std::vector<int> oldOrder = lastSolution.order;
    
    // Update last and best found
    lastSolution = Solution(newValue, t, m_solutionOrder);
    if (newValue < m_bestSolution.value)
        m_bestSolution = lastSolution;
    
    // Decide between keeping the newValue or going back to the old one
    if (newValue > oldValue && !m_stochasticChange(oldValue, newValue, temp)) { // its the negation of the expression because its already swapped
        m_solutionValue = oldValue;
        m_solutionOrder = oldOrder;
    }
}

ILS_TSP::ILS_TSP(std::string path, int n, int t, double p, double l)
: rng(std::random_device{}()), TSP(path, n, t, p, l) 
{}

ll ILS_TSP::solve() {
    int t = 0;
    double temp = 1;
    m_greedyDistInitialization();
    m_hillClimbing();
    m_bestSolution = Solution(m_solutionValue, t, m_solutionOrder);
    Solution lastSolution(m_bestSolution);

    while (++t) {
        m_perturb();
        int newValue = m_localSearch();
        m_accept(lastSolution, newValue, t, temp);

        if (t-m_bestSolution.iteration == 25) {
            std::cout << "Ended at iteration: " << t << '\n';
            break;
        }
        
        temp *= 0.95;
    }

    return m_bestSolution.value;
}