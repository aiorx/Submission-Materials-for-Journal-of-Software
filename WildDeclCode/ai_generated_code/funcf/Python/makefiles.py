```python
def find_filled_bins(self, hist):
    # Get the number of bins along X and Y axes
    n_bins_x = hist.GetNbinsX()
    n_bins_y = hist.GetNbinsY()

    masspoints = []

    # Iterate over the bins
    for i in range(1, n_bins_x + 1):
        for j in range(1, n_bins_y + 1):
            # Check the bin content
            bin_content = hist.GetBinContent(i, j)
            if bin_content != 0.0:
                bin_center_x = hist.GetXaxis().GetBinCenter(i)
                bin_center_y = hist.GetYaxis().GetBinCenter(j)
                # print(f"Bin ({i}, {j}) with label ({bin_center_x:.2f}, {bin_center_y:.2f}) is filled with content: {bin_content}")
                masspoints.append((bin_center_x, bin_center_y))
    return masspoints
```