```python
def load_tts_model(tts_weights, device):
    """
    Load the Tacotron TTS model with the given weights and move it to the specified device.
    
    Args:
        tts_weights (str): Path to the Tacotron weights file.
        device (torch.device): The device to load the model onto.
        
    Returns:
        Tacotron: The loaded Tacotron model.
    """
    print('\nInitialising Tacotron Model...\n')
    tts_model = Tacotron()
    if tts_weights is not None:
        tts_model.load(tts_weights)
    tts_model.to(device)
    tts_model.eval()
    return tts_model
```