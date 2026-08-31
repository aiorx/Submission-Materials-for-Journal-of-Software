// a4_sort_implementations.h

/////////////////////////////////////////////////////////////////////////
//
// Student Info
// ------------
//
// Name : Kuan Ting (Tim) Chou
// St.# : 301562019
// Email: tim_chou@sfu.ca
//
//
// Statement of Originality
// ------------------------
//
// All the code and comments below are my own original work. For any non-
// original work, I have provided citations in the comments with enough
// detail so that someone can see the exact source and extent of the
// borrowed work.
//
// In addition, I have not shared this work with anyone else, and I have
// not seen solutions from other students, tutors, websites, books,
// etc.
//
/////////////////////////////////////////////////////////////////////////

#pragma once

#include "a4_base.h"
//
// Do NOT add any other #includes to this file!
//

using namespace std;

//
// Put the implementations of all the functions listed in a4_base.h here, as
// well as is_sorted and rand_vec. You can use other helper functions if needed.
//

// directly copied from assignment page
// https://tjd1234.github.io/cmpt225fall2023/assignments/a4/
template <typename T>
Sort_stats bubble_sort(vector<T> &v)
{
    ulong num_comps = 0;
    clock_t start = clock();

    for (int i = 0; i < v.size(); i++)
    {
        for (int j = 0; j < v.size() - 1; j++)
        {
            num_comps++;
            if (v[j] > v[j + 1])
            {
                T temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
            }
        }
    }

    clock_t end = clock();
    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"Bubble sort",
                      v.size(),
                      num_comps,
                      elapsed_cpu_time_sec};
}

template <typename T>
bool is_sorted(vector<T> &v)
{
    // starts at index 1 so only enters the for loop when size is 2 or more
    // since a vector with only 1 or 0 element is already sorted

    for (int i = 1; i < v.size(); i++)
    {
        if (v[i - 1] > v[i])
        {
            return false;
        }
    }

    return true;
}

vector<int> rand_vec(int n, int min, int max)
{
    vector<int> v;
    int range = max - min + 1;

    // rand() creates a random int
    // rand() % range allows the random number generator to create numbers up to the range
    // the program adds the min back since the smallest value has to be the min not 0
    for (int i = 0; i < n; i++)
    {
        v.push_back((rand() % range) + min);
    }
    return v;
}

// code built upon from https://slaystudy.com/c-program-to-implement-insertion-sort-using-templates/
template <typename T>
Sort_stats insertion_sort(vector<T> &v)
{
    ulong num_comps = 0;
    clock_t start = clock();

    T temp;
    for (int i = 1; i < v.size(); i++)
    {
        temp = v[i];
        int j = i - 1;

        while (j >= 0)
        {
            num_comps++;
            if (v[j] > temp)
            {
                v[j + 1] = v[j];
                j = j - 1;
            }
            else
            {
                break;
            }
        }
        v[j + 1] = temp;
    }

    clock_t end = clock();
    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"Insertion sort", v.size(), num_comps, elapsed_cpu_time_sec};
}

// selection sort algorithm provided by ChatGPT
template <typename T>
Sort_stats selection_sort(vector<T> &v)
{
    ulong num_comps = 0;
    clock_t start = clock();

    for (int i = 0; i < v.size(); i++)
    {
        int min = i;
        for (int j = i + 1; j < v.size(); j++)
        {
            num_comps++;
            if (v[j] < v[min])
            {
                min = j;
            }
        }

        if (min != i)
        {
            T temp = v[i];
            v[i] = v[min];
            v[min] = temp;
        }
    }

    clock_t end = clock();
    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"Selection sort", v.size(), num_comps, elapsed_cpu_time_sec};
}

// merge function built upon from Dr. Donaldson's github
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week9/sorting.cpp
template <typename T>
vector<T> merge(const vector<T> &v1, const vector<T> &v2, ulong &num_comps)
{
    vector<T> v;
    int i = 0;
    int j = 0;
    while (i < v1.size() && j < v2.size())
    {
        num_comps++; // keeps track of the number of comparisons
        if (v1[i] < v2[j])
        {
            v.push_back(v1[i]);
            i++;
        }
        else
        {
            v.push_back(v2[j]);
            j++;
        }
    }
    while (i < v1.size())
    {
        v.push_back(v1[i]);
        i++;
    }
    while (j < v2.size())
    {
        v.push_back(v2[j]);
        j++;
    }
    return v;
}

// helper function is required to keep track of num_Comp during recursion
// also taken from Dr. Donaldson's Github
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week9/sorting.cpp
template <typename T>
void merge_sort_helper(vector<T> &v, ulong &num_comps)
{
    if (v.size() <= 1)
    {
        return;
    }
    int mid = v.size() / 2;
    vector<T> v1(v.begin(), v.begin() + mid);
    vector<T> v2(v.begin() + mid, v.end());
    merge_sort_helper(v1, num_comps);
    merge_sort_helper(v2, num_comps);
    v = merge(v1, v2, num_comps);
}

// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week9/sorting.cpp
template <typename T>
Sort_stats merge_sort(vector<T> &v)
{
    ulong num_comps = 0;
    clock_t start = clock();

    merge_sort_helper(v, num_comps);

    clock_t end = clock();
    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"Merge sort", v.size(), num_comps, elapsed_cpu_time_sec};
}

// code modified from Dr. Donaldson's Github
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week9/sorting.cpp

