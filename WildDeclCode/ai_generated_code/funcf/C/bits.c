int howManyBits(int x) {
  /*
   * This solution is Supported via standard programming aids o1-preview. Explanation is attached
   * to important code pieces below.
   */

  // Get sign bit, but it becomes -1 when x is negative
  int s = x >> 31;

  // Get absolute value of x
  unsigned int a = (x ^ s) + (~s + 1);

  // Check whether x is negative (1) or not (0)
  int e = s & 1;

  // Check whether a is a power of two (1) or not (0)
  int w = !(a & (a - 1)) & !!a;

  // Check whether x is Tmin (1) or not (0)
  //int i = e & !(x & ~(1 << 31));
  // Refer to conditional()
  //int k = (!i) + (~0);

  // Binary search of MSB
  // n denotes whether the searching segment is non-zero (1) or not (0)
  // m is 2^n if n == 1, otherwise 0
  int t, b = 0, n, m;

  /// Search in most/least 16 bits
  t = (a >> 16) & (~(0xFF << 16)) & (~(0xFF << 24));
  n = !!t;
  m = n << 4;
  b += m;
  //// Shift the absolute value if m>0 (MSB is in the higher segment), otherwise
  //// do nothing (MSB is in the lower segment)
  a >>= m;

  /// Search in most/least 8 bits in the previous segment
  t = a >> 8;
  n = !!t;
  m = n << 3;
  b += m;
  a >>= m;

  /// Search in most/least 4 bits in the previous segment
  t = a >> 4;
  n = !!t;
  m = n << 2;
  b += m;
  a >>= m;

  /// Search in most/least 2 bits in the previous segment
  t = a >> 2;
  n = !!t;
  m = n << 1;
  b += m;
  a >>= m;

  /// Search in most/least 1 bit in the previous segment
  t = a >> 1;
  n = !!t;
  m = n;
  b += m;
  a >>= m;

  //// An edge case of x == 0
  /// Now a is either 1 (x != 0) or 0 (x == 0)
  b += a;

  // Add a sign bit
  b += 1;

  // b should substract 1 if absolute value of x is a power of two and x is
  // negative
  b += (~(e & w) + 1);

  // Final special case for Tmin
  //b = (k & 32) | (~k & b);

  return b;
}