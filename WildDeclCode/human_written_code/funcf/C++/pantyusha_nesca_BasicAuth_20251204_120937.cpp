std::string getLocation(const std::string *buff) {
	std::string buffLower = *buff;
	std::transform(buffLower.begin(), buffLower.end(), buffLower.begin(), ::tolower);
	int pos1 = buffLower.find("location: ");

	if (-1 != pos1) {
		std::string location = buff->substr(pos1 + 10, buff->find("\r\n", pos1) - pos1 - 10);
		return location;
	}

	return "";
}