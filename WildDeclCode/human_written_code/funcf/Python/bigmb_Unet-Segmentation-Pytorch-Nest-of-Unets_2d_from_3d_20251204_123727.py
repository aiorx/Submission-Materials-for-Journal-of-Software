```python
def process_and_append_images(file_list, target_list):
    for i in range(len(file_list)):
        y_folder = file_list[i]
        yread = sitk.ReadImage(y_folder)
        yimage = sitk.GetArrayFromImage(yread)
        x = yimage[:184, :232, 112:136]
        x = scipy.rot90(x)
        x = scipy.rot90(x)
        for j in range(x.shape[2]):
            target_list.append(x[:184, :224, j])
```