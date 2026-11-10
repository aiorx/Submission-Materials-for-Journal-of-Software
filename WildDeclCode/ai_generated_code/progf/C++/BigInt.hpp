/*
This code is Built using basic development resources o3-mini, BEFORE CONTESTs.
Please see my library.
https://github.com/harurunrunrun/c-library/blob/main/library/BigInt.hpp 
*/
#include <gmp.h>
#include <iostream>
#include <string>
#include <stdexcept>
#include <cstdlib>
#include <limits>

class BigInt {
private:
    mpz_t value;

public:
    BigInt() {
        mpz_init(value);
    }

    BigInt(long long v) {
        mpz_init_set_si(value, v);
    }

    BigInt(const std::string &str, int base = 10) {
        if (mpz_init_set_str(value, str.c_str(), base) != 0) {
            mpz_clear(value);
            throw std::invalid_argument("Invalid number string: " + str);
        }
    }

    BigInt(const BigInt &other) {
        mpz_init(value);
        mpz_set(value, other.value);
    }

    BigInt(BigInt &&other) noexcept {
        mpz_init(value);
        mpz_swap(value, other.value);
    }

    ~BigInt() {
        mpz_clear(value);
    }

    BigInt& operator=(const BigInt &other) {
        if (this != &other) {
            mpz_set(value, other.value);
        }
        return *this;
    }

    BigInt& operator=(BigInt &&other) noexcept {
        if (this != &other) {
            mpz_swap(value, other.value);
        }
        return *this;
    }

    BigInt operator+(const BigInt &other) const {
        BigInt result;
        mpz_add(result.value, this->value, other.value);
        return result;
    }

    BigInt operator-(const BigInt &other) const {
        BigInt result;
        mpz_sub(result.value, this->value, other.value);
        return result;
    }

    BigInt operator*(const BigInt &other) const {
        BigInt result;
        mpz_mul(result.value, this->value, other.value);
        return result;
    }

    BigInt operator/(const BigInt &other) const {
        BigInt result;
        mpz_tdiv_q(result.value, this->value, other.value);
        return result;
    }

    BigInt operator%(const BigInt &other) const {
        BigInt result;
        mpz_tdiv_r(result.value, this->value, other.value);
        return result;
    }

    BigInt& operator+=(const BigInt &other) {
        mpz_add(value, value, other.value);
        return *this;
    }

    BigInt& operator-=(const BigInt &other) {
        mpz_sub(value, value, other.value);
        return *this;
    }

    BigInt& operator*=(const BigInt &other) {
        mpz_mul(value, value, other.value);
        return *this;
    }

    BigInt& operator/=(const BigInt &other) {
        mpz_tdiv_q(value, value, other.value);
        return *this;
    }

    BigInt& operator%=(const BigInt &other) {
        mpz_tdiv_r(value, value, other.value);
        return *this;
    }

    BigInt operator-() const {
        BigInt result;
        mpz_neg(result.value, this->value);
        return result;
    }

    BigInt& operator++() {
        mpz_add_ui(value, value, 1);
        return *this;
    }

    BigInt operator++(int) {
        BigInt temp(*this);
        mpz_add_ui(value, value, 1);
        return temp;
    }

    BigInt& operator--() {
        mpz_sub_ui(value, value, 1);
        return *this;
    }

    BigInt operator--(int) {
        BigInt temp(*this);
        mpz_sub_ui(value, value, 1);
        return temp;
    }

    bool operator==(const BigInt &other) const {
        return mpz_cmp(value, other.value) == 0;
    }

    bool operator!=(const BigInt &other) const {
        return mpz_cmp(value, other.value) != 0;
    }

    bool operator<(const BigInt &other) const {
        return mpz_cmp(value, other.value) < 0;
    }

    bool operator<=(const BigInt &other) const {
        return mpz_cmp(value, other.value) <= 0;
    }

    bool operator>(const BigInt &other) const {
        return mpz_cmp(value, other.value) > 0;
    }

    bool operator>=(const BigInt &other) const {
        return mpz_cmp(value, other.value) >= 0;
    }

    operator long long() const {
        if (!mpz_fits_slong_p(value)) {
            throw std::overflow_error("BigInt value does not fit in long long");
        }
        return mpz_get_si(value);
    }

    operator double() const {
        return mpz_get_d(value);
    }

    std::string toString(int base = 10) const {
        char *c_str = mpz_get_str(nullptr, base, value);
        std::string str(c_str);
        free(c_str);
        return str;
    }

    friend std::ostream& operator<<(std::ostream &os, const BigInt &bigInt) {
        os << bigInt.toString();
        return os;
    }

    friend std::istream& operator>>(std::istream &is, BigInt &bigInt) {
        std::string s;
        is >> s;
        if (!is) {
            return is;
        }
        try {
            BigInt tmp(s);
            bigInt = std::move(tmp);
        } catch (const std::exception &e) {
            is.setstate(std::ios_base::failbit);
        }
        return is;
    }
};
