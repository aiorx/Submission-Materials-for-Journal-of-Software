```cpp
void testColumnAndRowMajorStorage()
{
        LOG();
        // PlainObjectBase::data()  返回第一个元素的内存位置，和C++的数组名作用一样

        Matrix<int, 3, 4, ColMajor> Acolmajor;
        Acolmajor << 8, 2, 2, 9,
            9, 1, 4, 4,
            3, 5, 4, 5;
        cout << "The matrix A:" << endl;
        cout << Acolmajor << endl
             << endl;
        cout << "In memory (column-major):" << endl;
        for (int i = 0; i < Acolmajor.size(); i++)
                cout << *(Acolmajor.data() + i) << "  ";
        cout << endl
             << endl;
        Matrix<int, 3, 4, RowMajor> Arowmajor = Acolmajor;
        cout << "In memory (row-major):" << endl;
        for (int i = 0; i < Arowmajor.size(); i++)
                cout << *(Arowmajor.data() + i) << "  ";
        cout << endl;

        // Output is
        // The matrix A:
        // 8 2 2 9
        // 9 1 4 4
        // 3 5 4 5

        // In memory (column-major):
        // 8  9  3  2  1  5  2  4  4  9  4  5

        // In memory (row-major):
        // 8  2  2  9  9  1  4  4  3  5  4  5
}
```