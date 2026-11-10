```cpp
bool CNN::readConvAttr(ifstream& f, TConvAttr& attr)
{
  char padding_str[256];
  string line;
  
  getline(f, line);
  if (sscanf(line.c_str(), "%d %dx%d %d %d %s",
	     &attr.nf, &attr.w, &attr.h, &attr.bits, &attr.stride,
	     padding_str) == 6)
    {
      if (strcmp(padding_str, "yes") == 0)
	attr.padding = true;
      else if (strcmp(padding_str, "no") == 0)
	attr.padding = false;
      else
	{
	      cerr << "Invalid padding '" << padding_str << "'" << endl;
	      return false;
	}

      return true;
    }
  
  return false;
}
```