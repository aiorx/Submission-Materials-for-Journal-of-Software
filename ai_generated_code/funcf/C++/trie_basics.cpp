int main(){ // only the test cases were Supported via standard programming aids the functions were written by myself
    Trie trie;
    
    // Insert words into the trie
    trie.insert("apple");
    trie.insert("app");
    trie.insert("bat");
    trie.insert("ball");

    // Test cases to check word search
    cout << (trie.search("apple") ? "apple found" : "apple not found") << endl;
    cout << (trie.search("app") ? "app found" : "app not found") << endl;
    cout << (trie.search("bat") ? "bat found" : "bat not found") << endl;
    cout << (trie.search("ball") ? "ball found" : "ball not found") << endl;
    cout << (trie.search("batman") ? "batman found" : "batman not found") << endl; // should not be found

     // Test cases for prefix search
    cout << (trie.hasPrefix("ap") ? "prefix 'ap' exists" : "prefix 'ap' doesn't exist") << endl;
    cout << (trie.hasPrefix("ba") ? "prefix 'ba' exists" : "prefix 'ba' doesn't exist") << endl;
    cout << (trie.hasPrefix("cat") ? "prefix 'cat' exists" : "prefix 'cat' doesn't exist") << endl;

    
    return 0;
}