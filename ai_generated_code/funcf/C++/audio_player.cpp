```cpp
void audioPlayerAudioCallback(void* userdata, Uint8* stream, 
                              int callbackBufferSize)
{
    // Drafted using common development resources o1-preview
    // need a callback to keep track of audioBytePos

    AudioPlayer* audioPlayer = static_cast<AudioPlayer*>(userdata);

    if (audioPlayer->isPaused.load())
    {
        // Fill the stream with silence if paused
        SDL_memset(stream, 0, callbackBufferSize);
        return;
    }

    Uint32 currentBytePos = audioPlayer->audioBytePos.load(std::memory_order_relaxed);

    Uint32 remaining = audioPlayer->audioSize - currentBytePos;
    Uint32 toCopy = (callbackBufferSize > static_cast<int>(remaining)) ? remaining : callbackBufferSize;

    if (toCopy > 0)
    {
        // Copy audio data from audioStartPtr to the stream
        SDL_memcpy(stream, 
                   audioPlayer->audioStartPtr + currentBytePos, 
                   toCopy);
        audioPlayer->audioBytePos.fetch_add(toCopy, std::memory_order_relaxed);
    }

    if (toCopy < static_cast<Uint32>(callbackBufferSize))
    {
        // Fill the rest of the stream with silence (if we've reached the end)
        SDL_memset(stream + toCopy, 0, callbackBufferSize - toCopy);
    }

    // If we've reached the end of the audio, stop playback
    if (currentBytePos >= audioPlayer->audioSize)
    {
        // Optionally, you can loop or reset the position
        // For now, we'll pause the audio
        audioPlayer->isPaused.store(true);
        SDL_PauseAudioDevice(audioPlayer->device, 1);
    }
}
```