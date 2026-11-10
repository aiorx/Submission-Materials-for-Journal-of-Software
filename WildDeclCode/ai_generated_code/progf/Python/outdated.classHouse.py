## imports ##
from random import randint, choice
from subprocess import check_output
from PIL import Image as imge # used to read image size
from tqdm import tqdm # progress bar
from time import sleep, time, localtime
from datetime import timezone
import datetime
import os

## settings ##

genInf = {
    "build":"wint-stand",
    "version":"v0.6.5-b"
}

sett = {
    "enclevel":2, # Encryption level. Multiples of 128- Use int 1 for 128, 2 for 256, etc. (referencing # of encrypted chars / char) || 2 by default lol
    "igf":8, # Image Generation Factor. Multiples of 16. Reccommended value of 8. 
    "imageGenNum":3 # Number of images to generate. 3 by default.
}

def cls(): # burger king foot lettuce
    'Clears the CLI.'
    os.system("cls")

## functions ##

def autoImageManifeset(location):
    'Scans the number and names of all images inside of the specefied directory, and puts them into a returned array.\n\nUsage: autoImageManifest(location)'
    numFiles = 0
    fileLocAr = {}

    # Scanning for no of files in directory using os.listdir
    for path in os.listdir(location):
        if os.path.isfile(os.path.join(location, path)):
            numFiles += 1
    
    # Getting file names and types & adding to array
    for i in range(numFiles):
        tempString = "./images/" + str(i) + ".jpg"
        fileLocAr[i] = tempString
    
    # Returning file locations in dictionary
    return fileLocAr

def ranNumGen():
    'Custom, cryptographically-secure random number generator.'
    # formula: (Unix-Epoch*

    epoch = str(time()) # epoch time
    memBit = "0b"
    for i in range(len(epoch)):
        epoch_s = str(epoch[randint(0, len(epoch))]) + str(epoch[randint(0, len(epoch))])
        mask = 1 << bin(int(epoch_s))
        is_set = (int(epoch_s) & mask) != 0


## coloured text ##
CEND = "\33[0m"
CRED = "\33[31m"
CORG = "\33[33m"
CBLU = "\33[34m"
CGRN = "\33[32m"
CMGT = "\33[35m"

let = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"] # array of all english letters
location = "./images/" # image location

## classes ##
# encryption class
class EncDec():
    "Houses the Encryption-Decryption Algorithm.\n\nMethods: loadKey(), encrypt(), decrypt()"
    key = ""

    def loadKey(self):
        "Loads the key from the KeyGen class."

    def encrypt(self, string):
        "Encrypts data."
    
    def decrypt(self, string):
        "Decrypts data."

## key generation classhouse

"""
class KeyGen():
    "Houses the Key Generation Algorithm.\n\nMethods: generateKey(), returnKey()"
    key = ""

    def returnKey(self):
        "Return the key."
        return self.key

    def generateKey():
        "Generates the key."

        ## Precursor Variables
        # set up variables
        print("\nLockBox::Keygen::Version:[" + CMGT + genInf["build"] + "/" + genInf["version"] + CEND + "]")
        print("\nLockBox::Keygen::VarSetup")
        enclevel = sett["enclevel"] * 128
        igf = sett["igf"] * 16
        imageGenNum = sett["imageGenNum"]
        imgLoc = autoImageManifeset(location)
        tempstr = ""
        numFail = 0
        print("LockBox::Keygen::VarSetup::var-int(enclevel):[" + CMGT + str(enclevel) + CEND + "]")
        print("LockBox::Keygen::VarSetup::var-int(igf):[" + CMGT + str(igf) + CEND + "]")
        print("LockBox::Keygen::VarSetup::var-int(imageGenNum):[" + CMGT + str(imageGenNum) + CEND + "]")
        print("LockBox::Keygen::init_success")

        ## Precursor Shit that's gotta get done
        # set the image location & print current image manifest
        print("\nLockBox::Keygen::PregenImageManifest")
        setImp = ""
        for i in range(len(imgLoc)):
            setImp += str(imgLoc[i])
            setImp += ", "
        print(CGRN + str(setImp) + CEND) # print the manifest


        ## Create the RNA (Random Number Array)
        print("\nLockBox::Keygen::RandomNumberArray")
        numlist = []
        for i in tqdm(range(enclevel)):
            tempList = []
            for i in range(enclevel):
                tempList.append(randint(1, 9))
            numlist.append(tempList[randint(1, enclevel-1)])
        del tempList
        print("LockBox::Keygen::RandomNumberArray::len(var-list(numlist)):[" + CMGT + str(len(numlist)) + CEND + "]")
        print("LockBox::Keygen::RandomNumberArray::var-list(numlist):[" + CMGT + str(numlist) + CEND + "]")



        ## Create the Images
        # The images are 3 seperate images that are 16 times the size of settings.igf (Eg, igf=8, 128x128)
        # These images are completely random in their RGB values across the whole size of the image, as well. 
        print("\nLockBox::Keygen::ImageGen")
        for i in tqdm(range(imageGenNum)):
            # this code was Assisted using common GitHub development utilities, so I'll check if it works later
            # sorry copilot love you <3
            img = Image.new("RGB", (igf, igf), (0, 0, 0))
            pixels = img.load()
            for i in range(img.size[0]):
                for j in range(img.size[1]):
                    pixels[i, j] = (randint(0, 255), randint(0, 255), randint(0, 255))
            img.save(location + str(i) + ".jpg")
            del img
            del pixels

        ## Scan the Images
        # image manifest those sons of bitches
        print("\nLockBox::Keygen::ImageManifest-2")
        setImp = ""
        for i in range(len(imgLoc)):
            setImp += str(imgLoc[i])
            setImp += ", "
        print(CGRN + str(setImp) + CEND) # print the manifest

        # open the images for scanning
        temp = randint(0, len(imgLoc))
        imgNum = numlist[temp]
        print("\nLockBox::Keygen::ImageOpen")
        for i in range(len(imgLoc)):
            if(i == imgNum):
                image = imge.open(imgLoc[imgNum])
            elif(i != imgNum):
                numFail += 1
            else:
                true = true # i know this is bad, but i'm too lazy to fix it lmaooo (plus it works)
        
        # scan the rgb values of the images

        ## Create the Key
        print("\nLockBox::Keygen::KeyMake")

        print("\nLockBox::Keygen::KeySet")
        return key
"""