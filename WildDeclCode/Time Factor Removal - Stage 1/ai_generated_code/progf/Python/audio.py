"""
Transcribe an audio file with OpenAI Whisper and (optionally) summarise it.
Automatically splits long audio files into 5-minute chunks to avoid API limits.

Usage
-----
$ python transcribe_and_summarise.py path/to/audio.wav \
      --summarise  # omit --summarise if you only need the transcript
"""

import argparse
import os
from pathlib import Path
import textwrap
import tempfile
from typing import List

from openai import OpenAI, OpenAIError
from pydub import AudioSegment


# -------- configuration ------------------------------------------------------
MODEL_TRANSCRIBE = "whisper-1"     # fastest + most accurate Whisper model
MODEL_SUMMARISE = "gpt-4o-mini"    # cheaper; change to gpt-4o or gpt-4.0 if preferred
OUTPUT_TXT      = "transcript.txt"
OUTPUT_MD       = "summary.md"
MAX_TOKEN_SUMMARY = 1024           # adjust if you need larger summaries
CHUNK_DURATION_MS = 5 * 60 * 1000  # 5 minutes in milliseconds
# Assisted using common GitHub development utilities
# -----------------------------------------------------------------------------

def split_audio_into_chunks(audio_path: Path, chunk_duration_ms: int = CHUNK_DURATION_MS) -> List[Path]:
    """Split audio file into chunks of specified duration to avoid API limits."""
    print("🔀  Loading audio file for chunking..."   
    try:
        # Load audio file
        audio = AudioSegment.from_file(str(audio_path))
        total_duration_ms = len(audio)
        
        # If audio is shorter than chunk duration, no need to split
        if total_duration_ms <= chunk_duration_ms:
            print("📏  Audio duration ({:.1f}s) is within limit, no chunking needed".format(total_duration_ms/1000)            return [audio_path]
        
        print("📏  Audio duration: {:.1f}s, splitting into {:.0f}-minute chunks".format(total_duration_ms/1000, chunk_duration_ms/1000/60)
        
        # Create temporary directory for chunks
        temp_dir = Path(tempfile.mkdtemp(prefix="audio_chunks_"))
        chunk_paths = []
        
        # Split audio into chunks
        chunk_count = 0
        for start_ms in range(0, total_duration_ms, chunk_duration_ms):
            end_ms = min(start_ms + chunk_duration_ms, total_duration_ms)
            chunk = audio[start_ms:end_ms]
            
            chunk_filename = "chunk_{:03d}_{}s-{}s.wav".format(chunk_count, start_ms//1000, end_ms//1000)"
            chunk_path = temp_dir / chunk_filename
            
            chunk.export(str(chunk_path), format="wav")
            chunk_paths.append(chunk_path)
            chunk_count += 1
            
            print("    📦  Created chunk {}: {} ({:.1f}s)".format(chunk_count, chunk_filename, (end_ms-start_ms)/1000)        
        print("✅  Created {} audio chunks in {}".format(len(chunk_paths), temp_dir)        return chunk_paths
        
    except Exception as e:
        raise SystemExit("Error splitting audio file: {}".format(e))


def transcribe_audio(client: OpenAI, audio_path: Path) -> str:
    """Upload an audio file and return the transcript (plain text)."""
    try:
        with audio_path.open("rb") as f:
            response = client.audio.transcriptions.create(
                model=MODEL_TRANSCRIBE,
                file=f,
                response_format="text",  # -> raw string
                # language="en",         # uncomment if you KNOW the language
            )
    except OpenAIError as e:
        raise SystemExit("OpenAI API error during transcription: {}".format(e))

    return response  # already a string


def transcribe_audio_chunks(client: OpenAI, chunk_paths: List[Path]) -> str:
    """Transcribe multiple audio chunks and combine the results."""
    # Assisted using common GitHub development utilities
    all_transcripts = []
    
    for i, chunk_path in enumerate(chunk_paths, 1):
        print("🔊  Transcribing chunk {}/{}: {}...".format(i, len(chunk_paths), chunk_path.name)       
        try:
            transcript = transcribe_audio(client, chunk_path)
            all_transcripts.append(transcript.strip())
        except Exception as e:
            print("⚠️  Warning: Failed to transcribe chunk {}: {}".format(i, e)          all_transcripts.append("[TRANSCRIPTION FAILED FOR CHUNK {}]".format(i))
    
    # Combine all transcripts with spacing
    combined_transcript = "\n\n".join(all_transcripts)
    
    # Clean up temporary chunk files
    if len(chunk_paths) > 1:  # Only clean up if we created chunks
        temp_dir = chunk_paths[0].parent
        print("🧹  Cleaning up temporary chunks in {}".format(temp_dir)       for chunk_path in chunk_paths:
            try:
                chunk_path.unlink()
            except Exception as e:
                print("⚠️  Warning: Could not delete {}: {}".format(chunk_path, e)      
        # Try to remove the temporary directory
        try:
            temp_dir.rmdir()
        except Exception:
            pass  # Directory might not be empty, that's ok
    
    return combined_transcript


def summarise_text(client: OpenAI, transcript: str) -> str:
    """Summarise the transcript and extract action items."""
    prompt = textwrap.dedent(
        "
        You are an executive assistant. Analyse the following meeting transcript.
        1. Provide a concise summary (≈150 words max).
        2. List clear, deduplicated action points in bullet form
           (responsible person → action → deadline if mentioned).

        Transcript (verbatim, do **not** include in the answer):
        ---
        {}
        ---
        ".format(transcript)
    ).strip()

    try:
        response = client.chat.completions.create(
            model=MODEL_SUMMARISE,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=MAX_TOKEN_SUMMARY,
        )
    except OpenAIError as e:
        raise SystemExit("OpenAI API error during summarisation: {}".format(e))

    return response.choices[0].message.content


def main() -> None:
    parser = argparse.ArgumentParser(description="Transcribe (and summarise) audio with OpenAI.")
    parser.add_argument("audio_file", type=Path, help="Path to WAV/MP3/FLAC/M4A file")
    parser.add_argument("--summarise", action="store_true", help="Also produce a summary & action list")
    parser.add_argument("--chunk-minutes", type=int, default=5, help="Split audio into chunks of this many minutes (default: 5)")
    args = parser.parse_args()

    # --- prerequisite checks --------------------------------------------------
    if not args.audio_file.exists():
        raise SystemExit("File not found: {}".format(args.audio_file))

    # NOTE: Make sure OPENAI_API_KEY is exported, e.g.  export OPENAI_API_KEY='sk-...'
    if not os.getenv("OPENAI_API_KEY"):
        raise SystemExit("Set the OPENAI_API_KEY environment variable first.")

    client = OpenAI()  # api_key picked up from env var

    # Split audio into chunks if necessary
    print("🔊  Processing {}...".format(args.audio_file)   chunk_duration_ms = args.chunk_minutes * 60 * 1000  # Convert minutes to milliseconds
    chunk_paths = split_audio_into_chunks(args.audio_file, chunk_duration_ms)
    
    # Transcribe all chunks
    print("🔊  Transcribing audio ({} chunk{})...".format(len(chunk_paths), 's' if len(chunk_paths) > 1 else '')   transcript = transcribe_audio_chunks(client, chunk_paths)
    
    Path(OUTPUT_TXT).write_text(transcript, encoding="utf-8")
    print("✅  Transcript saved to {} ({} words)".format(OUTPUT_TXT, len(transcript.split()))
    if args.summarise:
        print("📝  Summarising & extracting actions …")
        summary = summarise_text(client, transcript)
        Path(OUTPUT_MD).write_text(summary, encoding="utf-8")
        print("✅  Summary + actions saved to {}".format(OUTPUT_MD)
    print("🎉  Done!")


if __name__ == "__main__":
    main()
