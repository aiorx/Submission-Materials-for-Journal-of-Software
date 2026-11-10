```cpp
void findCherryFrequency(int n, int a[]) {
    int nhonhat, lonnhat;
    int b[10000];
    fill_n(b, 10000, 0);

    int min = 10000;
    int max = 0;

    for(int i = 0; i < n; i++){
        b[a[i]]++;   // count cherries

        if(max < b[a[i]]){
            lonnhat = a[i];
            max = b[a[i]];
        }

        if(min > b[a[i]]){
            nhonhat = a[i];
            min = b[a[i]];
        }
    }

    cout << nhonhat << " " << lonnhat;
}
```