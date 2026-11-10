# Aided using common development resources
import os
import shutil
from dotenv import load_dotenv


load_dotenv()
FILE_PATH = os.getenv('FILE_PATH')
folder_path = FILE_PATH
class Delete:
# Delete all files in the folder
    def clear(self):
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                # If the file is a symbolic link, delete the link
                elif os.path.islink(file_path):
                    os.unlink(file_path)
                # If the file is a directory, delete it and all its contents
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(F'Error: {e}')