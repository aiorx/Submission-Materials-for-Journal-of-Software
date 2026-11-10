// TODO: the while version
  // Assisted with basic coding tools
  int i = 0;
  int j = len - 1;
  while (i < j) {
    if (string[i] != string[j]) {
      is_palindrome = false;
      break;
    }
    i++;
    j--;
  }