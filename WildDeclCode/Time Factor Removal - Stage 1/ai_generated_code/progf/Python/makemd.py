# Drafted using common development resources because im lazy
import os

# Open the file in read mode
with open('./LICENSE', 'r') as f:
        # Read the contents of the file
        license = f.read()


# Open the file in write mode
with open('README.md', 'w') as f:
        # Write a string to the file
        f.write("# SchizoDev's AI image dump
Do whatever you wanna do 
### License
```{}```
## Images
".format(license))


# Set the directory you want to read from
directory = './images/'

# Use a for loop to read all the files in the directory
for filename in os.listdir(directory):
    if filename.endswith('.png'):  # Only read files with the .txt extension
            with open('README.md', 'a') as f:
                # Do something with the file
                f.write("![{}](./images/{})
".format(filename, filename))
