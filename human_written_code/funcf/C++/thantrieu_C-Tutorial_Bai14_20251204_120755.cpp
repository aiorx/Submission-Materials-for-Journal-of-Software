```cpp
/* Cấu trúc rẽ nhánh switch

	switch(variable) {
		case value1:
			...
			break;
		case value2:
			...
			break;
		...
		default:
			...
	}
	
	Câu hỏi: đâu là thủ đô của Việt Nam?
	A. Hà Nội
	B. Thành phố Hồ Chí Minh
	C. Đà Nẵng
	D. Nghệ An
*/
#include <iostream>
using namespace std;

void checkAnswer(char choice) {
	switch (choice)
	{
	case 'A':
	case 'a':
		cout << "Chinh Xac!" << endl;
		break;
	case 'B':
	case 'b':
		cout << "Gan dung roi, hay chon lai!" << endl;
		break;
	case 'C':
	case 'c':
		cout << "Chua dung roi, hay chon lai dap an khac!" << endl;
		break;
	case 'D':
	case 'd':
		cout << "Ban nham roi, chon lai di nha!" << endl;
		break;

	default:
		cout << "Dap an ban chon khong hop le, vui long thu lai!" << endl;
		break;
	}
}
```