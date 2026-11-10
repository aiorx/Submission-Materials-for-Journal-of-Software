# Drafted using common development resources after my chatgpt rant this morning. only using it for a json file though
import librosa
import numpy as np
import json
import os
import soundfile as sf
import matplotlib.pyplot as plt

# Map notes to their standard frequencies (assuming A4 = 440 Hz)
NOTE_FREQS = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
}

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def get_closest_note_freq(note):
    return NOTE_FREQS[note]

from scipy.signal import medfilt

def smooth_pitch(pitches, kernel_size=5):
    """Apply a median filter to smooth out vibrato effects."""
    pitches = np.array(pitches)
    pitches[pitches == 0] = np.nan  # Treat zeroes as missing
    valid = ~np.isnan(pitches)

    # Fill NaNs temporarily for filtering
    filled = np.copy(pitches)
    filled[~valid] = np.nanmean(pitches[valid]) if np.any(valid) else 0

    smoothed = medfilt(filled, kernel_size=kernel_size)
    smoothed[~valid] = np.nan  # Restore NaNs
    return smoothed

def analyze_motif(path, expected_notes):
    y, sr = librosa.load(path)
    
    # Use librosa's piptrack for pitch tracking
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr, fmin=80, fmax=1000)
    times = librosa.frames_to_time(np.arange(pitches.shape[1]), sr=sr)

    note_freqs = []
    note_times = []
    for i in range(pitches.shape[1]):
        pitch_slice = pitches[:, i]
        mag_slice = magnitudes[:, i]
        if np.max(mag_slice) > 0.1:
            index = np.argmax(mag_slice)
            freq = pitch_slice[index]
            if freq > 0:
                note_freqs.append(freq)
                note_times.append(times[i])

    # Smoothing pitch to remove vibrato
    smoothed_freqs = smooth_pitch(note_freqs)

    # Segment based on expected note count
    segment_length = len(smoothed_freqs) // len(expected_notes)
    results = []
    for i, note in enumerate(expected_notes):
        segment = smoothed_freqs[i * segment_length:(i + 1) * segment_length]
        avg_freq = np.nanmean(segment)
        timestamp = note_times[i * segment_length] if i * segment_length < len(note_times) else None
        results.append({
            "note": note,
            "expected_freq": round(get_closest_note_freq(note), 2),
            "detected_freq": round(avg_freq, 2) if avg_freq else None,
            "timestamp": round(timestamp, 2) if timestamp else None
        })

    return results

# Load motifs data
motifs = load_json('motifs.json')['fluteMotifs']

# Analyze all motifs
for motif in motifs:
    print(f"\n🎵 {motif['name']}")
    result = analyze_motif(motif['path'], motif['notes'])
    for entry in result:
        print(f"Note: {entry['note']:2s} | Expected: {entry['expected_freq']} Hz | "
              f"Detected: {entry['detected_freq']} Hz | Time: {entry['timestamp']}s")

