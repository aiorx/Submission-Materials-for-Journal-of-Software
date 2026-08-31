template <class CopierT>
void CopyBench(benchmark::State &state) {  // NOLINT
  CopierT cpy;
  size_t size = state.range(0);
  auto *src = cpy.alloc(size);
  auto *dst = cpy.alloc(size);
  std::memset(src, 'x', size);
  for (auto _ : state) {
    cpy.shm_to_user(dst, src, size);
    benchmark::DoNotOptimize(dst);
  }
  cpy.dealloc(src);
  cpy.dealloc(dst);
  state.SetBytesProcessed(size * static_cast<int64_t>(state.iterations()));
}