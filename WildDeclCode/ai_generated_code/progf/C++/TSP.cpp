#pragma once
#include "TSP.h"
#include <algorithm>

// Generate random permutation generated Derived using common development resources

std::vector<int> generateRandomPermutation(int n) {
	// Create a vector to store the permutation
	std::vector<int> permutation(n);

	// Initialize the vector with values from 0 to n-1
	for (int i = 0; i < n; i++) {
		permutation[i] = i;
	}

	// Create a random number generator
	std::random_device rd;
	std::mt19937 rng(rd());

	// Perform Fisher-Yates shuffle
	for (int i = n - 1; i > 0; i--) {
		// Generate a random index between 0 and i
		std::uniform_int_distribution<int> dist(0, i);
		int j = dist(rng);

		// Swap the elements at indices i and j
		std::swap(permutation[i], permutation[j]);
	}

	return permutation;
}

double TSP::calc_distance(vector<int>& chromosome)
{
	double total = 0;

	for (int i = 0; i < n - 1; ++i)
		total += map.get_distance(chromosome[i],chromosome[i + 1]);

	return total;
}

double TSP::mutate(vector<int>& chromosome)
{
	if (rand() % 100 < mutation_rate)
	{
		swap(chromosome[rand() % n], chromosome[rand() % n]);
	}
		
	return calc_distance(chromosome);
}

void TSP::initialize_generation()
{
	vector<int> chromosome;
	for (int i = 0; i < chromosomes.size(); i++)
	{
		chromosome = move(generateRandomPermutation(n));
		chromosomes[i] = make_pair(chromosome, calc_distance(chromosome));
	}
}

void TSP::reinitialize_generation()
{
	vector<int> chromosome;
	int cur_stuck = 0;
	for (int i = 1; i < chromosomes.size()/4; i++)
	{
		if (chromosomes[i].second == chromosomes[cur_stuck].second)
		{
			chromosome = move(generateRandomPermutation(n));
			chromosomes[i] = make_pair(chromosome, calc_distance(chromosome));
		}
		else
		{
			cur_stuck = i;
		}
		
	}
}

void TSP::evaluate_gen()
{
	sort(chromosomes.begin(), chromosomes.end(), [](auto& left, auto& right) {
		return left.second < right.second;
		});
}

void TSP::genocide_weaklings(double mean, double median)
{
	int genocide_factor, size = chromosomes.size();

	int mean_index = chromosomes.size()/2;
	for (int i = 0; i < chromosomes.size()/2; i++)
	{
		if (chromosomes[i].second >= mean)
		{
			mean_index = i;
			break;
		}
	}
	
	for (int i = mean_index; i < size / 2; i++)
	{
		chromosomes[i].first = generateRandomPermutation(n);
		chromosomes[i].second = calc_distance(chromosomes[i].first);
	}
}

void TSP::reproduce()
{
	int parent_size = chromosomes.size() / 2;
	int child1_index = parent_size, child2_index = parent_size + 1, rand1, rand2;
	for (int i = 0; i < parent_size; i+=2)
	{		
		rand1 = rand() % (int)sqrt(parent_size);
		rand2 = rand() % parent_size;
		if (i > 1 && rand() % 10 >= 8)
		{
			rand1 = chromosomes.size() - 1 - rand1;
			if (rand1 == child1_index + i || rand1 == child2_index + i)
				rand1 -= 5;
			
			cycle_crossover(chromosomes[rand1].first, chromosomes[rand2].first,
				chromosomes[child1_index + i].first, chromosomes[child2_index + i].first);
		}
		else
		cycle_crossover(chromosomes[rand1].first, chromosomes[rand2].first,
								 chromosomes[child1_index + i].first, chromosomes[child2_index + i].first);
	}

	for (int i = sqrt(parent_size); i < chromosomes.size(); i++)
	{
		chromosomes[i].second = mutate(chromosomes[i].first);
	}
}

void TSP::cycle_crossover(vector<int>& parent1, vector<int>& parent2, vector<int>& child1, vector<int>& child2)
{
	vector<bool> visited(n, false);
	int start, cur, counter = 0, index = 0;

	for (int i = 0; i < n; i++)
	{
		if (!visited[i])
		{
			start = parent1[i];
			visited[i] = true;

			if (counter % 2 == 0)
			{
				child2[i] = parent1[i];
				child1[i] = parent2[i];
			}
			else
			{
				child1[i] = parent1[i];
				child2[i] = parent2[i];
			}

			cur = parent2[i];

			while (start != cur)
			{
				for (int j = 0; j < parent1.size(); j++)
				{
					if (parent1[j] == cur)
					{
						index = j;
						cur = parent2[index];
						visited[index] = true;
						break;
					}
				}

				if (counter % 2 == 0)
				{
					child2[index] = parent1[index];
					child1[index] = parent2[index];
				}
				else
				{
					child1[index] = parent1[index];
					child2[index] = parent2[index];
				}
				cur = parent2[index];
			}
		}
		counter++;
	}
}

TSP::TSP(string city_file, string points_file, int mutation_rate) : map(city_file, points_file), mutation_rate(mutation_rate), from_file(true){
	this->n = map.get_size();
	chromosomes.resize(1000*sqrt(n));
}

void TSP::print_best() const
{
	cout << chromosomes.front().second << endl;
}

vector<int> TSP::get_best() const
{
	return chromosomes.front().first;
}

void TSP::print_path(vector<int>& chromosome) const
{
	for (int i = 0; i < n; i++)
		cout << chromosome[i] << endl;
}

void TSP::print_cities(vector<int>& chromosome) const
{
	for (int i = 0; i < n; i++)
		cout << map.get_city(chromosome[i]) << endl;
}

void TSP::solve()
{
	initialize_generation();
	int reinits = 0;
	double parent_gen_best, child_gen_best;
	vector<int> best_parent, best_child;

	for (int i = 0; i < n*n; i++)
	{
		evaluate_gen();

		if (i > 0)
			parent_gen_best = move(child_gen_best);
		best_child = move(get_best());
		child_gen_best = calc_distance(best_child);
		
		if (i > 0 && abs(parent_gen_best - child_gen_best) > 1)
		{
			print_best();
		}
			
		if (chromosomes[0].second == chromosomes[1].second )
		{
			if (++reinits > n)
			{
				break;
			}
			reinitialize_generation();
		}
		else
		{
			reproduce(); //inkl. mutation
		}
	
	}

	vector<int> best_chromosome = get_best();
	print_best();

	std::cout << "Best path:\n";

	if (from_file)
		print_cities(best_chromosome);
	else
		print_path(best_chromosome);
}

TSP::TSP(int n, int mutation_rate) : map(n), n(n), mutation_rate(mutation_rate), from_file(false)
{
	if(n > 10)
		chromosomes.resize(1000 * sqrt(n));
	else
		chromosomes.resize(50*n);
}
