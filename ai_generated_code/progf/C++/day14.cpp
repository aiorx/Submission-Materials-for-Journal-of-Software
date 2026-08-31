// https://adventofcode.com/2020/day/14

#include "../aoc_lmap_utils.h"

using namespace std;
#include <cmath>
#include <cassert>

#include <numeric> // for std::gcd, make sure C++ version >=17
#include <bitset>


//Implement current mask as a singleton class
// with help of github copilot
class Mask {
private:
    static Mask* instance;
    Mask() {}  // Private constructor
    uintll mask0;
    uintll mask1;
    // mask1, mask 0 combinations
    // 1,0 = 0 ; 1,1 = 1 ; 0,1=X ; 0,0=outside
    // result = m1&m0 or ~m1&v

public:
    Mask(const Mask&) = delete;  // Delete copy constructor
    Mask& operator=(const Mask&) = delete;  // Delete assignment operator

    static Mask* getInstance() {
        if (instance == nullptr) {
            instance = new Mask();
        }
        return instance;
    }

    //Functions
    void setMask(const string& mask_str) {
        //read mask with X zeros and 1's and use it later to mask output
        //set mask 0
        string mask0_str(36, '0');
        string mask1_str(36, '0');

        for (int i = 0; i < 36; i++) {
            auto c = mask_str[i];
            switch (c){
            case 'X':
                mask0_str[i] = '1';
                mask1_str[i] = '0';
                break;
            case '1':
                mask0_str[i] = '1';
                mask1_str[i] = '1';
                break;
            case '0':
                mask0_str[i] = '0';
                mask1_str[i] = '1';
                break;
            default:
                cerr << "Can't interpret character " << c << " at " << i << endl;
            } 
        }
        cout << "New mask" << endl;
        cout << "mask0: " << mask0_str<<endl;
        cout << "mask1: " << mask1_str<<endl;

        mask0 = std::stoll(mask0_str, nullptr, 2);
        mask1 = std::stoll(mask1_str, nullptr, 2);

    }

    uintll applyMaskTo(uintll value) {
        return (mask1 & mask0) | (~mask1 & value);
    }

};
// Initialize pointer to zero so that it can be initialized in first call to getInstance
Mask* Mask::instance= nullptr;



class Mask2 {
private:
    static Mask2* instance;
    Mask2() {}  // Private constructor

    vector<int> zeros_idxs; //indicates indices where 0's are
    vector<int> ones_idxs;
    vector<int> x_idxs;

public:
    Mask2(const Mask2&) = delete;  // Delete copy constructor
    Mask2& operator=(const Mask2&) = delete;  // Delete assignment operator

    static Mask2* getInstance() {
        if (instance == nullptr) {
            instance = new Mask2();
        }
        return instance;
    }

    //Functions
    void setMask2(const string& mask_str) {
        x_idxs.clear();
        ones_idxs.clear();
        zeros_idxs.clear();

        for (int i = 0; i<36 ; i++) {
            auto c = mask_str[35-i]; //reverse
            switch (c) {
            case 'X':
                x_idxs.push_back(i);
                break;
            case '1':
                ones_idxs.push_back(i);
                break;
            case '0':
                zeros_idxs.push_back(i);
                break;
            default:
                cerr << "Can't interpret character " << c << " at " << i << endl;
            }
        }
        cout << "New mask created" << endl;
    }

    vector<uintll> applyMaskTo(uintll value) {
        // Gets all the possible masked values
        
        //Get size of the binary number needed to do all the Xs
        cout << "applyMaskTo : " << value << endl;

        bitset<36> b_choices_base(value);

        for (auto iones_loc : ones_idxs) {
            b_choices_base.set(iones_loc); //set to 1
        }
        //Zeros are unchanged
        //for (auto zeros_loc : zeros_idxs) {
        //    b_choices_base.reset(zeros_loc); //set to zero
        //}

        uintll n_choices = pow(2ll, x_idxs.size());

        vector<uintll> allvalues;

        for (uintll i = 0; i < n_choices; i++) {
            
            auto b_choice_cpy = b_choices_base; //copy

            bitset<36> b_choice_rep(i);

            //Loop for adjusting the binary representation, from last index
            for (int j = 0; j<x_idxs.size(); j++) {
                auto b_digit = b_choice_rep[j];
                auto idx0 = x_idxs[j];
                b_choice_cpy.set(idx0, b_digit); 
            }
            auto value = b_choice_cpy.to_ullong();
            allvalues.push_back(value);
            //cout << "new value: " << b_choice_cpy.to_ullong() << endl;
        }
        return allvalues;
    }
};
// Initialize pointer to zero so that it can be initialized in first call to getInstance
Mask2* Mask2::instance = nullptr;

