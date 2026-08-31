```python
def getAllSubsequences(arr1, arr2, len1, len2, data, indx1, indx2, currlcs, dp, highest_common):
    # When get all the LCS, check the length and compare them to get the highest LBS
    if currlcs == lcslen:
        # To update the highest common subsequence
        current_common_count = longest_bitonic_subsequence(data[:currlcs])
        # Chatgpt : Asked why for my highest_common variable is not updated(at the start I use integer data type), then it suggestted to use Array instead 
        # because python handles variable scope and mutability, especially when passing arguments to function. As Integer is an immutable type.
        if current_common_count > highest_common[0]:
            highest_common[0] = current_common_count
        return

    # combine the two arrays and get all the intersect elements => with help Adapted from standard coding samples asked: How can I change the loop from 'a' to 'z' based on the two arrays input I have
    intersect_elements = sorted(set(arr1[indx1:]) & set(arr2[indx2:]))
    # Time complexity for the nested loops : O(len_of_intersect_elements * len1 * len2)
    for num in intersect_elements:
        for i in range(indx1, len1):
            if num == arr1[i]:
                for j in range(indx2, len2):
                    if num == arr2[j] and dp[i][j] == lcslen - currlcs:
                        data[currlcs] = num
                        getAllSubsequences(arr1, arr2, len1, len2, data, i + 1, j + 1, currlcs + 1, dp, highest_common)
                        break
```