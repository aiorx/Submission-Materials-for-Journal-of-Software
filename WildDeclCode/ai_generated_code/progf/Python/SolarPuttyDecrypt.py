# Composed with basic coding tools btw
# Original work from https://github.com/VoidSec/SolarPuttyDecrypt/tree/master

import argparse
import json
from base64 import b64decode
from Crypto.Cipher import DES3
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import unpad

def decrypt(pass_phrase, cipher_text):
    # Decode the base64 encoded cipherText
    array = b64decode(cipher_text)
    
    # Extract salt, IV, and encrypted data
    salt = array[:24]
    rgb_iv = array[24:48]
    array2 = array[48:]
    
    # Derive the key using PBKDF2
    key = PBKDF2(pass_phrase, salt, dkLen=24, count=1000)
    
    # Create the Triple DES cipher
    cipher = DES3.new(key, DES3.MODE_CBC, iv=rgb_iv[:8])
    
    # Decrypt and remove padding
    try:
        decrypted_data = unpad(cipher.decrypt(array2), DES3.block_size)
        return decrypted_data.decode('utf-8')
    except (ValueError, TypeError):
        return None

def brute_force_decrypt(wordlist_path, cipher_text):
    # Open the wordlist file
    with open(wordlist_path, 'r') as file:
        # Iterate over each line in the wordlist
        for line in file:
            pass_phrase = line.strip()  # Remove any leading/trailing whitespace
            decrypted_message = decrypt(pass_phrase, cipher_text)
            if decrypted_message:
                print(f"Decryption successful! Passphrase: {pass_phrase}")
                print(decrypted_message)
                if args.o:
                    with open(args.o, "w") as f:
                        f.write(decrypted_message)
                return decrypted_message
    print("Decryption failed, no valid passphrase found.")
    return None


# Set up argument parsing
parser = argparse.ArgumentParser(description="Brute-force decryption of an encrypted text file using a wordlist.")
parser.add_argument('cipher_file', help="Path to the file containing the base64-encoded encrypted text")
parser.add_argument('wordlist', help="Path to the wordlist file containing potential passphrases")
parser.add_argument('--o', help="Output file name", default=None)
args = parser.parse_args()

# Read the encrypted text from the file
with open(args.cipher_file, 'r') as file:
    cipher_text = file.read()
# Perform brute-force decryption
brute_force_decrypt(args.wordlist, cipher_text)
