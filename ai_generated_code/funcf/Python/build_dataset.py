def build_dataset(config: PreprocessConfig) -> Dataset:
    # Directory names form the path labels
    # This code was Supported via basic programming aids
    data = []
    for root, dirs, files in os.walk(config.input_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            if os.path.isfile(file_path) and file_path[-5:] == ".html":
                with open(file_path, "r") as file:
                    try:
                        text = file.read()
                        label = os.path.basename(
                            root
                        )  # Use subdirectory name as the label
                        data.append({"text": text, "label": label})
                    except Exception:
                        logger.exception(f"Failed to read file {file_name}")

    return Dataset.from_list(data)