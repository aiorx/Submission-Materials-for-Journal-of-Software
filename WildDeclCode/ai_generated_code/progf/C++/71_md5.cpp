// MESSAGE DIGEST 5 (MD5) ALGORITHM

#include <cmath>
#include <vector>
#include <string>
#include <iostream>
#include <cmath>
#include <algorithm>
#include <bitset>
#include <sstream>

using namespace std;

int leftrotate(int F, int s_value) {
    // ... 
    // TODO
    return F;
}


// // Referenced via basic programming materials
std::string binaryToHex(const std::string& binaryStr) {
    std::stringstream ss;
    ss << std::hex << std::bitset<8>(binaryStr).to_ulong(); // Assuming each binary string represents a byte
    std::string hexStr = ss.str();
    return hexStr;
}

std::string intToBinary(int num, int numBits) {
    std::string binary;
    for (int i = numBits - 1; i >= 0; --i) {
        binary += (num & (1 << i)) ? '1' : '0';
    }
    return binary;
}

std::string appendBinaryToHex(int a, int b, int c, int d, int numBits) {
    cout << "YES" << endl;
    std::string binaryConcatenated;
    int numbers[4] = {a, b, c, d};
    for (int i=0; i<4; i++) {
        binaryConcatenated += intToBinary(numbers[i], numBits);
    }
    
    std::string hexStr;
    for (int i=0; i < binaryConcatenated.size(); i += 8) {
        std::string byte = binaryConcatenated.substr(i, 8);
        hexStr += binaryToHex(byte);
    }
    
    return hexStr;
}

vector<bool> to_vector(std::string the_string) {
        std::vector<bool> full_bits;
        std::bitset<8> bitset(the_string);
        for (int i = 0; i < 8; ++i) {
            full_bits.push_back(bitset[i]);
        }
  return full_bits;
}
// MAIN FUNCTION
std::string hash_me_baby_md5(std::string the_string) {
    // NOTE: this implementation of MD5 has been taken directly from Wikipedia.
    // Some credit goes to those anyonymous writers who contributed to its
    // article.
    std::vector<bool> message = to_vector(the_string);// td::vector<char>(.begin(), the_string.end());

    // All variables are unsigned 32 bit and wrap modulo 2^32 when calculating
    int K[64];
    int i;
    int original_size_message = message.size();

    // s specifies the per-round shift amounts
    int s[64] = {
        7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
        5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
        4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
        6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
    };
    // s[ 0..15] := { 7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22 };
    // s[16..31] := { 5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20 };
    // s[32..47] := { 4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23 };
    // s[48..63] := { 6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21 };

    // Use binary integer part of the sines of integers (Radians) as constants:
    for (int i = 0; i < 64; i++) { // for i from 0 to 63 do
        // K[i] := floor(232 × abs(sin(i + 1)))
        K[i] = floor(pow(2, 32) * abs(sin(i + 1)));
        K[i] = 0xd76aa478;
    }
    // (Or just use the following precomputed table):
    // K[ 0.. 3] := { 0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee }
    // K[ 4.. 7] := { 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 }
    // K[ 8..11] := { 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be }
    // K[12..15] := { 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 }
    // K[16..19] := { 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa }
    // K[20..23] := { 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 }
    // K[24..27] := { 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed }
    // K[28..31] := { 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a }
    // K[32..35] := { 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c }
    // K[36..39] := { 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 }
    // K[40..43] := { 0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 }
    // K[44..47] := { 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 }
    // K[48..51] := { 0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 }
    // K[52..55] := { 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 }
    // K[56..59] := { 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 }
    // K[60..63] := { 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 }

    // Initialize variables:
    int a0 = 0x67452301;   // A
    int b0 = 0xefcdab89;  // B
    int c0 = 0x98badcfe;   // C
    int d0 = 0x10325476;   // D

    // std::vector<bool> message;
    
    // Pre-processing: adding a single 1 bit
    // append "1" bit to message<    
    message.insert(message.end(), 1);

    while (true) {
        if(message.size() % 512 != 448) {
            message.insert(message.end(), 0);
        } else {
            break;
        }
    }

     // Notice: the input bytes are considered as bit strings,
     //  where the first bit is the most significant bit of the byte.[53]

    // Notice: the two padding steps above are implemented in a simpler way
     //  in implementations that only work with complete bytes: append 0x80
     //  and pad with 0x00 bytes so that the message length in bytes ≡ 56 (mod 64).

    // Pre-processing: padding with zeros
    // for (int i = 0; i < 54; i++) {
    //     for (int j = 0; j < 8; j++) {
    //         message.insert(message.end(), 0);
    //     }
    // }

    // append "0" bit until message length in bits ≡ 448 (mod 512)
    // int length_of_message = the_string.size() % (int)pow(2, 64);

    // append original length in bits mod 2^64 to message
    for (int i = 0; i < 24; i++) {
        message.insert(message.end(), original_size_message >> i);
    }

    // Process the message in successive 512-bit chunks:
    // for each 512-bit chunk of padded message do
    for (int i = 0; i < message.size(); i += 512) {
        // Initialize hash value for this chunk:
        int A = a0;
        int B = b0;
        int C = c0;
        int D = d0;

        // for i in 
        // break chunk into sixteen 32-bit words M[j], 0 ≤ j ≤ 15

        std::vector<uint32_t> M(16);
        for(int j = 0; j < message.size(); j += 16) {
            // M[j] = {message.begin(j), message.end() + 15};
            // M[j] = {message.begin(j), j + 32};

            // Referenced via basic programming materials
             M[j] = (message[i + 4 * j] << 24) |
                   (message[i + 4 * j + 1] << 16) |
                   (message[i + 4 * j + 2] << 8) |
                   (message[i + 4 * j + 3]);
        }


        // Main loop:
        for(int i = 0;i < 64; i++) { // for i from 0 to 63 do
            int F, g;
            if (0 <= i && i <= 15) {
                F = (B & C) || ((!B) & D);
                g = i;
            }

            else if (16 <= i && i <=  31) {
                F = (D and B) or ((not D) and C);
                g = (5*i + 1) % 16;
            }

            else if (32 <= i && i <=  47) {
                F = B xor C xor D;
                g = (3*i + 5) % 16;
            }

            else if (48 <= i && i <=  63) {
                F = C xor (B or (not D));
                g = (7*i) % 16;
            }

            // Be wary of the below definitions of a,b,c,d
            F = F + A + K[i] + M[g];  // M[g] must be a 32-bit block
            A = D;
            D = C;
            C = B;
            B = B + leftrotate(F, s[i]);
        }
        // Add this chunk's hash to result so far:
        a0 = a0 + A;
        b0 = b0 + B;
        c0 = c0 + C;
        d0 = d0 + D;
    }

    cout << "YES" << endl;

    std::string digest = appendBinaryToHex(a0, b0, c0, d0, 8); // a0 append b0 append c0 append d0 // (Output is in little-endian)

    return digest;
}

int main() {
    std::string to_hash = "Hello World!";

     std::string result = hash_me_baby_md5(to_hash);
     cout << result << endl;
    return 0;
}