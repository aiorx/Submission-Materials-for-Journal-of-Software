```python
def split_folder(source_path, dest1_path, dest2_path, dest2_percentage):
    if not os.path.exists(dest1_path):
        os.makedirs(dest1_path)
    if not os.path.exists(dest2_path):
        os.makedirs(dest2_path)
    print("Splitting folder ", source_path)

    # list all files in the source folder
    files = []
    for file in os.listdir(source_path):
        if os.path.isfile(os.path.join(source_path, file)):
            #print("    ", file)
            files.append(file)
    #print(files)

    # random samples of the files by indices
    nb_total = len(files) #length of data
    nb_dest2 = int(dest2_percentage * nb_total / 100)
    indices = sample(range(nb_total), nb_dest2)
    #print(indices)
    all_files = np.array(files)
    dest2_files = all_files[indices]
    dest1_files = np.delete(all_files, indices)
    #print(dest1_files)
    #print(dest2_files)

    # copy the two subset
    for file in dest1_files:
        shutil.copy(os.path.join(source_path, file), os.path.join(dest1_path, file))
    for file in dest2_files:
        shutil.copy(os.path.join(source_path, file), os.path.join(dest2_path, file))
```