#include <stdio.h>

// Aided via basic GitHub coding utilities

// 求最大公约数（Greatest Common Divisor, GCD）
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 求最小公倍数（Least Common Multiple, LCM）
int lcm(int a, int b) {
    return a / gcd(a, b) * b; // 先除后乘，防止溢出
}

int main() {
    int a = 6;
    int b = 4;
    printf("%d %d\n", gcd(a,b), lcm(a,b));
    return 0;
}

/**
 * 说明
 * gcd 函数：使用迭代实现欧几里得算法，计算两个数的最大公约数。
 * lcm 函数：利用公式 lcm(a, b) = (a * b) / gcd(a, b) 计算最小公倍数。为了避免整数溢出，先将 a 除以 gcd(a, b)，再乘以 b。
 * Aided via basic GitHub coding utilities
 */