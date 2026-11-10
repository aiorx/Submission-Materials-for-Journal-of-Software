"""
    Script Developed via external programming aids's GPT-3 Language Model
    Generated on: 2023/8/8
"""

import os
import pathlib

import click


@click.command()
@click.argument(
    "source-dir",
    nargs=1,
    required=True,
    type=click.Path(
        file_okay=False,
        dir_okay=True,
        exists=True,
        readable=True,
        path_type=pathlib.Path,
    ),
)
@click.argument(
    "target-dir",
    nargs=1,
    required=True,
    type=click.Path(
        file_okay=False,
        dir_okay=True,
        path_type=pathlib.Path,
    ),
)
@click.option(
    "--num-parts",
    default=2,
    type=int,
    help="Number of parts to split the subdirectories into (default: 2)",
)
def main(source_dir, target_dir, num_parts):
    # Create directories for parts if they don't exist
    part_dirs = [target_dir / f"part-{i}" for i in range(1, num_parts + 1)]
    for part_dir in part_dirs:
        part_dir.mkdir(parents=True, exist_ok=True)

    # Get the list of subdirectories in source directory
    subdirs = list(source_dir.iterdir())
    total_subdirs = len(subdirs)
    subdirs_per_part = (total_subdirs // num_parts) + 1

    # Split the list of subdirectories into parts
    subdirs_parts = [
        subdirs[i : i + subdirs_per_part]
        for i in range(0, total_subdirs, subdirs_per_part)
    ]

    # Function to create symbolic links from source directory to destination directory
    def create_links(source_subdirs, dest_dir):
        for sub_dir in source_subdirs:
            dest_path = dest_dir / sub_dir.relative_to(source_dir)
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            os.symlink(sub_dir, dest_path)

    # Create symbolic links for subdirectories in parts
    for i, part_subdirs in enumerate(subdirs_parts):
        part_dir = part_dirs[i]
        create_links(part_subdirs, part_dir)

    print("Symbolic links created successfully.")


if __name__ == "__main__":
    main()
