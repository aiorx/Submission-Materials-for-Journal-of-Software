// // /*
// //  * Endianness Detection Macros
// //  * These preprocessor directives are designed to be robust and effective at
// //  * determining the endianness of various architectures, including ARM, x86, PPC, etc.
// //  * For ARM, we also include runtime checks to handle its bi-endian nature.
// //  *
// //  * Lots of help Derived using common development resources
// //  */

// // #if defined(__BYTE_ORDER__) && (__BYTE_ORDER__ == __ORDER_LITTLE_ENDIAN__)
// //   #define IS_LITTLE_ENDIAN 1
// //   #define IS_BIG_ENDIAN 0
// // #elif defined(__BYTE_ORDER__) && (__BYTE_ORDER__ == __ORDER_BIG_ENDIAN__)
// //   #define IS_LITTLE_ENDIAN 0
// //   #define IS_BIG_ENDIAN 1
// // #else
// //   #if defined(_WIN32) || defined(_WIN64)
// //     // Windows (x86/x64) is always little-endian
// //     #define IS_LITTLE_ENDIAN 1
// //     #define IS_BIG_ENDIAN 0
// //   #elif defined(__linux__) || defined(__unix__)

// //     #include <endian.h>
// //     #if defined(__BYTE_ORDER) && (__BYTE_ORDER == __LITTLE_ENDIAN)
// //         #define IS_LITTLE_ENDIAN 1
// //         #define IS_BIG_ENDIAN 0
// //     #elif defined(__BYTE_ORDER) && (__BYTE_ORDER == __BIG_ENDIAN)
// //         #define IS_LITTLE_ENDIAN 0
// //         #define IS_BIG_ENDIAN 1
// //     #else
// //         #error "Unable to determine endianness for Linux/Unix system."
// //     #endif

// //   #elif defined(__APPLE__)

// //     #include <machine/endian.h>
// //     #if defined(__DARWIN_BYTE_ORDER) && (__DARWIN_BYTE_ORDER == __DARWIN_LITTLE_ENDIAN)
// //         #define IS_LITTLE_ENDIAN 1
// //         #define IS_BIG_ENDIAN 0
// //     #elif defined(__DARWIN_BYTE_ORDER) && (__DARWIN_BYTE_ORDER == __DARWIN_BIG_ENDIAN)
// //         #define IS_LITTLE_ENDIAN 0
// //         #define IS_BIG_ENDIAN 1
// //     #else
// //         #error "Unable to determine endianness for Apple system."
// //     #endif

// //   #elif defined(__arm__) || defined(__aarch64__)

// //     // ARM and AArch64 can be either little or big-endian, runtime check required
// //     #include <stdint.h>
// //     inline int is_little_endian() {
// //       union {
// //           uint32_t i;
// //           uint8_t c[4];
// //       } x = {0x01020304};

// //       return x.c[0] == 4;
// //     }

// //     #if defined(__ARMEL__) || (is_little_endian())

// //     #define IS_LITTLE_ENDIAN 1
// //     #define IS_BIG_ENDIAN 0

// //     #elif defined(__ARMEB__) || (!is_little_endian())

// //       #define IS_LITTLE_ENDIAN 0
// //       #define IS_BIG_ENDIAN 1

// //     #else
// //       #error "Unable to determine endianness for ARM architecture."
// //     #endif

// //   #else
// //       #error "Unknown architecture. Unable to determine endianness."
// //   #endif
// // #endif

// // uint8_t toBigEndian8(uint8_t val)
// // {
// //   return val;
// // }

// // inline constexpr bool isBigEndian()
// // {
// //   #if IS_LITTLE_ENDIAN == 1
// //     return false;
// //   #elif IS_BIG_ENDIAN == 1
// //     return true;
// //   #else
// //     return !is_little_endian();
// //   #endif
// // }

// // uint16_t toBigEndian16(uint16_t val)
// // {
// //   if (isBigEndian())
// //     return val;
// //   else

// // }

// // // Example usage for conditional compilation
// // #if IS_LITTLE_ENDIAN
// //     #include <stdio.h>
// //     void print_endianness() {
// //         printf("System is little-endian.\n");
// //     }

// // #elif IS_BIG_ENDIAN
// //     #include <stdio.h>
// //     void print_endianness() {
// //         printf("System is big-endian.\n");
// //     }
// // #else
// //     #error "Endianness not properly defined."
// // #endif

// // int main() {
// //     print_endianness();
// //     return 0;
// // }

// #include <arpa/inet.h>

// inline uint8_t toLittle8(uint8_t x)
// {
//   return x;
// }

// inline uint16_t toLittle16(uint16_t x)
// {
//   return htons(x);
// }

// inline uint16_t toLittle32(uint32_t x)
// {
//   return htonl(x);
// }
