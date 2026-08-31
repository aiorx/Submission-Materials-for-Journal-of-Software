#include <gtest/gtest.h>

#include <cstddef>
#include <limits>

#include "src/utils/include/bitwise.hpp"

using namespace nyx::utils::bitwise;

// All test suites Supported via standard programming aids

// Test suite for CountingLeadingZero function
TEST(BitwiseTest, CountingLeadingZero) {
  // Test case 1: Zero Input
  EXPECT_EQ(clz(0), 64) << "Failed for input: 0. Expected 64 (all bits are zeros).";

  // Test case 2: Single Bit Set (powers of two)
  EXPECT_EQ(clz(1), 63) << "Failed for input: 1. Expected 63 (one bit set at position 0).";
  EXPECT_EQ(clz(2), 62) << "Failed for input: 2. Expected 62 (one bit set at position 1).";
  EXPECT_EQ(clz(4), 61) << "Failed for input: 4. Expected 61 (one bit set at position 2).";
  EXPECT_EQ(clz(8), 60) << "Failed for input: 8. Expected 60 (one bit set at position 3).";
  EXPECT_EQ(clz(16), 59) << "Failed for input: 16. Expected 59 (one bit set at position 4).";
  EXPECT_EQ(clz(32), 58) << "Failed for input: 32. Expected 58 (one bit set at position 5).";

  // Test case 3: All bits set (`~0` or std::numeric_limits<std::size_t>::max())
  EXPECT_EQ(clz(std::numeric_limits<std::size_t>::max()), 0) << "Failed for input: maximum std::size_t value. Expected 0 (no leading zeros).";

  // Test case 4: Mixed bits (non-zero non-power-of-two values)
  EXPECT_EQ(clz(3), 62) << "Failed for input: 3 (0b11). Expected 62 (62 leading zeros).";
  EXPECT_EQ(clz(5), 61) << "Failed for input: 5 (0b101). Expected 61 (61 leading zeros).";
  EXPECT_EQ(clz(6), 61) << "Failed for input: 6 (0b110). Expected 61 (61 leading zeros).";
  EXPECT_EQ(clz(10), 60) << "Failed for input: 10 (0b1010). Expected 60 (60 leading zeros).";
  EXPECT_EQ(clz(12), 60) << "Failed for input: 12 (0b1100). Expected 60 (60 leading zeros).";

  // Additional test cases
  EXPECT_EQ(clz(7), 61) << "Failed for input: 7 (0b111). Expected 61 (61 leading zeros).";
  EXPECT_EQ(clz(24), 59) << "Failed for input: 24 (0b11000). Expected 59 (59 leading zeros).";
  EXPECT_EQ(clz(40), 58) << "Failed for input: 40 (0b101000). Expected 58 (58 leading zeros).";
  EXPECT_EQ(clz(64), 57) << "Failed for input: 64 (0b1000000). Expected 57 (57 leading zeros).";

  for (int i = 0; i < 64; ++i) {
    std::size_t mask = 1LL << i;
    EXPECT_EQ(clz(mask), 63 - i);
  }
}

TEST(BitwiseTest, CountingTrailingZero) {
  // Test case 1: Zero Input
  EXPECT_EQ(ctz(0), 64) << "Failed for input: 0. Expected 64 (no bits set).";

  // Test case 2: Single Bit Set (powers of two)
  EXPECT_EQ(ctz(1), 0) << "Failed for input: 1. Expected 0 (least significant bit set).";
  EXPECT_EQ(ctz(2), 1) << "Failed for input: 2. Expected 1 (one trailing zero).";
  EXPECT_EQ(ctz(4), 2) << "Failed for input: 4. Expected 2 (two trailing zeros).";
  EXPECT_EQ(ctz(8), 3) << "Failed for input: 8. Expected 3 (three trailing zeros).";
  EXPECT_EQ(ctz(16), 4) << "Failed for input: 16. Expected 4 (four trailing zeros).";
  EXPECT_EQ(ctz(32), 5) << "Failed for input: 32. Expected 5 (five trailing zeros).";

  // Test case 3: All bits set (`~0` or std::numeric_limits<std::size_t>::max())
  EXPECT_EQ(ctz(std::numeric_limits<std::size_t>::max()), 0)
      << "Failed for input: maximum std::size_t value. Expected 0 (least significant bit set).";

  // Test case 4: Mixed bits (non-zero non-power-of-two values)
  EXPECT_EQ(ctz(3), 0) << "Failed for input: 3 (0b11). Expected 0 (least significant bit set).";
  EXPECT_EQ(ctz(5), 0) << "Failed for input: 5 (0b101). Expected 0 (least significant bit set).";
  EXPECT_EQ(ctz(6), 1) << "Failed for input: 6 (0b110). Expected 1 (one trailing zero).";
  EXPECT_EQ(ctz(10), 1) << "Failed for input: 10 (0b1010). Expected 1 (one trailing zero).";
  EXPECT_EQ(ctz(12), 2) << "Failed for input: 12 (0b1100). Expected 2 (two trailing zeros).";

  // Additional test cases
  EXPECT_EQ(ctz(7), 0) << "Failed for input: 7 (0b111). Expected 0 (least significant bit set).";
  EXPECT_EQ(ctz(24), 3) << "Failed for input: 24 (0b11000). Expected 3 (three trailing zeros).";
  EXPECT_EQ(ctz(40), 3) << "Failed for input: 40 (0b101000). Expected 3 (three trailing zeros).";
  EXPECT_EQ(ctz(64), 6) << "Failed for input: 64 (0b1000000). Expected 6 (six trailing zeros).";

  for (int i = 0; i < 64; ++i) {
    std::size_t mask = 1LL << i;
    EXPECT_EQ(ctz(mask), i);
  }
}

