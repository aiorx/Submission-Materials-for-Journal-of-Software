```python
def latex_table_certified_accuracy(outfile: str, radius_start: float, radius_stop: float, radius_step: float,
                                   methods: List[Line]):
    radii = np.arange(radius_start, radius_stop + radius_step, radius_step)
    accuracies = np.zeros((len(methods), len(radii)))
    for i, method in enumerate(methods):
        accuracies[i, :] = method.quantity.at_radii(radii)

    f = open(outfile, 'w')

    for radius in radii:
        f.write("& $r = {:.3}$".format(radius))
    f.write("\\\\\n")

    f.write("\midrule\n")

    for i, method in enumerate(methods):
        f.write(method.legend)
        for j, radius in enumerate(radii):
            if i == accuracies[:, j].argmax():
                txt = r" & \textbf{" + "{:.3f}".format(accuracies[i, j]) + "}"
            else:
                txt = " & {:.3f}".format(accuracies[i, j])
            f.write(txt)
        f.write("\\\\\n")

    f.close()
```