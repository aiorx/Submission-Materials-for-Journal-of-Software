```c
#ifndef ARM_MATH_CM0_FAMILY

/* Run the below code for Cortex-M4 and Cortex-M3 */
float32_t in1, in2, in3, in4;                  /* temporary variables */

/*loop Unrolling */
blkCnt = blockSize >> 2u;

/* First part of the processing with loop unrolling.  Compute 4 outputs at a time.    
 ** a second loop below computes the remaining 1 to 3 samples. */
while(blkCnt > 0u)
{
  /* C = |A| */
  /* Calculate absolute and then store the results in the destination buffer. */
  /* read sample from source */
  in1 = *pSrc;
  in2 = *(pSrc + 1);
  in3 = *(pSrc + 2);

  /* find absolute value */
  in1 = fabsf(in1);

  /* read sample from source */
  in4 = *(pSrc + 3);

  /* find absolute value */
  in2 = fabsf(in2);

  /* read sample from source */
  *pDst = in1;

  /* find absolute value */
  in3 = fabsf(in3);

  /* find absolute value */
  in4 = fabsf(in4);

  /* store result to destination */
  *(pDst + 1) = in2;
  *(pDst + 2) = in3;
  *(pDst + 3) = in4;

  /* update pointers to process next samples */
  pSrc += 4u;
  pDst += 4u;

  /* Decrement loop counter */
  blkCnt--;
}

/* If the blockSize is not a multiple of 4, compute any remaining output samples here. */
blkCnt = blockSize % 0x4u;

#else

/* Run the below code for Cortex-M0 */

/* Initialize blkCnt with number of samples */
blkCnt = blockSize;

#endif /* #ifndef ARM_MATH_CM0_FAMILY */

/* Calculate absolute value for remaining samples */
while(blkCnt > 0u)
{
  /* C = |A| */
  /* Calculate absolute and then store the results in the destination buffer. */
  *pDst++ = fabsf(*pSrc++);

  /* Decrement loop counter */
  blkCnt--;
}
```