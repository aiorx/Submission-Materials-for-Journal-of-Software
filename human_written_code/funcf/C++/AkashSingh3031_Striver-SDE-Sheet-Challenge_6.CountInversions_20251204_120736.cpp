```cpp
long long merge(long long *arr, long long *temp, long long left, long long mid, long long right){
    int inv_count = 0;
    int i = left, j = mid, k = left;
    while((i <= mid-1) and (j <= right)){
        if(arr[i] <= arr[j])
            temp[k++] = arr[i++];
        else{
            temp[k++] = arr[j++];
            inv_count += (mid-i);
        }
    }
    while(i <= mid-1)
        temp[k++] = arr[i++];
    while(j <= right)
        temp[k++] = arr[j++];
    for(long long i=left; i<=right; i++)
        arr[i] = temp[i];
    return inv_count;
}
```