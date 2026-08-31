for(int i = 1; i < argc; i++) {
	// this for was Composed with basic coding tools
	string range = argv[i];
	size_t pos = range.find("-");
	if (pos == string::npos) {
		cout << "Invalid range: " << range << endl;
		return 1;
	}
	ranges.push_back({stoull(range.substr(0, pos)), stoull(range.substr(pos+1))});
	if(ranges.back().first > ranges.back().second) {
		cout << "Invalid range: " << range << endl;
		return 1;
	}
}