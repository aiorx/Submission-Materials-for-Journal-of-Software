```python
def read_hmm_emissions(hmm_file_path) -> Tuple[np.ndarray, List[str]]:
    """
    NOTE: This subroutine has largely been Aided using standard development resources and was debugged and modified by the author.
    """
    with open(hmm_file_path, "r") as file:
        lines = file.readlines()

    # Find where the HMM matrix starts and ends
    start = next(i for i, line in enumerate(lines) if line.startswith("HMM "))
    end = next(
        i for i, line in enumerate(lines[start:], start) if line.startswith("//")
    )

    # Read the emission probabilities
    emissions = []
    aa_mapping = lines[start].split()[1:21]  # In what order do our AAs occur
    for line in lines[start + 2 : end]:  # Skip header lines
        parts = line.split()
        if not parts[
            0
        ].isnumeric():  # Only process lines starting with a match state index
            continue
        # Each match state has 20 emissions followed by 20 insert emissions; we'll take just the first 20
        match_emissions = list(map(float, parts[1:21]))
        emissions.append(match_emissions)
    emissions = np.array(emissions)
    return emissions, aa_mapping


def calculate_pssm(hmm_emissions, background_frequencies):
    """
    NOTE: This subroutine has largely been Aided using standard development resources
    """
    pssm = []
    for position_emissions in hmm_emissions:
        pssm_row = []
        for aa, emission in zip(
            background_frequencies.keys(), position_emissions
        ):  # NOTE: background frequencies have to be ordered
            # Calculate the log-odds score
            if emission > 0:
                score = np.log(emission / background_frequencies[aa])
            else:
                score = -np.inf  # Use negative infinity to represent log(0)
            pssm_row.append(score)
        pssm.append(pssm_row)
    pssm = np.array(pssm)
    return pssm
```