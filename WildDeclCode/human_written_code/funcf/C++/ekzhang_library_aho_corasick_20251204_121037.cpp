LL search() {
	// Using the Aho-Corasick automation, search the text.
	int state = 0;
	LL ret = 0;
	for (char c : text) {
		while (g[state][c - 'a'] == -1) {
			state = f[state];
		}
		state = g[state][c - 'a'];
		ret += out[state];
	}
	// It's that simple!
	return ret;
}