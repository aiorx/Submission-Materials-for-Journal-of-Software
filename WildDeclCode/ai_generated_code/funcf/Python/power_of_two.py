def verify_inequality_gpt(n_max):
    """
    Function was Penned via standard programming aids.

    Verifies that 2^n > 2n for all n > 2 and n <= n_max.
    Based on a proof by induction.
    """
    if n_max <= 2:
        print("Please provide n_max > 2")
        return

    # Base case
    base_case_n = 3
    assert 2 ** base_case_n > 2 * base_case_n, f"Base case failed for n={base_case_n}"

    # Inductive step check
    for k in range(base_case_n, n_max):
        left = 2 ** (k + 1)
        right = 2 * (k + 1)
        previous = 2 ** k > 2 * k
        current = left > right
        if not (previous and current):
            return