void part1(vector<string> slines) {
    
    Mask* the_mask = Mask::getInstance();

    // parse file line-by-line (input is already like that)
    // for each line read either mask or mem
    //parse and process

    //implement the memory as a hasmap
    unordered_map <int, uintll> memory;

    for (auto s : slines) {
        if (s.size() < 0) {
            continue; //skip line
        }
        auto s0 = s.substr(0, 3);


        if (s0 == "mas") {
            //mask
            string pat0 = "[X10]{36}";

            auto reg0 = regex_get_matches_and_their_groups(s, pat0);

            if (reg0.size() != 1) {
                cerr << "Error getting binary mask with line:" << s0 <<endl;
                continue;
            }

            auto match0 = reg0[0].match; //assume is a nice string

            // set the current mask
            the_mask->setMask(match0);
            //cout << "New mask set" << endl;

        }

        else if (s0 == "mem") {
            string pat0 = "mem\\[([0-9]+)\\]\\s*=\\s*([0-9]+)";
            auto reg0 = regex_get_matches_and_their_groups(s, pat0);

            //expected single match with 2 groups
            if (reg0.size() != 1) {
                if (reg0[0].groups.size() != 2) {
                    cerr << "Error getting binary mask with line:" << s0 << endl;
                    continue;
                }
            }
            auto mem_pos = stoi(reg0[0].groups[0]);
            uintll new_value = stoll(reg0[0].groups[1]);

            cout << "mem position: " << mem_pos << " , new_value: " << new_value;

            //mask value
            auto masked_value = the_mask->applyMaskTo(new_value);
            cout << ", masked : " << masked_value << endl;

            memory[mem_pos] = masked_value;

        }

    }

    //Get the sum
    uintll sum = 0;

    for (const auto& m : memory) {
        sum += m.second;
    }
    
    cout << "sum is : " << sum << endl;

}

void part2(vector<string> slines) {
    //Different way to process
    //bitmask acts on the memory address, not on the value

    //X is floating, can take any value

    Mask2* the_mask2 = Mask2::getInstance();

    //implement the memory as a hasmap
    unordered_map <uintll, uintll> memory;

    for (auto s : slines) {
        if (s.size() < 0) {
            continue; //skip line
        }
        auto s0 = s.substr(0, 3);


        if (s0 == "mas") {
            //mask
            string pat0 = "[X10]{36}";

            auto reg0 = regex_get_matches_and_their_groups(s, pat0);

            if (reg0.size() != 1) {
                cerr << "Error getting binary mask with line:" << s0 << endl;
                continue;
            }

            auto match0 = reg0[0].match; //assume is a nice string

            // set the current mask
            the_mask2->setMask2(match0);
            //cout << "New mask set" << endl;

        }

        else if (s0 == "mem") {
            string pat0 = "mem\\[([0-9]+)\\]\\s*=\\s*([0-9]+)";
            auto reg0 = regex_get_matches_and_their_groups(s, pat0);

            //expected single match with 2 groups
            if (reg0.size() != 1) {
                if (reg0[0].groups.size() != 2) {
                    cerr << "Error getting binary mask with line:" << s0 << endl;
                    continue;
                }
            }
            auto mem_pos = stoll(reg0[0].groups[0]);
            uintll new_value = stoll(reg0[0].groups[1]);

            cout << "mem position (before mask): " << mem_pos << " , value: " << new_value <<endl;

            //mask mem position, to get several postitions
            auto masked_values = the_mask2->applyMaskTo(mem_pos);
            
            //Apply new value to all new memory positions
            cout << "Applying new value to all new masked positions" << endl;
            //cout << "value " << new_value << " set at positions ";
            for (const auto& mv0 : masked_values) {
                memory[mv0] = new_value;
                //cout << mv0 << ", ";
            }
            cout << endl;

        }

    }

    //Get the sum
    uintll sum = 0;

    for (const auto& m : memory) {
        sum += m.second;
    }

    cout << "sum is : " << sum << endl;
}



int main() {
    //Read data from file to list of strings

    //auto slines = get_lines_from_file("input_test.txt");
    //auto slines = get_lines_from_file("input.txt");
    //part1(slines);


    //auto slines = get_lines_from_file("input_test_part2.txt");
    //auto slines = get_lines_from_file("input_test_part2b.txt");
    auto slines = get_lines_from_file("input.txt"); // 2847251749640 answer too low
    // 3885232834169
    part2(slines);

    // too low

    return 0;
}

