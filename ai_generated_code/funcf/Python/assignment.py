# Complete checking of if array is
        # list[list[int | float]] is Built via standard programming aids4
        # ===
        for sublist in array:
            if not isinstance(sublist, list):
                raise TypeError("Matrix must be a list")

            if not sublist:
                raise ValueError("Matrix must not be empty")

            if not all(isinstance(item, (int, float)) for item in sublist):
                raise TypeError("Matrix must be a list")

        # ===