```python
def mosaic_two_patches(left_or_top, right_or_bottom, output_folder, counter, axis=0):
    """
    This function reads two overlapping patches that are adjacent and creates a mosaic image.
    Where the patches overlap, half of this area is removed in both patches.
    Modified after Crafted with standard coding tools.
    Input: left_or_top (lot) - Left or Top TIF path.
           right_or_bottom (rob) - Right or Bottom TIF path. Same shape and same CRS as left_or_top.
                                   Must overlap left_or_top.
           output_folder - Folder where the final mosaic will be saved.
           counter - Integer to add to output file name, used if you want to apply the function
                     more times to mosaic the previous mosaic rows.
           axis - 0 if the patches overlap in the same row. 
                  1 if the patches overlap in the same column.
    Output: Mosaic image saved inside output_folder.
    """
    if axis==0:
        # Open the left and right TIFF files
        with rio.open(left_or_top) as lot_tif, rio.open(right_or_bottom) as rob_tif:
            # Calculate the overlap start and end based on the bounding boxes
            lot_left, lot_bottom, lot_right, lot_top = lot_tif.bounds
            rob_left, rob_bottom, rob_right, rob_top = rob_tif.bounds
            pixel_width = lot_tif.res[0]
            overlap_start = max(lot_left, rob_left)
            overlap_end = min(lot_right, rob_right)

            if overlap_start >= overlap_end:
                raise ValueError("The TIFF files do not overlap.")

            # Read the half of the overlapping area from the left TIFF
            lot_window = rio.windows.from_bounds(overlap_start, lot_bottom, overlap_start+(overlap_end-overlap_start)/2, lot_top, lot_tif.transform)
            lot_data = lot_tif.read(window=lot_window)

            # Read the half of the overlapping area from the right TIFF
            rob_window = rio.windows.from_bounds(overlap_start+(overlap_end-overlap_start)/2, rob_bottom, overlap_end, rob_top, rob_tif.transform)
            rob_data = rob_tif.read(window=rob_window)

            # Read the non-overlapping area from the left and right TIFFs
            lot_non_overlap_window = rio.windows.from_bounds(lot_left, lot_bottom, overlap_start, lot_top, lot_tif.transform)
            lot_non_overlap = lot_tif.read(window=lot_non_overlap_window)
            rob_non_overlap_window = rio.windows.from_bounds(overlap_end, rob_bottom, rob_right, rob_top, rob_tif.transform)
            rob_non_overlap = rob_tif.read(window=rob_non_overlap_window)

            # Calculate the width of the new TIFF file
            #new_width = lot_tif.width + rob_tif.width - lot_data.shape[2] - rob_data.shape[2]
            new_width = (rob_right-lot_left)/pixel_width

            # Create the new TIFF file with the concatenated data
            new_profile = lot_tif.profile
            new_profile.update(width=new_width, transform=rio.transform.from_bounds(lot_left, lot_bottom, rob_right, lot_top, new_width, lot_tif.height))
            new_data = np.concatenate((lot_non_overlap, lot_data, rob_data, rob_non_overlap), axis=2)
        with rio.open(os.path.join(output_folder, "mosaic_row-" + str(counter) + ".tif"), 'w', **new_profile) as new_tif:
            new_tif.write(new_data)
    else:
        # Open the top and bottom TIFF files
        with rio.open(left_or_top) as lot_tif, rio.open(right_or_bottom) as rob_tif:
            # Calculate the overlap start and end based on the bounding boxes
            lot_left, lot_bottom, lot_right, lot_top = lot_tif.bounds
            rob_left, rob_bottom, rob_right, rob_top = rob_tif.bounds
            pixel_height = lot_tif.res[1]
            overlap_start = max(lot_bottom, rob_bottom)
            overlap_end = min(lot_top, rob_top)

            if overlap_start >= overlap_end:
                raise ValueError("The TIFF files do not overlap.")

            # Read the half of the overlapping area from the top TIFF
            lot_window = rio.windows.from_bounds(lot_left, overlap_start+(overlap_end-overlap_start)/2, lot_right, overlap_end, lot_tif.transform)
            lot_data = lot_tif.read(window=lot_window)

            # Read the half of the overlapping area from the bottom TIFF
            rob_window = rio.windows.from_bounds(rob_left, overlap_start, rob_right, overlap_start+(overlap_end-overlap_start)/2, rob_tif.transform)
            rob_data = rob_tif.read(window=rob_window)

            # Read the non-overlapping area from the top and bottom TIFFs
            lot_non_overlap_window = rio.windows.from_bounds(lot_left, overlap_end, lot_right, lot_top, lot_tif.transform)
            lot_non_overlap = lot_tif.read(window=lot_non_overlap_window)
            rob_non_overlap_window = rio.windows.from_bounds(rob_left, rob_bottom, rob_right, overlap_start, rob_tif.transform)
            rob_non_overlap = rob_tif.read(window=rob_non_overlap_window)

            # Calculate the height of the new TIFF file
            #new_height = rob_tif.height + lot_tif.height - rob_data.shape[1] - lot_data.shape[1]
            new_height = (lot_top-rob_bottom)/pixel_height

            # Create the new TIFF file with the concatenated data
            new_profile = rob_tif.profile
            new_profile.update(height=new_height, transform=rio.transform.from_bounds(rob_left, rob_bottom, rob_right, lot_top, rob_tif.width, new_height))
            new_data = np.concatenate((lot_non_overlap, lot_data, rob_data, rob_non_overlap), axis=1)
        with rio.open(os.path.join(output_folder, "mosaic_column-" + str(counter) + ".tif"), 'w', **new_profile) as new_tif:
            new_tif.write(new_data)
```