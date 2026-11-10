#!/usr/bin/env python3
"""
add-background.py

This script composites foreground images onto background images, resizing and centering them appropriately.
It uses the Typer library to provide a user-friendly command-line interface.

Usage:
    python add-background.py add-backgrounds [OPTIONS]

Options:
    --backgrounds TEXT  Directory containing background images (default: ./Backgrounds)
    --foregrounds TEXT  Directory containing foreground images (default: ./Images)
    --output TEXT       Directory to save output images (default: ./Output)
    -q, --quiet         Suppress output messages

Example:
    python add-background.py add-backgrounds --backgrounds ./Backgrounds --foregrounds ./Images --output ./Output

Dependencies:
    - typer
    - pillow

Install dependencies:
    pip install typer[all] pillow

This file was Assisted using common GitHub development aids GPT-4.1 and reviewed by Corban Pendrak.

"""

import os
import typer
from PIL import Image


def process_images(
        background_path: str,
        foreground_path: str,
        output_path: str,
        quiet: bool = False
):
    # Ensure the output directory exists; create it if it doesn't.
    os.makedirs(output_path, exist_ok=True)

    # Iterate over each background image in the background directory.
    for background_filename in os.listdir(background_path):
        # Open the background image and convert it to RGBA mode.
        background = Image.open(os.path.join(background_path, background_filename)).convert('RGBA')
        # Iterate over each foreground image in the foreground directory.
        for foreground_filename in os.listdir(foreground_path):

            # Open the foreground image and convert it to RGBA mode.
            foreground = Image.open(os.path.join(foreground_path, foreground_filename)).convert('RGBA')

            # Get the dimensions of the background and foreground images.
            bg_w, bg_h = background.size
            fg_w, fg_h = foreground.size

            # Calculate the scale factor to match the foreground height to the background.
            scale_factor = fg_h / bg_h

            # Compute new background width and set height to match the foreground.
            new_bg_w = int(bg_w * scale_factor)
            new_bg_h = fg_h

            # Resize the background image to the new dimensions using high-quality resampling.
            background_resized = background.resize((new_bg_w, new_bg_h), Image.LANCZOS)

            # Calculate the x and y coordinates to center the foreground on the background.
            x = (new_bg_w - fg_w) // 2
            y = 0

            # Create a copy of the resized background to composite the images.
            composite = background_resized.copy()

            # Paste the foreground image onto the background, using its alpha channel as a mask.
            composite.paste(foreground, (x, y), foreground)

            # Generate the output filename by combining the foreground and background base names.
            out_name = f"{os.path.splitext(foreground_filename)[0]}-{os.path.splitext(background_filename)[0]}.png"
            out_path = os.path.join(output_path, out_name)

            # Save the composited image to the output directory.
            composite.save(out_path)

            # If not in quiet mode, print the path of the saved image.
            if not quiet:
                print(f"Saved: {out_path}")


app = typer.Typer(help="Composite foreground images onto background images with centering and resizing.")


@app.callback()
def main(
    backgrounds: str = typer.Option('./Backgrounds', help="Directory containing background images."),
    foregrounds: str = typer.Option('./Images', help="Directory containing foreground images."),
    output: str = typer.Option('./Output', help="Directory to save output images."),
    quiet: bool = typer.Option(False, "--quiet", "-q", help="Suppress output messages."),
    ctx: typer.Context = typer.Option(None, hidden=True)
):
    """
    If no command is given, run add_backgrounds by default.
    """
    # If a subcommand is given, do nothing here
    if ctx.invoked_subcommand is None:
        process_images(backgrounds, foregrounds, output, quiet)
        raise typer.Exit()


@app.command()
def add_backgrounds(
        backgrounds: str = typer.Option('./Backgrounds', help="Directory containing background images."),
        foregrounds: str = typer.Option('./Images', help="Directory containing foreground images."),
        output: str = typer.Option('./Output', help="Directory to save output images."),
        quiet: bool = typer.Option(False, "--quiet", "-q", help="Suppress output messages.")
):
    """
    Composite foreground images onto background images with centering and resizing.
    """
    process_images(backgrounds, foregrounds, output, quiet)


@app.command()
def clear_output(
    output: str = typer.Option('./Output', help="Directory to clear.")
):
    """
    Remove all files in the output directory.
    """
    if not os.path.exists(output):
        typer.echo(f"Directory '{output}' does not exist.")
        raise typer.Exit(code=1)
    removed = 0
    for filename in os.listdir(output):
        file_path = os.path.join(output, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)
            removed += 1
    typer.echo(f"Removed {removed} file(s) from '{output}'.")


if __name__ == '__main__':
    app()