// Test suite for LeftMostBit function
TEST(BitwiseTest, LeftMostBit) {
  // Test case 1: Zero Input
  EXPECT_EQ(lmb(0), std::nullopt) << "Failed for input: 0. Expected std::nullopt (no bits set).";

  // Test case 2: Single Bit Set (powers of two)
  EXPECT_EQ(lmb(1), 0) << "Failed for input: 1. Expected 1 (leftmost bit at position 0 is set).";
  EXPECT_EQ(lmb(2), 1) << "Failed for input: 2. Expected 2 (leftmost bit at position 1 is set).";
  EXPECT_EQ(lmb(4), 2) << "Failed for input: 4. Expected 3 (leftmost bit at position 2 is set).";
  EXPECT_EQ(lmb(8), 3) << "Failed for input: 8. Expected 4 (leftmost bit at position 3 is set).";
  EXPECT_EQ(lmb(16), 4) << "Failed for input: 16. Expected 5 (leftmost bit at position 4 is set).";
  EXPECT_EQ(lmb(32), 5) << "Failed for input: 32. Expected 6 (leftmost bit at position 5 is set).";

  // Test case 3: All bits set (`~0` or std::numeric_limits<std::size_t>::max())
  EXPECT_EQ(lmb(std::numeric_limits<std::size_t>::max()), 63) << "Failed for input: maximum std::size_t value. Expected 64 (all bits set).";

  // Test case 4: Mixed bits (non-zero non-power-of-two values)
  EXPECT_EQ(lmb(3), 1) << "Failed for input: 3 (0b11). Expected 2 (leftmost bit at position 1 is set).";
  EXPECT_EQ(lmb(5), 2) << "Failed for input: 5 (0b101). Expected 3 (leftmost bit at position 2 is set).";
  EXPECT_EQ(lmb(6), 2) << "Failed for input: 6 (0b110). Expected 3 (leftmost bit at position 2 is set).";
  EXPECT_EQ(lmb(10), 3) << "Failed for input: 10 (0b1010). Expected 4 (leftmost bit at position 3 is set).";
  EXPECT_EQ(lmb(12), 3) << "Failed for input: 12 (0b1100). Expected 4 (leftmost bit at position 3 is set).";

  // Additional test cases
  EXPECT_EQ(lmb(7), 2) << "Failed for input: 7 (0b111). Expected 3 (leftmost bit at position 2 is set).";
  EXPECT_EQ(lmb(24), 4) << "Failed for input: 24 (0b11000). Expected 5 (leftmost bit at position 4 is set).";
  EXPECT_EQ(lmb(40), 5) << "Failed for input: 40 (0b101000). Expected 6 (leftmost bit at position 5 is set).";
  EXPECT_EQ(lmb(64), 6) << "Failed for input: 64 (0b1000000). Expected 7 (leftmost bit at position 6 is set).";
}

