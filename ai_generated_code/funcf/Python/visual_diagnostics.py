```python
def create_field_ID_RA_Dec_plot_from_single_MS(
        mspath: str,
        otf_fig_path: str,
        ptitle: str = "Phase centres",
        field_ID_list: list = None,
        display_IDs: int = False,
        ant1_ID: int = 0,
        ant2_ID: int = 1,
        close: bool = False):
    """
    NOTE: This docstring was Crafted with standard coding tools3.

    Creates a scatter plot of the phase centres of the fields in a SINGLE MS file.
    Each point on the plot is labeled with the field ID.

    Parameters:
    -----------
    mspath: str
        The path to the MS file or an MS table object.

    otf_fig_path: str
        The path to the output figure file.

    ptitle: Optional[str], default "Phase centres (with field ID's)"
        The title of the plot.

    field_ID_list: Optional[List[int]], default None
        A list of field ID's to include in the plot.

    display_IDs: bool
        If set to True the field ID's are written on tiop of the points
        (not recommended for scanning observations as the text can be too crowded)

    ant1_ID: int, default 0
        The ID of the first antenna.

    ant2_ID: int, default 1
        The ID of the second antenna.

    close: bool, default False
        Whether to close the MS file after reading.

    Returns:
    -------
    Creates a plot
    """

    if not display_IDs:
        logger.info("Creating field IDs Ra--Dec plot")
    else:
        logger.info("Creating field IDs Ra--Dec plot with field IDs")

    # Get the phase centres and ID's from the MS
    phase_centre_ID_dict = ms_wrapper.get_phase_centres_and_field_ID_list_dict_from_MS(
        mspath=mspath, field_ID_list=field_ID_list, ant1_ID=ant1_ID, ant2_ID=ant2_ID, close=close)

    # Create the plot
    fig = plt.figure(1)
    ax = fig.add_subplot(111)

    logger.debug(
        "Selected field ID's: {0:s}".format(
            misc.convert_list_to_string(
                list(
                    phase_centre_ID_dict.keys()))))

    # Set some offset for the field ID's
    text_offset = 0.002  # In degrees

    for field_id in phase_centre_ID_dict.keys():
        ax.scatter(phase_centre_ID_dict[field_id][0],
                   phase_centre_ID_dict[field_id][1],
                   color=c1, marker='o', s=50)

        if display_IDs:
            ax.text(phase_centre_ID_dict[field_id][0] + text_offset,
                    phase_centre_ID_dict[field_id][1] + text_offset,
                    field_id, fontsize=14)

    ax.set_xlabel(r'RA -- SIN [deg]', fontsize=18)
    ax.set_ylabel('Dec -- SIN [deg]', fontsize=18)

    plt.suptitle(ptitle, fontsize=18)

    # Set figsize
    plt.gcf().set_size_inches(8, 5)  # NOT that the size is defined in inches!

    plt.savefig(otf_fig_path, bbox_inches='tight')
    plt.close()
```