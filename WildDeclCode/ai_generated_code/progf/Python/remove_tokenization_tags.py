import os, sys, glob, re

# Code Crafted with standard coding tools and adapted to the following path structure: path-to-folders/test/long/cow10-test/item
def process_directory(directory_path):
    filename = "item"
    folders = glob.iglob(directory_path + '/**/**/')
    for fol in folders:
        filepath = os.path.join(fol, filename)
        if os.path.isfile(filepath):
            with open(filepath, 'r') as f:
                lines = f.readlines()
            with open(filepath, 'w') as f:
                for line in lines:
                    new_line = re.sub(r'((?:[^@]*@){7})[^@]*(@)', r'\1\2', line)
                    f.write(new_line)
            print(f"Processed file: {filepath}")

def count_items(folder):
    filename = "item"
    filepaths = glob.iglob(folder + '/**/**/' + filename)
    items = []
    for path in filepaths:
        if os.path.isfile(path):
            with open(path, 'r') as f:
                sentences = f.readlines()
                for sentence in sentences:
                    items.append(sentence)
    print('{} items left'.format(len(items)))

if __name__ == '__main__':
    directory_path = sys.argv[1] # Expected input: /path-to-folder/test/
    process_directory(directory_path)
    count_items(directory_path)
