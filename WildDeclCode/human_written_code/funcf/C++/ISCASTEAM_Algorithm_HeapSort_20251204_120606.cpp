```cpp
private:
    //父节点k 不断下沉  直到k大于两个子节点
    static void sink(vector<int>& nums,int k,int n){
        while(2*k<=n){
            //k的子节点2k 2k+1中val较大值为j
            int j=2*k;
            if(j<n && less(nums,j,j+1)) j++;

            if(!less(nums,k,j))
                break;
            swap(nums,k,j);
            k=j;
        }
    }
```