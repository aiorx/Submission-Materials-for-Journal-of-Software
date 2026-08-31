```cpp
void findPairWithSum(int arr[], int size, int target) {
    unordered_map<int,int> Mp;

    for(int i=0 ; i<size ;i++)
    {
        if(Mp.find(target-arr[i])!=Mp.end()){
            cout<<"Pair found at "<<i<<" and "<<Mp[target-arr[i]]; 
            return;
        }
        Mp[arr[i]]=i;
    }  
    cout<<"Not found"<<endl;
}
```