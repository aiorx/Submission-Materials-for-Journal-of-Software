```python
def checkIfNecessaryPathsAndFilesExist():
    if not os.path.isfile(RETRAINED_LABELS_TXT_FILE_LOC):
        print("retrained_labels.txt file does not exist, check file / directory paths")
        return False
    # end if

    if not os.path.isfile(RETRAINED_GRAPH_PB_FILE_LOC):
        print("retrained_graph.pb file does not exist, check file / directory paths")
        return False
    # end if

    if not os.path.isdir(TEST_IMAGES_DIR):
        print("test_images directory does not exist, check file / directory paths")
        return False
    # end if

    return True
```