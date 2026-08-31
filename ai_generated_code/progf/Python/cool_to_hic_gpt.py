# Produced using common development resources.
import cooler
import numpy as np
import struct


def convert_cool_to_hic(cool_filepath, hic_filepath):
    # Load the .cool file
    cool_file = cooler.Cooler(cool_filepath)
    
    # Get the resolution and chromosome names from the .cool file
    resolution = cool_file.binsize
    chromosomes = cool_file.chromnames
    
    # Open the .hic file in binary mode for writing
    with open(hic_filepath, "wb") as hic_file:
        # Write the file header
        hic_file.write(struct.pack('<3s', b"HIC"))  # File magic string
        hic_file.write(struct.pack('<i', 5))  # File version
        hic_file.write(struct.pack('<i', resolution))  # Resolution

        # Write the master index
        master_index_offset = hic_file.tell()
        hic_file.write(struct.pack('<q', 0))  # Placeholder for master index offset
        hic_file.write(struct.pack('<i', len(chromosomes)))  # Number of chromosomes

        # Write the chromosome names
        for chromosome in chromosomes:
            hic_file.write(struct.pack('<i', len(chromosome)))  # Chromosome name length
            hic_file.write(struct.pack(f"<{len(chromosome)}s", chromosome.encode()))  # Chromosome name

        # Write the expected value matrices
        for chromosome1 in chromosomes:
            for chromosome2 in chromosomes:
                matrix = cool_file.matrix(balance=True).fetch(chromosome1, chromosome2)
                matrix = np.nan_to_num(matrix)  # Replace NaN values with zeros
                matrix = matrix.astype(np.float32)  # Convert to float32

                hic_file.write(struct.pack('<i', matrix.shape[0]))  # Matrix size
                hic_file.write(struct.pack('<i', 256))  # Bin size
                hic_file.write(struct.pack(f"<{matrix.size}f", *matrix.flatten()))  # Matrix data

        # Update the master index offset
        current_offset = hic_file.tell()
        hic_file.seek(master_index_offset)
        hic_file.write(struct.pack('<q', current_offset))

    print("Conversion complete.")

# Usage example
cool_filepath = "/work/dipierrolab/douglas/PnM_Hi-C_data/JJ10_11_17_18.wo3kbCisTransHom.50000.cool"
hic_filepath = "/work/dipierrolab/douglas/PnM_Hi-C_data/PnM_haplotype_50kb.hic"
convert_cool_to_hic(cool_filepath, hic_filepath)
