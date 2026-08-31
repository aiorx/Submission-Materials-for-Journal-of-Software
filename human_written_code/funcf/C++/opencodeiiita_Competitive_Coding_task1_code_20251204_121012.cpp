```cpp
ll pow_mod(ll a, ll b, ll M)
{   
    ll ans = 1LL;
    while (b > 0) {
        if ( b%2 == 1) {
            ans=(ans * a)% M;
        }
        a = (a * a)%M;
        b = b / 2;
    }
    return ans;
}
```