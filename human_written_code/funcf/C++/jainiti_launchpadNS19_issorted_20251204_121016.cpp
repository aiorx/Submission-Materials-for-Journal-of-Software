```cpp
bool issorted1(int *a,int n,int i)
{

	//base case
    if(i==n-1)
    {
    	return true;
    }

	//recursive case

    bool kyaAageSeSortedMila=issorted1(a,n,i+1);
	if(a[i]<=a[i+1] && kyaAageSeSortedMila)
	{
		return true;
	}

	return false;
}
```