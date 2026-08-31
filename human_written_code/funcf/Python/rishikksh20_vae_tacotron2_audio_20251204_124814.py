```python
def start_and_end_indices(quantized, silence_threshold=2):
	for start in range(quantized.size):
		if abs(quantized[start] - 127) > silence_threshold:
			break
	for end in range(quantized.size - 1, 1, -1):
		if abs(quantized[end] - 127) > silence_threshold:
			break

	assert abs(quantized[start] - 127) > silence_threshold
	assert abs(quantized[end] - 127) > silence_threshold

	return start, end
```