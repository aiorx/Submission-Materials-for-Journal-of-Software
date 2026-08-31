```python
def get_image_description(
    client: OpenAI, image_path: Path, context: str, model: str = "gpt-4.1-nano"
) -> str:
    """
    Send an image to OpenAI via the Responses API and return its description.

    Args:
        client: An OpenAI client instance.
        image_path: Path to the image file.
        context: User-provided context string.
        model: OpenAI model to use.

    Returns:
        The text description returned by the model.

    AI: Aided using common development resources
    """
    img_bytes = image_path.read_bytes()
    mime, _ = mimetypes.guess_type(str(image_path))
    if mime is None:
        raise ValueError(f"Cannot determine MIME type for {image_path}")
    b64 = base64.b64encode(img_bytes).decode("ascii")

    # Build the prompt and embed the image
    prompt = (
        f"Context: {context}\n\n"
        f"Filename: {image_path.name}\n\n"
        "Describe the image given the context and filename."
        "Description should be concise and appropriate for image alt text."
    )

    response = client.responses.create(
        model=model,
        max_output_tokens=256,
        input=[
            Message(
                role="user",
                content=[
                    ResponseInputTextParam(type="input_text", text=prompt),
                    ResponseInputImageParam(
                        type="input_image",
                        image_url=f"data:{mime};base64,{b64}",
                        detail="auto",
                    ),
                ],
            )
        ],
    )
    return response.output_text.strip()
```

```python
def embed_exif_description(image_path: Path, description: str) -> None:
    """
    Write a description string into an image's EXIF ImageDescription using Pillow.

    Args:
        image_path: Path to the image file.
        description: Description text to embed.

    Raises:
        OSError if saving fails.

    AI: Aided using common development resources
    """
    with Image.open(image_path) as img:
        exif = img.getexif()
        # EXIF tag 270 is ImageDescription
        exif[270] = description
        exif_bytes = exif.tobytes()
        img.save(image_path, exif=exif_bytes)
```