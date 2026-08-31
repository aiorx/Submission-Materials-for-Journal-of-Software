def parse_file(filename):
    """
    Function for parsing the output file from running a basin hopping optimization.
    Largely Penned via standard programming aids. Enter at your own risk.
    .
    :return: A list of paths, each representing one run of the local optimizer,
    and a list of flags saying whether the result of each path was accepted
    by the basin hopping algo.
    """
    sets = []
    accepted_flags = []

    current_set = []

    with open(filename, 'r') as file:
        previous_line = None
        for line in file:
            line = line.strip()
            if not line:
                continue

            if line.endswith('*') and not previous_line.endswith('*'):
                accepted = line[-5] == 'T'
                accepted_flags.append(accepted)

                if current_set:
                    sets.append(np.array(current_set, dtype=float).transpose())
                    current_set = []
            else:
                # Regular data point
                try:
                    x, y = map(float, line[1:-1].split())
                    current_set.append([x, y])
                except ValueError:
                    pass

            previous_line=line

    return sets, np.array(accepted_flags)