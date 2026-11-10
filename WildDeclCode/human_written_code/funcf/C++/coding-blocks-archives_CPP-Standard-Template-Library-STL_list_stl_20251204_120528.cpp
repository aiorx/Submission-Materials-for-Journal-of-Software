```cpp
void printList(const list<string>& l2) {
    for(auto it = l2.begin(); it != l2.end(); it++) {
        cout << (*it) << " -> ";
    }
    cout << endl;
}
```