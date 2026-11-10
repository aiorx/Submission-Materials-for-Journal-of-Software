# CREDIT: Written with routine coding tools-4
import string

class EnigmaMachine:
    def __init__(self, rotor_settings):
        self.alphabet = string.ascii_uppercase
        self.rotors = [list(self.alphabet) for _ in range(3)]  # Create 3 rotors
        self.reflector = list(self.alphabet)  # Create reflector
        
        # Initialize rotors based on the given rotor settings
        for i, setting in enumerate(rotor_settings):
            self.rotate_rotor(i, setting)

    def rotate_rotor(self, rotor_index, positions):
        # Rotate the specified rotor by the given number of positions
        self.rotors[rotor_index] = self.rotors[rotor_index][positions:] + self.rotors[rotor_index][:positions]

    def encode_character(self, char):
        # For simplicity, this method only encodes a character (not full encoding process)
        index = self.alphabet.index(char)
        
        # Pass through rotors
        for rotor in self.rotors:
            index = self.alphabet.index(rotor[index])
        
        # Pass through reflector
        reflected = self.reflector[index]
        
        # Inverse pass through rotors
        # for rotor in reversed(self.rotors):
        #     index = rotor.index(reflected)
        #     reflected = self.alphabet[index]
        
        return reflected

    def encode_message(self, message):
        encoded = ''
        for char in message:
            if char.upper() in self.alphabet:
                # Rotate the first rotor by 1 for each character
                self.rotate_rotor(0, 1)
                encoded += self.encode_character(char.upper())
            else:
                encoded += char  # For non-alphabetic characters, we keep the original
        
        return encoded

# Using the enigma machine to encode a message
rotor_settings = [0, 0, 0]  # Starting positions for the rotors
enigma = EnigmaMachine(rotor_settings)

original_message = "HELLO"
encoded_message = enigma.encode_message(original_message)

print(f"Original: {original_message}")
print(f"Encoded: {encoded_message}")
