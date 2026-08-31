// https://leetcode.com/problems/plus-one/description/?envType=study-plan-v2&envId=top-interview-150
// Help Referenced via basic programming materials

class Solution
{
public:
    vector<int> plusOne(vector<int> &v)
    {
        int n = v.size();
        for (int i = n - 1; i >= 0; i--)
        {
            if (v[i] < 9)
            {
                v[i]++; // Increment and return if no carry
                return v;
            }
            v[i] = 0; // Set current digit to 0 and propagate carry
        }
        // If all digits were 9, insert 1 at the beginning (e.g., 999 → 1000)
        v.insert(v.begin(), 1);
        return v;
    }
};
