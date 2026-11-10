/*
 * Extended Butterworth Filter Design Calculator
 * Supports Low-pass, High-pass, Band-pass, and Band-reject filters
 * Author: kheng choong (extended Supported by standard GitHub tools)
 * Date: 2023-10-12
 * Version: 2.0
 */

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <math.h>

#define PI 3.141592653589793 

// Function prototypes
void capacitance_lp(uint32_t Freq, int n, int element);
void inductance_lp(uint32_t Freq, int n, int element);
void capacitance_hp(uint32_t Freq, int n, int element);
void inductance_hp(uint32_t Freq, int n, int element);
void bandpass(uint32_t Fc, uint32_t BW, int n, int element);
void bandreject(uint32_t Fc, uint32_t BW, int n, int element);

// Low-pass
void capacitance_lp(uint32_t Freq, int n, int element) {
    double coe = 2 * sin((((2 * element) - 1) * PI) / (2 * n));
    double cap = (coe) / (2 * PI * Freq * 50) * 1e9; // nF
    printf("\nC%d: Coefficient = %.4lf, Capacitance = %.4f nF", element, coe, cap);
}
void inductance_lp(uint32_t Freq, int n, int element) {
    double coe = 2 * sin((((2 * element) - 1) * PI) / (2 * n));
    double ind = (50 * coe) / (2 * PI * Freq) * 1e6; // uH
    printf("\nL%d: Coefficient = %.4lf, Inductance = %.4f uH", element, coe, ind);
}

// High-pass (swap L and C positions, invert formulas)
void capacitance_hp(uint32_t Freq, int n, int element) {
    double coe = 2 * sin((((2 * element) - 1) * PI) / (2 * n));
    double cap = (1.0 / (50 * 2 * PI * Freq * coe)) * 1e9; // nF
    printf("\nC%d: Coefficient = %.4lf, Capacitance = %.4f nF", element, coe, cap);
}
void inductance_hp(uint32_t Freq, int n, int element) {
    double coe = 2 * sin((((2 * element) - 1) * PI) / (2 * n));
    double ind = (50 / (2 * PI * Freq * coe)) * 1e6; // uH
    printf("\nL%d: Coefficient = %.4lf, Inductance = %.4f uH", element, coe, ind);
}

// Band-pass (series LC and parallel LC)
void bandpass(uint32_t Fc, uint32_t BW, int n, int element) {
    double coe = 2 * sin((((2 * element) - 1) * PI) / (2 * n));
    double C = (coe * BW) / (2 * PI * Fc * Fc * 50) * 1e9; // nF
    double L = (50 * coe) / (2 * PI * BW) * 1e6; // uH
    printf("\nElement %d: Series C = %.4f nF, Parallel L = %.4f uH", element, C, L);
}

// Band-reject (parallel LC and series LC)
void bandreject(uint32_t Fc, uint32_t BW, int n, int element) {
    double coe = 2 * sin((((2 * element) - 1) * PI) / (2 * n));
    double C = (1.0 / (50 * 2 * PI * BW * coe)) * 1e9; // nF
    double L = (50 / (2 * PI * BW * coe)) * 1e6; // uH
    printf("\nElement %d: Parallel C = %.4f nF, Series L = %.4f uH", element, C, L);
}

int main() {
    int n, element, Top, filterType;
    uint32_t Freq, Fc, BW;

    printf("Butterworth filter design calculator for equal source and load termination\n");
    printf("Select filter type:\n1. Low-pass\n2. High-pass\n3. Band-pass\n4. Band-reject\n");
    scanf("%d", &filterType);

    printf("Enter filter order: ");
    scanf("%d", &n);

    if (filterType == 3 || filterType == 4) {
        printf("Enter center frequency in Hz: ");
        scanf("%d", &Fc);
        printf("Enter bandwidth in Hz: ");
        scanf("%d", &BW);
    } else {
        printf("Enter cutoff frequency in Hz (limit to 4.2GHz): ");
        scanf("%d", &Freq);
    }

    printf("Enter 1 for PI network or 2 for Tee network: ");
    scanf("%d", &Top);

    if (filterType == 1) { // Low-pass
        if (Top == 1) {
            printf("\nPI network selected (Low-pass)");
            for (int i = 1; i <= n; i++) {
                if (i % 2 == 1)
                    capacitance_lp(Freq, n, i);
                else
                    inductance_lp(Freq, n, i);
            }
        } else if (Top == 2) {
            printf("\nTee network selected (Low-pass)");
            for (int i = 1; i <= n; i++) {
                if (i % 2 == 1)
                    inductance_lp(Freq, n, i);
                else
                    capacitance_lp(Freq, n, i);
            }
        } else {
            printf("\nInvalid topology option.");
        }
    } else if (filterType == 2) { // High-pass
        if (Top == 1) {
            printf("\nPI network selected (High-pass)");
            for (int i = 1; i <= n; i++) {
                if (i % 2 == 1)
                    inductance_hp(Freq, n, i);
                else
                    capacitance_hp(Freq, n, i);
            }
        } else if (Top == 2) {
            printf("\nTee network selected (High-pass)");
            for (int i = 1; i <= n; i++) {
                if (i % 2 == 1)
                    capacitance_hp(Freq, n, i);
                else
                    inductance_hp(Freq, n, i);
            }
        } else {
            printf("\nInvalid topology option.");
        }
    } else if (filterType == 3) { // Band-pass
        printf("\nBand-pass filter selected");
        for (int i = 1; i <= n; i++) {
            bandpass(Fc, BW, n, i);
        }
    } else if (filterType == 4) { // Band-reject
        printf("\nBand-reject filter selected");
        for (int i = 1; i <= n; i++) {
            bandreject(Fc, BW, n, i);
        }
    } else {
        printf("\nInvalid filter type.");
    }

    return 0;
}