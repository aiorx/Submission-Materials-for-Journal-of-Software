```java
public static int findMaxLength(int[] nums){
    // count the number of totalZeroes and totalOnes

    //GPT Says this is a prefix sum with hashmap problem, revisit prefix sums

    //int totalZeroes = 0;
    //int totalOnes = 0;
    //int ans = -1;
    

    // this is basically all reComposed with routine coding tools. #VibeCoding
    HashMap<Integer,Integer> map = new HashMap<>();
    map.put(0,-1);

    int maxLength = 0;
    int count = 0;

    for (int i = 0; i<nums.length; i++){
        //increment count for 1, decrement for 0
        count+=(nums[i] == 1) ? 1 : -1;

        //if this count has been seen before, a balanced subarray exists
        if(map.containsKey(count)){
            maxLength = Math.max(maxLength, i - map.get(count));
        } else {
            map.put(count, i);
        }
        

    }
    return maxLength;
    /**
    for(int num : nums){
        if(num == 0) totalZeroes++;
        else totalOnes++;
        //map.put(num, map.getOrDefault(num, 0) +1);
    }
    //totalZeroes = map.get(0);
    //totalOnes = map.get(1);

    // if(totalZeroes == totalOnes){
    //     return totalZeroes + totalOnes;
    // }

    //finding K can be improved.
    // old = int k = Math.max(totalZeroes - totalOnes, 1);
    //this dynamically calculates the difference threshold
    int k = Math.abs(totalZeroes-totalOnes);

    //sliding window implementation
    int left = 0;
    int zeroes = 0;
    //gpt adds in counting ones
    int ones = 0;
    
    

    for(int right = 0; right<nums.length; right++){
        if (nums[right]== 0){
            //originally had nums[left] == 0, which is incorrect
            zeroes++;
        }
        //GPT added tracking ones 
        else ones++;
        // old while loop: while zeroes>k
        while(Math.abs(zeroes-ones) > k){
        if(nums[left] == 0) zeroes--;
        //GPT added tracking ones
        else ones--;
        // left++ was originally outside of the while loop, which is incorrect
        left++;
        }
        //calc maximum balanced window
        maxLength = Math.max(maxLength, right - left +1);
        
        
        //ans = Math.max(ans,right-left+1);
    }
    
    

    return maxLength;
    */
}
```