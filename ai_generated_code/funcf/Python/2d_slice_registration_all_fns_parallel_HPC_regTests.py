```python
def run_cascading_coregistrations(output_dir, subject, all_image_fnames, anchor_slice_idx = None,
                                  missing_idxs_to_fill = None, zfill_num=4, input_source_file_tag='coreg0nl', 
                                  reg_level_tag='coreg1nl', previous_target_tag=None):
    """
    Aided using common development resources TODO:edit this
    Perform a cascading registration of a stack of histology slices to build a consistent 3D volume by sequentially registering 
    each slice to adjacent slices. This process involves a combination of rigid and nonlinear (SyN) transformations to iteratively 
    align slices from a central slice outward.

    Parameters:
    -----------
    output_dir : str
        Directory to save registered output files.

    subject : str
        Subject identifier to include in the output filenames.

    all_image_fnames : list of str
        List of file paths to the original stack of 2D image slices to be registered.

    anchor_slice_idx : int, optional
        Index of the central slice to initiate registration. If None, defaults to the middle slice of the stack.

    missing_idxs_to_fill : list of int, optional
        List of slice indices that are missing from the stack, to avoid using this as the anchor slice.

    zfill_num : int, default=4
        Number of zeroes for zero-padding slice indices in the output filenames (e.g., 0001, 0002).

    input_source_file_tag : str, default='coreg0nl'
        Tag representing the initial registration step, used to identify input files.

    reg_level_tag : str, default='coreg1nl'
        Tag representing the current registration level, used to label output files.

    previous_target_tag : str, optional
        Optional tag to specify a previously registered target for the initial alignment. If None, defaults to `input_source_file_tag`.

    Workflow:
    ---------
    1. Identify the central slice in the stack to start registration.
    2. Initialize output filenames based on `output_dir`, `subject`, and `reg_level_tag`.
    3. Save the central slice to the output file without changes to serve as the initial target.
    4. Define indices to register slices in both directions from the central slice:
       - `rw_idxs` for rightward (increasing index) registration.
       - `lw_idxs` for leftward (decreasing index) registration.
    5. Use a cascading registration approach, sequentially aligning each slice with its neighbor:
       - For each slice, perform a rigid alignment followed by nonlinear (SyN) transformation to refine alignment.
       - Write the registered slice to `all_image_fnames_new` so it can serve as the target for the next slice.
    
    Returns:
    --------
    None
        The function saves registered slices as new `.nii.gz` files in `output_dir`.

    Example:
    --------
    run_cascading_coregistrations(output_dir='/path/to/output/', subject='subject01', 
                                  all_image_fnames=['/path/to/slice1.nii.gz', '/path/to/slice2.nii.gz', ...])

    Notes:
    ------
    This method is particularly useful for stacks with alignment inconsistencies, where anchoring to a central slice 
    and cascading outwards can help mitigate blocky artifacts. Adjust the transformation types and parameters within 
    the `ants.registration` calls as necessary for optimal alignment.

    """
    # params for regularization of nonlinear deformations w/ 'SyNOnly'
        # from nighres, the last two numbers of the syn_param correspond to the flow and total sigmas (fluid and elastic deformations, respectively)
        # if regularization == 'Low': syn_param = [0.2, 1.0, 0.0]
        # elif regularization == 'Medium': syn_param = [0.2, 3.0, 0.0]
        # elif regularization == 'High': syn_param = [0.2, 4.0, 3.0]
    syn_flow_sigma = 3 #3 is the default w/ this ants.registration call
    syn_total_sigma = 1 #0 is the default w/ this ants.registration call

    import ants

    if previous_target_tag is not None:
        previous_tail = f'_{previous_target_tag}_ants-def0.nii.gz' #if we want to use the previous iteration rather than building from scratch every time (useful for windowing)
    else:
        previous_tail = f'_{input_source_file_tag}_ants-def0.nii.gz'

    #identify a central slice to start our registration from, rather than anchoring @ the end
    #but we make sure that it is not a missing slice
    
    if anchor_slice_idx is None:
        anchor_slice_idx = int(numpy.floor(len(all_image_fnames)/2))
    if missing_idxs_to_fill is not None:
        while anchor_slice_idx in missing_idxs_to_fill:
            anchor_slice_idx -= 1
            if anchor_slice_idx < 0:
                raise ValueError("No valid start slice index found in the stack.")
    
    # list of what our outputs will be 
    all_image_fnames_new = []
    for idx in numpy.arange(len(all_image_fnames)):
        img_basename = os.path.basename(all_image_fnames[idx]).split('.')[0]
        all_image_fnames_new.append(f"{output_dir}{subject}_{str(idx).zfill(zfill_num)}_{img_basename}_{reg_level_tag}_ants-def0.nii.gz")

    #list of what our .nii inputs should be
    all_image_fnames_nii = []
    for idx in numpy.arange(len(all_image_fnames)):
        img_basename = os.path.basename(all_image_fnames[idx]).split('.')[0]
        all_image_fnames_nii.append(f"{output_dir}{subject}_{str(idx).zfill(zfill_num)}_{img_basename}{previous_tail}")

    #load and then save the central slice with the new tag, no change since this is the space we want to align to
    save_volume(all_image_fnames_new[anchor_slice_idx],load_volume(all_image_fnames_nii[anchor_slice_idx]))

    #define leftware and rightward indices, then split to source and targets so that we register 4<-5, 5<-6, ... and 3->4, 2->3, ... 
    rw_idxs = numpy.arange(anchor_slice_idx,len(all_image_fnames_nii))
    lw_idxs = numpy.arange(anchor_slice_idx,-1,-1)

    # this is setup to register adjacent slices to that central slice, then cascade the registrations to the left and right
    rw_src_idxs = rw_idxs[1:]
    rw_trg_idxs = rw_idxs[:-1]
    lw_src_idxs = lw_idxs[1:]
    lw_trg_idxs = lw_idxs[:-1]

    src_idxs = numpy.concatenate((rw_src_idxs,lw_src_idxs))
    trg_idxs = numpy.concatenate((rw_trg_idxs,lw_trg_idxs))


    #run the registrations
    for idx, _  in enumerate(src_idxs):
        # img_basename = os.path.basename(all_image_fnames[idx]).split('.')[0]
        target_idx = trg_idxs[idx]
        moving_idx = src_idxs[idx]

        # in each case, only one source and one target, but we use the same code as above
        source = all_image_fnames_nii[moving_idx]
        target = all_image_fnames_new[target_idx] #targets always come from the new list, since this is where the registrered sources will be (and we pre-filled the start_slice_idx image)
        output = all_image_fnames_new[moving_idx]

        source_img = ants.image_read(source)
        target_img = ants.image_read(target)
        logging.info(f'\n\tslice_idx: {src_idxs[idx]}\n\t\tsources: {source.split("/")[-1]}\n\t\ttarget: {target.split("/")[-1]}\n\t\toutput: {output.split("/")[-1]}') #source is always the same 

        pre_to_post_rigid = ants.registration(fixed=target_img, moving=source_img, type_of_transform='Rigid') #run rigid
        pre_aligned = ants.apply_transforms(fixed=target_img, moving=source_img, transformlist=pre_to_post_rigid['fwdtransforms']) #apply rigid
        pre_to_post_nonlin = ants.registration(fixed=target_img, moving=pre_aligned, 
                                               type_of_transform='SyNOnly') #),
                                            #    flow_sigma=syn_flow_sigma,
                                            #    total_sigma=syn_total_sigma) # run nonlin only
        warpedmovout = pre_to_post_nonlin['warpedmovout']

        ants.image_write(warpedmovout, output)
        logging.warning(f"\t\tCascade registration completed for slice {src_idxs[idx]}.")
```