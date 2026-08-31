```cpp
void printMaxActivities(int s[], int f[], int n)
{
	int i, j;

	cout <<"Following activities are selected "<< endl;

	// The first activity always gets selected
	i = 0;
	cout <<" "<< i;

	// Consider rest of the activities
	for (j = 1; j < n; j++)
	{
	// If this activity has start time greater than or
	// equal to the finish time of previously selected
	// activity, then select it
	if (s[j] >= f[i])
	{
		cout <<" " << j;
		i = j;
	}
	}
}
```