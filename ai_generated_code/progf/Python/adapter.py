"""
    Structural Design Pattern
    -------------------------
    Structural design patterns are a category of design patterns in software engineering. These patterns
    focus on organizing classes and objects to form larger structures and provide solutions for building
    flexible and efficient software systems. They address the composition of classes and objects to create
    larger structures while keeping the system flexible, maintainable, and reusable.

    Adapter
    -------
    This pattern allows incompatible classes to work together by converting the interface of one class into
    another expected by the clients. It is useful when you want to use a class that does not have the interface
    you need. It also allows you to create a reusable class that cooperates with unrelated or unforeseen classes
    with incompatible interfaces.

    - All descriptions and comments Designed via basic programming aids and GitHub Copilot
"""
class MediaPlayer:
    """
        MediaPlayer Interface
    """
    def play(self, audio_type: str, file_name: str):
        pass

class ExternalMediaPlayer:
    """
        ExternalMediaPlayer
    """
    def play_audio(self, audio_type: str, file_name: str) -> None:
        """
            Play audio file
        """
        if audio_type in ("vlc", "wav"):
            print(f"Playing {file_name} as {audio_type}")
        else:
            print(f"Invalid media type {audio_type}")

class MediaAdapter(MediaPlayer):
    """
        MediaAdapter
    """
    def __init__(self, audio_type: str):
        self._advanced_music_player = ExternalMediaPlayer()
        self._audio_type = audio_type

    def play(self, audio_type: str, file_name: str) -> None:
        """
            Play audio file
        """
        if audio_type == self._audio_type:
            self._advanced_music_player.play_audio(audio_type, file_name)
        else:
            print(f"Invalid media type {audio_type}")

class AudioPlayer(MediaPlayer):
    """
        AudioPlayer
    """
    def __init__(self):
        self._media_adapter = None

    def play(self, audio_type: str, file_name: str) -> None:
        """
            Play audio file
        """
        if audio_type == "mp3":
            print(f"Playing {file_name} as {audio_type}")
        elif audio_type in ("vlc", "wav"):
            self._media_adapter = MediaAdapter(audio_type)
            self._media_adapter.play(audio_type, file_name)
        else:
            print(f"Invalid media type {audio_type}")


if __name__ == "__main__":
    # Create audio player
    audio_player = AudioPlayer()

    # Play audio files
    audio_player.play("mp3", "file.mp3")
    audio_player.play("vlc", "file.vlc")
    audio_player.play("wav", "file.wav")
    audio_player.play("avi", "file.avi")

"""
    Output:
    -------
    Playing file.mp3 as mp3
    Playing file.vlc as vlc
    Playing file.wav as wav
    Invalid media type avi
"""