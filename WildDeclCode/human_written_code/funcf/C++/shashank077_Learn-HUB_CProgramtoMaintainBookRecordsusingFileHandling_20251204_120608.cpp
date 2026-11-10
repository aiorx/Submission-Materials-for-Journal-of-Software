```cpp
void Book::addbook()
{
     ofstream fout;
     fout.open("C:\\Users\\acer\\Documents\\books.txt",ios::out|ios::app|ios::binary);
     if(!fout)
              cout<<"File can not open";
     else
              fout.write((char*)this,sizeof(*this));
     fout.close();
}
```