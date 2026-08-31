```cpp
void solve(){
	int n; see(n);
	while (n!=1){
		put(n);
		if (n%2==1) n= n*3+1;
		else n/=2;
	}
	put(1);
}
```