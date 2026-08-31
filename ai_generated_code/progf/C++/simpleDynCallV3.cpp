//(mostly) Supported via standard programming aids
// compile with: g++ -rdynamic -o simpleDynCallV3 simpleDynCallV3.cpp -ldl

// #include <iostream>
#include <dlfcn.h>

// Use extern "C" to prevent name mangling.
extern "C" int my_function(int x) {
    // std::cout << "my_function(" << x << ") called with parameter " << x << "." << std::endl;
    return x;
}

typedef int (*FuncType)(int);

int main() {
    // Open the current process as a dynamic library.
    void* handle = dlopen(nullptr, RTLD_LAZY);
    if (!handle) {
        // std::cerr << "dlopen failed: " << dlerror() << std::endl;
        return 2;
    }
    
    // Clear any existing errors.
    dlerror();
    
    // Dynamically look up the symbol "my_function".
    FuncType fp = reinterpret_cast<FuncType>(dlsym(handle, "my_function"));
    const char* error = dlerror();
    if (error) {
        // std::cerr << "dlsym failed: " << error << std::endl;
        dlclose(handle);
        return 3;
    }
    
    // Call the function via the function pointer.
    int i = fp(0);
    
    // Close the dynamic library handle.
    dlclose(handle);
    return i;
}



