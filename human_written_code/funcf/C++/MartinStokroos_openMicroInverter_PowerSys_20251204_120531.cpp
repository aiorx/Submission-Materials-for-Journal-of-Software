```cpp
/*
 * Orthogonal Signal Generators (OSG)
 *
 *
 */
// FULL WAVE LUT, 10-bit OSG with raised (>=0) sin and cos outputs and cumulative phase increment.
void PowerControl::osgUpdate1(unsigned long _phaseInc) {
	phaseAccu1 += (tuningWord + _phaseInc);
	rsin = pgm_read_word(fullwave_lut1024 + (unsigned int)(phaseAccu1>>22)); // reference sine output
	rcos = pgm_read_word(fullwave_lut1024 + (unsigned int)((phaseAccu1 + PHASE_OFFS_270)>>22)); // reference cosine output
}
```