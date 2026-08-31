```python
    local_filename = f"Video{Num}.mp4" # Der lokale Dateiname für das Video

    # Lädt das Video von der angegebenen URL herunter und speichert es lokal
    with requests.get(Video_id, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)

    
    # Öffnet das Video mit der Standardanwendung für .mp4-Dateien
    os.startfile(local_filename)
```