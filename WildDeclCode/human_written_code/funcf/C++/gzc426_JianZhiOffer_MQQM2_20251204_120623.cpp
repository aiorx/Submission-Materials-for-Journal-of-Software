```cpp
void adjustHeap(vector<int>&input,int i,int length){//堆调整         
    int child=i*2+1;
    if(child<length){      
       if(child+1<length&&input[child+1]>input[child]){
            child=child+1;
       }
       if(input[child]>input[i]){
            int temp=input[i];
            input[i]=input[child];
            input[child]=temp;
            adjustHeap(input,child,length);
       }
    }
}
```