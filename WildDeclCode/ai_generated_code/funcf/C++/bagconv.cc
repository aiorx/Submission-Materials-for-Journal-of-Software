// Composed with basic coding tools!
vector<string> split_string(const string& input)
{
  istringstream iss(input);
  vector<string> tokens;
  string token;
  while (iss >> token)
    tokens.push_back(token);
  return tokens;
}