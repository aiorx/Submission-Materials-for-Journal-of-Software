//(mostly) Aided using common development resources
#include <cstdint>

constexpr unsigned long long KEY = 0x5A5A5A5A5A5A5A5A;

int my_function(int number){
    if (number > 0){
        return 1; 
    } else {
        return 0;
    }
}


int main() {
    // Obfuscate the function pointer using XOR
    unsigned long long obfuscatedPtr = (unsigned long long)&my_function ^ KEY;

    // Deobfuscate it just before calling
    int (*funcPtr)(int) = (int (*)(int))(obfuscatedPtr ^ KEY);

    return funcPtr(4);
}