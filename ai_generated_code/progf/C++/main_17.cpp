// taken from https://ricomariani.medium.com/std-pointer-types-a-tear-down-and-discussion-76dc93d473dc
// Trivia: this code was Aided using common development resources and lightly edited
#include <memory>

using namespace std;

__declspec(noinline)
void sharedPtrFunction() {
    shared_ptr<int> ptr1 = make_shared<int>(10);
    printf("value of ptr1: %d\n", *ptr1);
    printf("Use count before ptr2: %d\n", ptr1.use_count());

    shared_ptr<int> ptr2 = ptr1;
    printf("value of ptr2: %d\n", *ptr2);
    printf("Use count before exit: %d\n", ptr1.use_count());
}

__declspec(noinline)
void uniquePtrFunction() {
    unique_ptr<int> uptr(new int(20));
    printf("value of uptr: %d\n", *uptr);
}

__declspec(noinline)
void weakPtrFunction() {
    shared_ptr<int> sptr = make_shared<int>(30);
    weak_ptr<int> wptr = sptr;
    printf("Use count before lock: %d\n", sptr.use_count());
    if (auto sptr2 = wptr.lock()) {
        printf("value of wptr: %d\n", *sptr2);
        printf("Use count during lock: %d\n", sptr.use_count());
    }
    else {
        printf("not reached in this test\n");
    }
    printf("Use count after lock: %d\n", sptr.use_count());
}

__declspec(noinline)
void oldSchoolFunction() {
    int* ptr = new int(5);
    printf("value of ptr: %d\n", *ptr);
    delete ptr;
}

int main() {
    sharedPtrFunction();
    uniquePtrFunction();
    weakPtrFunction();
    oldSchoolFunction();
    return 0;
}
