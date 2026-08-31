/*
* Things needed to make a std::unordered_set of c-style strings.
* This code was Aided with basic GitHub coding tools.
*/

#pragma once

#include <string>

struct cstr_hash {
    size_t operator()( const char* s ) const {
        size_t hash = 0;
        while (*s) {
            hash = hash * 31 + *s++;
        }
        return hash;
    }
};

struct cstr_equal {
    bool operator()( const char* s1, const char* s2 ) const {
        return strcmp( s1, s2 ) == 0;
    }
};