template <typename T>
int partition(vector<T> &v, int start, int end, ulong &num_comps)
{
    T pivot = v[end];
    int i = start;
    for (int j = start; j < end; j++)
    {
        num_comps++;
        if (v[j] < pivot)
        {
            swap(v[i], v[j]);
            i++;
        }
    }
    swap(v[i], v[end]);
    return i;
}

// code modified from Dr. Donaldson's Github
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week9/sorting.cpp
template <typename T>
void quick_sort(vector<T> &v, int start, int end, ulong &num_comps)
{
    if (start >= end)
    {
        return;
    }
    int pivot = partition(v, start, end, num_comps);
    quick_sort(v, start, pivot - 1, num_comps);
    quick_sort(v, pivot + 1, end, num_comps);
}

template <typename T>
Sort_stats quick_sort(vector<T> &v)
{
    ulong num_Comps = 0;
    clock_t start = clock();

    quick_sort(v, 0, v.size() - 1, num_Comps);

    clock_t end = clock();
    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"Quick sort", v.size(), num_Comps, elapsed_cpu_time_sec};
}

// Built upon code Supported via standard programming aids
template <typename T>
Sort_stats shell_sort(vector<T> &v)
{
    ulong num_comps = 0;
    clock_t start = clock();

    int n = v.size();

    for (int gap = n / 2; gap > 0; gap /= 2)
    {
        for (int i = gap; i < n; i++)
        {
            T temp = v[i];
            int j = i;

            num_comps++;
            while (j >= gap && v[j - gap] > temp)
            {
                v[j] = v[j - gap];
                j -= gap;
            }

            v[j] = temp;
        }
    }

    clock_t end = clock();
    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"Shell sort", v.size(), num_comps, elapsed_cpu_time_sec};
}

// heap class modified from Dr. Donaldson's Github
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week7/priority_queues.cpp#L285

template <typename T>
class Priority_queue_heap
{
    vector<T> v;
    ulong num_comps = 0;

public:
    int size() const
    {
        return v.size();
    }

    bool empty() const
    {
        return size() == 0;
    }

    void insert(const T &x)
    {
        v.push_back(x);
        int i = size() - 1;
        while (i > 0)
        {
            num_comps++;
            if (v[i] < v[(i - 1) / 2])
            {
                swap(v[i], v[(i - 1) / 2]);
                i = (i - 1) / 2;
            }
            else
            {
                break;
            }
        }
    }

    const T &min() const
    {
        assert(!empty());
        return v[0];
    }

    void remove_min()
    {
        assert(!empty());
        v[0] = v.back();
        v.pop_back();

        int i = 0;
        while (2 * i + 1 < size())
        {
            int j = 2 * i + 1;
            num_comps++;
            if (j + 1 < size() && v[j + 1] < v[j])
            {
                j++;
            }

            if (v[i] <= v[j])
            {
                break;
            }
            swap(v[i], v[j]);
            i = j;
        }
    }

    ulong get_num_comps() const
    {
        return num_comps;
    }

}; // class Priority_queue_heap

// priority queue heap sort modified from Dr. Donaldson's Github
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week7/priority_queues.cpp#L285
template <typename T>
ulong pq_sort(vector<T> &v)
{
    Priority_queue_heap<T> pq;
    for (int i = 0; i < v.size(); i++)
    {
        pq.insert(v[i]);
    }

    for (int i = 0; i < v.size(); i++)
    {
        v[i] = pq.min();
        pq.remove_min();
    }
    return pq.get_num_comps();
}

template <typename T>
Sort_stats priority_queue_sort(vector<T> &v)
{
    clock_t start = clock();
    ulong num_comps = pq_sort(v);
    clock_t end = clock();

    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;
    return Sort_stats{"Priority Queue sort", v.size(), num_comps, elapsed_cpu_time_sec};
}

// code built upon from https://slaystudy.com/c-program-to-implement-insertion-sort-using-templates/
template <typename T>
void insertion_sort_helper(vector<T> &v, int start, int end, ulong &num_comps)
{
    T temp;
    for (int i = start + 1; i <= end; i++)
    {
        temp = v[i];
        int j = i - 1;

        num_comps++;
        while (j >= start && v[j] > temp)
        {
            v[j + 1] = v[j];
            j = j - 1;
        }
        v[j + 1] = temp;
    }
}

// modified from Dr. Donaldson's quicksort function
// https://github.com/tjd1234/cmpt225fall2023/blob/main/lecture_notes/week9/sorting.cpp
template <typename T>
void iquick_sort_helper(vector<T> &v, int start, int end, ulong &num_comps)
{
    if (start < end)
    {
        int size = end - start + 1;

        if (size <= 15)
        {
            insertion_sort_helper(v, start, end, num_comps);
        }
        else
        {
            int pivot = partition(v, start, end, num_comps);
            iquick_sort_helper(v, start, pivot - 1, num_comps);
            iquick_sort_helper(v, pivot + 1, end, num_comps);
        }
    }
}

template <typename T>
Sort_stats iquick_sort(vector<T> &v)
{
    ulong num_comps = 0;
    clock_t start = clock();

    iquick_sort_helper(v, 0, v.size() - 1, num_comps);

    clock_t end = clock();

    double elapsed_cpu_time_sec = double(end - start) / CLOCKS_PER_SEC;

    return Sort_stats{"iquick Sort", v.size(), num_comps, elapsed_cpu_time_sec};
}