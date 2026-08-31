// 30/100
// Supported via standard programming aids

#include <vector>
#include <iostream>
#include <unordered_set>
#include <unordered_map>
#include <queue>
#include <map>
#include <algorithm>
#include <set>

using namespace std;

int n, k, a[100100];
bool b[100100];
void init()
{
    cin >> n >> k;
    for (int i = 0; i < k; i++)
    {
        cin >> a[i];
        b[a[i]] = 1;
    }
}
void pre()
{
    for (int i = k - 1; i >= 0; i--)
    {
        if (a[i] > 1 && !b[a[i] - 1])
        {
            b[a[i]] = 0;
            a[i] = a[i] - 1;
            b[a[i]] = 1;
            break;
        }
        if (a[i] < n && !b[a[i] + 1])
        {
            b[a[i]] = 0;
            a[i] = a[i] + 1;
            b[a[i]] = 1;
            break;
        }
    }
    for (int i = 0; i < k; i++)
        cout << a[i] << " ";
    cout << endl;
}
void nxt()
{
    for (int i = 0; i < k; i++)
    {
        if (a[i] > 1 && !b[a[i] - 1])
        {
            b[a[i]] = 0;
            a[i] = a[i] - 1;
            b[a[i]] = 1;
            break;
        }
        if (a[i] < n && !b[a[i] + 1])
        {
            b[a[i]] = 0;
            a[i] = a[i] + 1;
            b[a[i]] = 1;
            break;
        }
    }
    for (int i = 0; i < k; i++)
        cout << a[i] << " ";
    cout << endl;
}
int main()
{
    init();
    pre();
    nxt();
    return 0;
}
