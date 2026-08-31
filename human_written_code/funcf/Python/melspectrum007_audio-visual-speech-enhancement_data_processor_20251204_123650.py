```python
def signal_to_spectrogram(audio_signal, n_fft, hop_length, mel=True, db=True):
	signal = audio_signal.get_data(channel_index=0)
	D = librosa.core.stft(signal, n_fft=n_fft, hop_length=hop_length)
	magnitude, phase = librosa.core.magphase(D)

	if mel:
		mel_filterbank = librosa.filters.mel(
			sr=audio_signal.get_sample_rate(),
			n_fft=n_fft,
			n_mels=80,
			fmin=0,
			fmax=8000
		)

		magnitude = np.dot(mel_filterbank, magnitude)

	if db:
		magnitude = librosa.amplitude_to_db(magnitude)

	return magnitude, phase
```