// Test suite for IsPowerOfTwo function
TEST(BitwiseTest, IsPowerOfTwo) {
  // Test case 1: Zero Input
  EXPECT_FALSE(is_power_of_two(0)) << "Failed for input: 0. Expected false (0 is not a power of two).";

  // Test case 2: Positive Powers of Two
  EXPECT_TRUE(is_power_of_two(1)) << "Failed for input: 1. Expected true (1 is 2^0, which is a power of two).";
  EXPECT_TRUE(is_power_of_two(2)) << "Failed for input: 2. Expected true (2 is 2^1, which is a power of two).";
  EXPECT_TRUE(is_power_of_two(4)) << "Failed for input: 4. Expected true (4 is 2^2, which is a power of two).";
  EXPECT_TRUE(is_power_of_two(8)) << "Failed for input: 8. Expected true (8 is 2^3, which is a power of two).";
  EXPECT_TRUE(is_power_of_two(16)) << "Failed for input: 16. Expected true (16 is 2^4, which is a power of two).";
  EXPECT_TRUE(is_power_of_two(32)) << "Failed for input: 32. Expected true (32 is 2^5, which is a power of two).";
  EXPECT_TRUE(is_power_of_two(64)) << "Failed for input: 64. Expected true (64 is 2^6, which is a power of two).";

  // Test case 3: Non-Powers of Two
  EXPECT_FALSE(is_power_of_two(3)) << "Failed for input: 3. Expected false (3 is not a power of two).";
  EXPECT_FALSE(is_power_of_two(5)) << "Failed for input: 5. Expected false (5 is not a power of two).";
  EXPECT_FALSE(is_power_of_two(6)) << "Failed for input: 6. Expected false (6 is not a power of two).";
  EXPECT_FALSE(is_power_of_two(10)) << "Failed for input: 10. Expected false (10 is not a power of two).";
  EXPECT_FALSE(is_power_of_two(12)) << "Failed for input: 12. Expected false (12 is not a power of two).";
  EXPECT_FALSE(is_power_of_two(18)) << "Failed for input: 18. Expected false (18 is not a power of two).";
  EXPECT_FALSE(is_power_of_two(100)) << "Failed for input: 100. Expected false (100 is not a power of two).";

  // Test case 4: Negative Numbers
  EXPECT_FALSE(is_power_of_two(-1)) << "Failed for input: -1. Expected false (negative numbers are not powers of two).";
  EXPECT_FALSE(is_power_of_two(-2)) << "Failed for input: -2. Expected false (negative numbers are not powers of two).";
  EXPECT_FALSE(is_power_of_two(-4)) << "Failed for input: -4. Expected false (negative numbers are not powers of two).";
}

// Test suite for TurnOffBit
TEST(BitwiseTest, TurnOffBit) {
  // Test case 1: Turning off a bit that is set
  std::size_t x = 9223372036854775809ULL;  // Binary: 100000...000001

  turn_off_bit(x, 63);  // Turn off the 63rd bit
  EXPECT_EQ(x, 1) << "Failed to turn off 63rd bit.";

  turn_off_bit(x, 0);  // Turn off the 0th bit
  EXPECT_EQ(x, 0) << "Failed to turn off 0th bit.";

  // Test case 2: Turning off a bit that is already off (should have no effect)
  turn_off_bit(x, 1);  // 1st bit is already off
  EXPECT_EQ(x, 0) << "Turning off already off 1st bit should have no effect.";

  // Test case 3: Turning off all bits in a full set value
  x = std::numeric_limits<std::size_t>::max();  // All bits are set
  turn_off_bit(x, 63);
  EXPECT_EQ(x, std::numeric_limits<std::size_t>::max() - (1ULL << 63)) << "Failed to turn off 63rd bit in fully set value.";

  turn_off_bit(x, 0);
  EXPECT_EQ(x, std::numeric_limits<std::size_t>::max() - (1ULL << 63) - 1) << "Failed to turn off 0th bit in fully set value.";
}

// Test suite for TurnOnBit
TEST(BitwiseTest, CombinedTurnOnOff) {
  // Test case 1: Turning on and then off a bit
  std::size_t x = 0;

  turn_on_bit(x, 5);  // Turn on the 5th bit
  EXPECT_EQ(x, 32) << "Failed to turn on 5th bit. Expected 32.";

  turn_off_bit(x, 5);  // Turn off the 5th bit
  EXPECT_EQ(x, 0) << "Failed to turn off 5th bit.";

  // Test case 2: Turning off a bit and turning it back on
  turn_on_bit(x, 10);  // Turn on the 10th bit
  EXPECT_EQ(x, 1024) << "Failed to turn on 10th bit. Expected 1024.";

  turn_off_bit(x, 10);  // Turn off the 10th bit
  EXPECT_EQ(x, 0) << "Failed to turn off 10th bit.";

  turn_on_bit(x, 10);  // Turn it back on
  EXPECT_EQ(x, 1024) << "Failed to turn back on 10th bit. Expected 1024.";
}
