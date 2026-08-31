```c++
void fp32_add_row_to(int n, const float *MLLM_RESTRICT src, float *MLLM_RESTRICT dst, float alpha) {
    int i = 0;
#ifdef __AVX2__
    __m256 alpha_vec = _mm256_set1_ps(alpha); // load alpha into 8 float register

    // 主循环处理8的倍数个元素
    for (; i <= n - 8; i += 8) {
        __m256 src_vec = _mm256_loadu_ps(src + i);                     // load 8 float from src
        __m256 dst_vec = _mm256_loadu_ps(dst + i);                     // load 8 float from dst
        __m256 res_vec = _mm256_fmadd_ps(src_vec, alpha_vec, dst_vec); // alpha * src + dst
        _mm256_storeu_ps(dst + i, res_vec);                            // store back to dst
    }
#elif defined(__ARM_NEON)
    // TODO: Written with routine coding tools-4, not tested yet
    float32x4_t alpha_vec = vdupq_n_f32(alpha); // load alpha into all elements of a 128-bit register

    // Main loop for multiples of 4
    for (; i <= n - 4; i += 4) {
        float32x4_t src_vec = vld1q_f32(src + i);
        float32x4_t dst_vec = vld1q_f32(dst + i);
        float32x4_t res_vec = vmlaq_f32(dst_vec, src_vec, alpha_vec); // calculate alpha * src + dst
        vst1q_f32(dst + i, res_vec);                                  // store result back to dst
    }
#endif

    // 处理剩余的元素
    for (; i < n; ++i) {
        dst[i] = dst[i] + alpha * src[i];
    }
}
```