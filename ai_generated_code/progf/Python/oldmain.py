# lore Designed via basic programming aids ( openai )
print("Welcome to the Eldritch Estate!")
print("Legend says that this mansion is built atop the ancient ruins of Aetherius, a city with deep magical roots.")
print("As the last descendant of the Aetherian lineage, the mansion and its secrets now belong to you.")
print("The air is thick with ancient magic, and the shadows seem to whisper. You step through the ancient doors.")
print("Do you wish to explore the grand library to your left or the mysterious atrium straight ahead?")

def handle_inventory(item=None, action="check"):
    inventory = []
    if action == "add" and item:
        inventory.append(item)
        print(f"{item} added to your inventory.")
    elif action == "check":
        if inventory:
            print("You have the following items in your inventory:", inventory)
        else:
            print("Your inventory is empty.")
    return inventory

def grand_library():
    print("The grand library is filled with ancient books and artifacts. A strange glow catches your eye.")
    print("Do you investigate the glow, or search for a book on Aetherius?")

    choice = input("> ").lower()

    if choice == "investigate glow":
        print("You approach the glow and find a magical orb. It pulsates with energy.")
        handle_inventory("Magical Orb", "add")
        print("Suddenly, the room shifts, revealing a hidden passage.")
        hidden_passage()
    elif choice == "search for book":
        print("You find a dusty tome titled 'The Secrets of Aetherius'. It speaks of a hidden power beneath the estate.")
        handle_inventory("Ancient Tome", "add")
        print("As you read, a section of the bookshelf slides open, revealing a secret room.")
        secret_room()
    else:
        print("Invalid choice. Please choose to 'investigate glow' or 'search for book'.")

def mysterious_atrium():
    print("The atrium is overgrown with strange plants. In the center lies a sealed stone door with ancient runes.")
    print("Do you attempt to read the runes or explore the plants?")

    choice = input("> ").lower()

    if choice == "read runes":
        print("The runes speak of a key hidden within the estate, necessary to unlock the door.")
        print("You feel compelled to find this key.")
        explore_for_key()
    elif choice == "explore plants":
        print("Among the plants, you find a potion of health and a note hinting at a key's location.")
        handle_inventory("Potion of Health", "add")
        explore_for_key()
    else:
        print("Invalid choice. Please choose to 'read runes' or 'explore plants'.")

def hidden_passage():
    print("The passage leads to an ancient chamber, with a pedestal in the center. A key lies atop it.")
    print("Do you take the key?")
    choice = input("> ").lower()
    if choice == "yes":
        handle_inventory("Ancient Key", "add")
        print("As you take the key, the chamber begins to rumble. You run back to the atrium.")
        mysterious_atrium()
    else:
        print("You leave the key and return to the library. The passage closes behind you.")
        grand_library()

def secret_room():
    print("The room is filled with magical artifacts. Among them, a crystal that shines with an inner light.")
    print("Do you take the crystal?")
    choice = input("> ").lower()
    if choice == "yes":
        handle_inventory("Crystal of Power", "add")
        print("With the crystal in hand, you feel a surge of power. You decide to explore the mansion further.")
    else:
        print("You leave the crystal and exit the room, feeling a sense of missed opportunity.")

def explore_for_key():
    print("Armed with knowledge and items from your exploration, you begin to search the mansion for the key.")
    print("Eventually, you find it hidden beneath an ancient statue. The atrium awaits.")
    handle_inventory("Secret Key", "add")
    mysterious_atrium()

room_choice = input("> ").lower()

if room_choice == "grand library":
    grand_library()
elif room_choice == "mysterious atrium":
    mysterious_atrium()
else:
    print("Invalid choice. Please enter 'grand library' or 'mysterious atrium'.")