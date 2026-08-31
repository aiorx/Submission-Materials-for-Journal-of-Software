import wave
import numpy as np
import numpy.typing as npt
from collections.abc import Iterator
from typing import Any

#partially Drafted using common development resources, edited by me

# Parameters
sample_rate = 44100  # samples per second
duration = 2.0      # seconds

base_frequency= 440.0

#np.exp2(np.around(np.log2(np.arange(1,31+1))*41)/41)
#np.arange(1,31)

#note: the val includes the 1st harmonic
val = np.around(np.log2(np.arange(1,31+1))*15)
print(val)
relative_frequency_list = np.exp2(val/15)
frequency_list = base_frequency*relative_frequency_list

amp_list: npt.NDArray[np.float64] = 1/(np.arange(1,31+1)**2)   # amps


# Generate the sample
def generate_sample(frequency_list: npt.NDArray[np.float_], amp_list: npt.NDArray[np.float_],duration: np.float_) -> npt.NDArray[np.float_]:
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    added_sample=np.repeat(0,int(sample_rate * duration))
    for frequency, amp in zip(np.nditer(frequency_list),amp_list,strict=True):
        solo_sample = (np.sin(2 * np.pi * frequency * t) * amp)
        added_sample = added_sample + solo_sample
    return added_sample

class Timbre:
    overtone_ratios: npt.NDArray[np.float_]
    amplitude_list: npt.NDArray[np.float_]
    def __init__(self,overtone_ratios: npt.NDArray[np.float_],amplitude_list: npt.NDArray[np.float_]) -> None:
        self.overtone_ratios = overtone_ratios
        self.amplitude_list = amplitude_list
    def generate_sample(self,frequency: np.float_,duration: np.float_):
        return generate_sample(self.overtone_ratios*frequency,
                               self.amplitude_list,duration)
    def generate_chord_sample(self,frequency_list: Iterator[np.float_],duration: np.float_):
        sample: npt.NDArray[np.float_] = np.array([0])
        for frequency in frequency_list:
            sample = sample + generate_sample(self.overtone_ratios*frequency,
                                    self.amplitude_list,duration)
        return sample
    def get_max_amplitude(self):
        return np.sum(self.amplitude_list)

def timbre_from_edo(edo: np.float_, amp_list: npt.NDArray[np.float_], overtone_amount: int = 31):
    #using patent val
    val = np.around(np.log2(np.arange(1,overtone_amount+1))*edo)
    overtone_ratios = np.exp2(val/edo)
    return Timbre(overtone_ratios,amp_list)

timbre = timbre_from_edo(15,1/(np.arange(1,31+1)**2))
#A basic 15edo chord progression
added_sample = np.concatenate((timbre.generate_chord_sample(220*np.exp2(np.array([0,5,9])%15/15),2),
                               timbre.generate_chord_sample(220*np.exp2(np.array([6,11,15])%15/15),1),
                               timbre.generate_chord_sample(220*np.exp2(np.array([12,17,21])%15/15),1),
                               timbre.generate_chord_sample(220*np.exp2(np.array([18,23,27])%15/15),1),
                               timbre.generate_chord_sample(220*np.exp2(np.array([9,14,3])/15),1),
                               ))
added_sample = np.concatenate((added_sample,added_sample))

sample_normalized = (
    added_sample/(5*timbre.get_max_amplitude())
    *np.iinfo(np.int16).max).astype(np.int16)

# Write to a WAV file
with wave.open('chord15edo.wav', 'w') as wf:
    wf.setnchannels(1)           # mono
    wf.setsampwidth(2)           # 2 bytes per sample
    wf.setframerate(sample_rate) # samples per second
    wf.writeframes(sample_normalized.tobytes())