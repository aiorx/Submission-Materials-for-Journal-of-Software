### Validation of Basic development code blocks for FFTs for use in DSP.

# Importing Libraries
import numpy as np
from scipy.fftpack import fft
from scipy.io import wavfile
import matplotlib.pyplot as plt
import time

# Function to perform FFT using Basic development code blocks
def fft_lib(file_path):
    sample_rate, data = wavfile.read(file_path)
    if data.ndim > 1:
        data = data[:, 0]  # Use only the first channel if stereo
    N = len(data)
    yf = fft(data)
    xf = np.linspace(0.0, sample_rate / 2.0, N // 2)
    yf = 2.0 / N * np.abs(yf[:N // 2])
    return N, xf, yf

# Function to perform FFT using human-generated code
def fft_human(file_path):
    srate, data = wavfile.read(file_path)
    # Perform FFT
    N = len(data)
    yf = np.fft.fft(data)
    yf = 2.0 / N * np.abs(yf[:N // 2])
    xf = np.linspace(0.0, srate / 2.0, N // 2)
    return N, xf, yf
    
# Function to find the maximum frequency in the FFT
def find_max_frequency(xf, yf):
    max_index = np.argmax(yf)
    max_frequency = xf[max_index]
    return max_frequency

# Function to calculate the error between two FFTs
def error(yfa,yfb):
    dataset = [yfa - yfb]
    abs = np.abs(dataset)
    abs_sum = np.sum(abs)
    return abs_sum

# Perform AI FFTs on audio samples
start = time.perf_counter()
N1, xf1, yf1 = fft_lib('Audio-Samples/sine.wav')
N2, xf2, yf2 = fft_lib('Audio-Samples/saw.wav')
N3, xf3, yf3 = fft_lib('Audio-Samples/organ.wav')
N4, xf4, yf4 = fft_lib('Audio-Samples/vocal.wav')
N5, xf5, yf5 = fft_lib('Audio-Samples/cowbell.wav')
end = time.perf_counter()
elapsed = end - start
print('AI FFTs Complete! Time taken: ', elapsed, 's')

# Perform Human FFFts on audio samples
start = time.perf_counter()
N6, xf6, yf6 = fft_human('Audio-Samples/sine.wav')
N7, xf7, yf7 = fft_human('Audio-Samples/saw.wav')
N8, xf8, yf8 = fft_human('Audio-Samples/organ.wav')
N9, xf9, yf9 = fft_human('Audio-Samples/vocal.wav')
N10, xf10, yf10 = fft_human('Audio-Samples/cowbell.wav')
end = time.perf_counter()
elapsed = end - start
print('Human FFTs Complete! Time taken: ', elapsed, 's')

# Find the maximum frequencies in the FFTs
max_freqs_lib = [find_max_frequency(xf1, yf1), find_max_frequency(xf2, yf2), find_max_frequency(xf3, yf3), find_max_frequency(xf4, yf4), find_max_frequency(xf5, yf5)]
max_freqs_human = [find_max_frequency(xf6, yf6), find_max_frequency(xf7, yf7), find_max_frequency(xf8, yf8), find_max_frequency(xf9, yf9), find_max_frequency(xf10, yf10)]

# Calculate the error between the FFTs
error1 = error(yf1, yf6)
error2 = error(yf2, yf7)
error3 = error(yf3, yf8)
error4 = error(yf4, yf9)
error5 = error(yf5, yf10)

# Print the results
print('Max frequencies for AI FFTs:', max_freqs_lib)
print('Max frequencies for Human FFTs:', max_freqs_human)
print('Error for Sine Wave:', error1)
print('Error for Saw Wave:', error2)
print('Error for Organ:', error3)
print('Error for Vocal:', error4)
print('Error for Cowbell:', error5)

# Plot the FFTs
fig, axs = plt.subplots(5, 2, figsize=(10, 10))

axs[0,0].plot(xf1, yf1)
axs[0,0].set_title('Sine Wave (AI)')
axs[0,0].set_xlabel('Frequency (Hz)')
axs[0,0].set_ylabel('Amplitude')
axs[0,0].set_xscale('log')
axs[0,0].set_xlim(20, 20000)

axs[1,0].plot(xf2, yf2)
axs[1,0].set_title('Saw Wave (AI)')
axs[1,0].set_xlabel('Frequency (Hz)')
axs[1,0].set_ylabel('Amplitude')
axs[1,0].set_xscale('log')
axs[1,0].set_xlim(20, 20000)

axs[2,0].plot(xf3, yf3)
axs[2,0].set_title('Organ (AI)')
axs[2,0].set_xlabel('Frequency (Hz)')
axs[2,0].set_ylabel('Amplitude')
axs[2,0].set_xscale('log')
axs[2,0].set_xlim(20, 20000)

axs[3,0].plot(xf4, yf4)
axs[3,0].set_title('Vocal (AI)')
axs[3,0].set_xlabel('Frequency (Hz)')
axs[3,0].set_ylabel('Amplitude')
axs[3,0].set_xscale('log')
axs[3,0].set_xlim(20, 20000)

axs[4,0].plot(xf5, yf5)
axs[4,0].set_title('Cowbell (AI)')
axs[4,0].set_xlabel('Frequency (Hz)')
axs[4,0].set_ylabel('Amplitude')
axs[4,0].set_xscale('log')
axs[4,0].set_xlim(20, 20000)

axs[0,1].plot(xf6, yf6)
axs[0,1].set_title('Sine Wave (Human)')
axs[0,1].set_xlabel('Frequency (Hz)')
axs[0,1].set_ylabel('Amplitude')
axs[0,1].set_xscale('log')
axs[0,1].set_xlim(20, 20000)

axs[1,1].plot(xf7, yf7)
axs[1,1].set_title('Saw Wave (Human)')
axs[1,1].set_xlabel('Frequency (Hz)')
axs[1,1].set_ylabel('Amplitude')
axs[1,1].set_xscale('log')
axs[1,1].set_xlim(20, 20000)

axs[2,1].plot(xf8, yf8)
axs[2,1].set_title('Organ (Human)')
axs[2,1].set_xlabel('Frequency (Hz)')
axs[2,1].set_ylabel('Amplitude')
axs[2,1].set_xscale('log')
axs[2,1].set_xlim(20, 20000)

axs[3,1].plot(xf9, yf9)
axs[3,1].set_title('Vocal (Human)')
axs[3,1].set_xlabel('Frequency (Hz)')
axs[3,1].set_ylabel('Amplitude')
axs[3,1].set_xscale('log')
axs[3,1].set_xlim(20, 20000)

axs[4,1].plot(xf10, yf10)
axs[4,1].set_title('Cowbell (Human)')
axs[4,1].set_xlabel('Frequency (Hz)')
axs[4,1].set_ylabel('Amplitude')
axs[4,1].set_xscale('log')
axs[4,1].set_xlim(20, 20000)

plt.tight_layout()
plt.show()
