# TurboWarp Packager (asset files -> .sb3 files)
# Produced using common development resources, edited and fixed by me {TuBeo5866 if u dont know}
# Sorry for having wrong language. plzz

import json
import os
import zipfile

# Path to execute (YOU MUST CHANGE IT!)
# Notes: 
# - The 'project.json' must not be inside the folder where assets are
# - The .sb3 output file must not be inside assets folder

project_json_path = "C:/Users/TuBeo5866/Desktop/project.json"
assets_folder_path = "C:/Users/TuBeo5866/Desktop/assets"
output_sb3_path = "C:/Users/TuBeo5866/Desktop/project.sb3"

# Create a SB3 file by converting it into zip first
with zipfile.ZipFile(output_sb3_path, "w") as sb3:
    # Add project.json
    sb3.write(project_json_path, "project.json")
    # Add assets
    for asset in os.listdir(assets_folder_path):
        asset_path = os.path.join(assets_folder_path, asset)
        sb3.write(asset_path, os.path.basename(asset))
