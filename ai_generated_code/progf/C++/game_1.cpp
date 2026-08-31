// Created By: Clay Beal
// GVZork

#include "game.h"
#include <stdexcept>
#include <vector>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <string>

Game::Game() : currentLocation("Default Location", "Default Description"){
    commands = setupCommands();
    createWorld();
}


// Penned via standard programming aids to help clear all my allocated memory
Game::~Game() {
    // Delete all allocated Locations
    for (Location* loc : allocatedLocations) {
        delete loc;
    }
    allocatedLocations.clear();

    // Delete all allocated NPCs
    for (Npc* npc : allocatedNpcs) {
        delete npc;
    }
    allocatedNpcs.clear();

    // Delete all allocated Items
    for (Item* item : allocatedItems) {
        delete item;
    }
    allocatedItems.clear();
}


// Used ChatGPT to write this lowercase function
std::string toLower(const std::string& s) {
    std::string result = s;
    std::transform(result.begin(), result.end(), result.begin(),
                   [](unsigned char c){ return std::tolower(c); });
    return result;
}


// Used ChatGPT to help me generate this method, C++ should include a split function...
std::vector<std::string> tokenizeInput(const std::string& userInput) {
    // Define the delimiter
    char delimiter = ' ';
    std::vector<std::string> tokens;
    std::string token;
    // Creates a stream like cin so we can use the getline method
    std::istringstream tokenStream(userInput);

    // Use getline with the delimiter to extract tokens.
    while (std::getline(tokenStream, token, delimiter)) {
        // Only add non-empty tokens (in case of multiple spaces)
        if (!token.empty()) {
            tokens.push_back(toLower(token));
        }
    }
    return tokens;
}


void Game::createWorld() {
    // Create all the locations in the game
    Location* locationMac = new Location("Macinac", "CS Building");
    Location* locationManitou = new Location("Manitou", "Geology Building");
    Location* locationKirkhof = new Location("Kirkhof", "Student Center");
    Location* locationKindschi = new Location("Kindschi", "I think there's a brewing class in there");
    Location* locationRec = new Location("Recreation Center", "Smells like gym bros");
    Location* locationClockTower = new Location("Clock Tower", "DING-DONG");
    Location* locationLibrary = new Location("Library", "Lots of books...and desks");
    Location* locationWoods = new Location("Woods Behind Campus", "Lots of empty beer cans...");

    // Add to this vector to deallocate later
    allocatedLocations.push_back(locationMac);
    allocatedLocations.push_back(locationManitou);
    allocatedLocations.push_back(locationKirkhof);
    allocatedLocations.push_back(locationKindschi);
    allocatedLocations.push_back(locationRec);
    allocatedLocations.push_back(locationClockTower);
    allocatedLocations.push_back(locationLibrary);
    allocatedLocations.push_back(locationWoods);

    // Create all the NPCs
    // Kudos if you play the game !
    Npc* npcClay = new Npc("Clay", "Somehow making it through");
    Npc* npcSmeech = new Npc("Smeech", "Skinny legs, large headed...thing");
    Npc* npcSteb = new Npc("Steb", "That is a very marine looking man...fish...I give up");
    Npc* npcScar = new Npc("Scar", "I wonder what is hiding under the mask");
    Npc* npcTwitch = new Npc("Twitch", "Is that a rat with a crossbow? Seems friendly enough!");
    Npc* npcMord = new Npc("Mordekaiser", "Looks like a medieval knight, except 10 times as big");
    Npc* npcElise = new Npc("Elise", "She can shapesift into a spider, that's pretty cool I guess");
    Npc* npcPowder = new Npc("Powder", "A seemingly normal child among all the beasts");

    // To deallocate later
    allocatedNpcs.push_back(npcClay);
    allocatedNpcs.push_back(npcSmeech);
    allocatedNpcs.push_back(npcSteb);
    allocatedNpcs.push_back(npcScar);
    allocatedNpcs.push_back(npcTwitch);
    allocatedNpcs.push_back(npcMord);
    allocatedNpcs.push_back(npcElise);
    allocatedNpcs.push_back(npcPowder);

    // Add the voice lines to the characters
    npcClay->addMessage("I do most of my studying in Macinac, although I'm graduating very soon!");
    npcClay->addMessage("How I got here? I have no idea.");
    npcClay->addMessage("My advice to you is to find the secrets of this world.");

    npcSmeech->addMessage("I'm from the land of the forgotten, if you're lucky, you'll end up there too.");
    npcSmeech->addMessage("I AM NOT A RAT, I am a handsome rat.");
    npcSmeech->addMessage("I got this hat from a near and dear friend of mine, I killed him for it.");

    npcSteb->addMessage("I'm from the city below the sea, no, not Atlantis, thats 45 minutes north.");
    npcSteb->addMessage("Smeech? Don't listen to that guy, he's harmless, although he looks hideous.");
    npcSteb->addMessage("If you ask me, I'd get out of this town immediately.");

    npcScar->addMessage("I'm net telling you what's behind the mask.");
    npcScar->addMessage("Smeech? He's my cousin, he's my idiotic cousin...");
    npcScar->addMessage("Everyday is a struggle, although I keep pushing forward regardless.");

    npcTwitch->addMessage("Have you ever seen a rat with a crossbow? Didn't think so.");
    npcTwitch->addMessage("I've been known to be quite the sniper...");
    npcTwitch->addMessage("I got the lab coat from...Kindschi? It's a great loook.");

    npcMord->addMessage("Nobody in this world is insane enough to challenge me.");
    npcMord->addMessage("My father was the king, now it is I.");
    npcMord->addMessage("The armor doesn't actually come off. It is one with Mordekaiser.");

    npcElise->addMessage("Yes, I am a spider, you are not crazy.");
    npcElise->addMessage("Well, actually... We are all a little bit crazy.");
    npcElise->addMessage("I don't know much about you, but I'd be careful around here.");

    npcPowder->addMessage("I am the only one who looks semi-normal around here, you can trust me.");
    npcPowder->addMessage("If you want to survive bring me all the alcohol you can find.");
    npcPowder->addMessage("No it's not for me, it's for my...friend. You just have to trust me on this one.");


    // Create all the Items (Calorie Based Items)
    Item* itemAle = new Item("Ale", "Dark in color, a scotch ale perhaps", 100, 7.5);
    Item* itemWine = new Item("Wine", "A bottle of Snoop Dogg's Cali Red", 150, 5);
    Item* itemVodka = new Item("Vodka", "A shot of Kirkland vodka, doesn't get much worse that that", 50, 2.5);
    Item* itemBrandy = new Item("Brandy", "I've never had brandy, although it smells disgusting", 50, 5);
    Item* itemLager = new Item("Lager", "Doesn't ever single one of these taste the same?", 50, 7.5);
    Item* itemMead = new Item("Mead", "Where does one even buy mead?", 50, 5);
    Item* itemCocktail = new Item("Cocktail", "It has an umbrella in it, must be good...", 200, 7.5);

    // Non Calorie based items
    Item* itemOrb = new Item("Orb", "You've unlocked a secret!", 0, 10);
    Item* itemBat = new Item("Bat", "Man, I miss baseball.", 0, 10);
    Item* itemDumbell = new Item("Dumbell", "Pretty heavy, is Powder a weightlifter?", 0, 10);
    Item* itemRock = new Item("Rock", "This probably means something to a geologist", 0, 7.5);
    Item* itemMicroscope = new Item("Microscope", "Maybe there's somewhere this belongs?", 0, 7.5);
    Item* itemDna = new Item("DNA", "I wonder who's DNA Sample this is?", 0, 1);

    // To deallocate later
    allocatedItems.push_back(itemAle);
    allocatedItems.push_back(itemWine);
    allocatedItems.push_back(itemVodka);
    allocatedItems.push_back(itemBrandy);
    allocatedItems.push_back(itemLager);
    allocatedItems.push_back(itemMead);
    allocatedItems.push_back(itemCocktail);
    allocatedItems.push_back(itemOrb);
    allocatedItems.push_back(itemBat);
    allocatedItems.push_back(itemDumbell);
    allocatedItems.push_back(itemRock);
    allocatedItems.push_back(itemMicroscope);
    allocatedItems.push_back(itemDna);

    // Place the npcs and the items in the locations
    locationMac->addNpc(*npcClay);
    locationMac->addItem(*itemAle);
    locationMac->addItem(*itemBat);

    locationManitou->addNpc(*npcSmeech);
    locationManitou->addItem(*itemWine);
    locationManitou->addItem(*itemRock);

    locationKirkhof->addNpc(*npcSteb);
    locationKirkhof->addItem(*itemVodka);

    locationKindschi->addNpc(*npcScar);
    locationKindschi->addItem(*itemBrandy);

    locationRec->addNpc(*npcTwitch);
    locationRec->addItem(*itemLager);
    locationRec->addItem(*itemDumbell);

    locationClockTower->addNpc(*npcMord);
    locationClockTower->addItem(*itemMead);
    locationClockTower->addItem(*itemMicroscope);

    locationLibrary->addNpc(*npcElise);
    locationLibrary->addItem(*itemCocktail);
    locationLibrary->addItem(*itemDna);

    locationWoods->addNpc(*npcPowder);
    locationWoods->addItem(*itemOrb);

    // Add the locations relations to one another
    locationWoods->addLocation("west", std::ref(*locationMac));

    locationMac->addLocation("east", std::ref(*locationWoods));
    locationMac->addLocation("south", std::ref(*locationManitou));

    locationManitou->addLocation("north", std::ref(*locationMac));
    locationManitou->addLocation("west", std::ref(*locationKindschi));

    locationKindschi->addLocation("east", std::ref(*locationManitou));
    locationKindschi->addLocation("south", std::ref(*locationClockTower));
    locationKindschi->addLocation("west", std::ref(*locationRec));

    locationRec->addLocation("east", std::ref(*locationKindschi));

    locationClockTower->addLocation("north", std::ref(*locationKindschi));
    locationClockTower->addLocation("south", std::ref(*locationKirkhof));

    locationKirkhof->addLocation("north", std::ref(*locationClockTower));
    locationKirkhof->addLocation("west", std::ref(*locationLibrary));

    locationLibrary->addLocation("east", std::ref(*locationKirkhof));

    // Put all the locations on the location vec
    locations.push_back(*locationMac);
    locations.push_back(*locationManitou);
    locations.push_back(*locationKindschi);
    locations.push_back(*locationRec);
    locations.push_back(*locationClockTower);
    locations.push_back(*locationKirkhof);
    locations.push_back(*locationLibrary);
    locations.push_back(*locationWoods);
    
    this->currentLocation = randomLocation();
}


std::map<std::string, Command> Game::setupCommands() {
    std::map<std::string, Command> commands;

    commands["help"] = showHelp;
    commands["h"] = showHelp;

    // In order to set this up to work with non-static functions I have to define everything
    // a little differently to work with class instances (even as aliases)
    // This was written with assistance from ChatGPT 
    // This line essentially says that we will pass a target to an instance variable 
    // and call that function on them specifically 
    commands["talk"] = [this](std::vector<std::string> target) { this->talk(target); };
    commands["meet"] = [this](std::vector<std::string> target) { this->meet(target); };
    commands["take"] = [this](std::vector<std::string> target) { this->take(target); };
    commands["give"] = [this](std::vector<std::string> target) { this->give(target); };
    commands["go"] = [this](std::vector<std::string> target) { this->go(target); };
    commands["backpack"] = [this](std::vector<std::string> target) { this->showItems(target); };
    commands["items"] = [this](std::vector<std::string> target) { this->showItems(target); };
    commands["look"] = [this](std::vector<std::string> target) { this->look(target); };
    commands["where"] = [this](std::vector<std::string> target) { this->look(target); };
    commands["warp"] = [this](std::vector<std::string> target) { this->warp(target); };
    commands["study"] = [this](std::vector<std::string> target) { this->study(target); };
    commands["quit"] = [this](std::vector<std::string> target) { this->quit(target); };
    commands["q"] = [this](std::vector<std::string> target) { this->quit(target); };
    
    return commands;
}


void Game::showHelp(std::vector<std::string> target) {
    // Print out a pretty help screen
    std::cout << std::endl << "* - May require special condidtions to be met" << std::endl;
    std::string commandPattern = "You're input will be broken up into [Command][Object]";
    std::cout << commandPattern << std::endl << std::endl;

    std::cout << "Available Commands:" << std::endl;
    std::cout << "  talk        - Converse with the characters in any room." << std::endl;
    std::cout << "  meet        - Display a description of the type of ... creature." << std::endl;
    std::cout << "  take        - Place an item in your backpack to carry it around." << std::endl;
    std::cout << "  give        - Leave an item in a room ... or give to certain characters." << std::endl;
    std::cout << "  go          - Follow this with a direction to travel to new locations." << std::endl;
    std::cout << "  warp        - *Follow this with a location to warp directly there." << std::endl;
    
    std::cout << std::endl << "Stand Alone Commands:" << std::endl;
    std::cout << "  help (h)    - Display this directive." << std::endl;
    std::cout << "  quit (q)    - Exit the game." << std::endl;
    std::cout << "  backpack    - Displays the carried items." << std::endl;
    std::cout << "  items       - Alias for backpack." << std::endl;
    std::cout << "  look/where  - Get an idea of your surroundings." << std::endl;
    std::cout << "  study       - *Look at life through the lens to unlock the truth." << std::endl;
    std::cout << std::endl;
}


void Game::talk(std::vector<std::string> target) {
    // Display message if there are no objects
    if (target.empty()) {
        std::cout << "Talk to whom?" << std::endl;
        return;
    }
    
    std::string npcName = target[0];
    
    // Use the non-const accessor to get the actual NPCs so the message cycling works
    std::vector<Npc>& npcs = currentLocation.getNpcsRef();
    
    // Check to see if the NPC is in the area the player is in 
    bool found = false;
    // Loop over the npcs in the area
    for (auto &npc : npcs) {
        // If the user typed their name, get the message and break out of the loop
        if (toLower(npc.getName()) == npcName) {
            std::string message = npc.getMessage();
            std::cout << npc.getName() << " says:" << std::endl
                      << message << std::endl << std::endl;
            found = true;
            break;
        }
    }
    
    // If nobody is found let the user know
    if (!found) {
        std::cout << "There is no one named \"" << npcName << "\" here." << std::endl;
    }
}


void Game::meet(std::vector<std::string> target) {
    // If the user did not type an object
    if (target.empty()) {
        std::cout << "Who are we meeting...?" << std::endl;
        return;
    }
    std::string npcName = target[0];

    // Get the NPCs in the current location
    std::vector<Npc> npcs = currentLocation.getNpcs();

    // Loop over to see if they are there, if so print the description
    bool found = false;
    for (const auto& npc: npcs) {
        if (toLower(npc.getName()) == npcName) {
            std::cout << npc.getDesc() << std::endl << std::endl;
            found = true;
            break;
        }
    }
    // If that npc is not here let the user know
    if (!found) {
        std::cout << "No one by that name is here." << std::endl;
    }
}


void Game::take(std::vector<std::string> target) {
    // If the user did not type an object
    if (target.empty()) {
        std::cout << "Take what?" << std::endl;
        return;
    }

    std::string itemName = target[0];
    
    // Get a reference to the actual original items so they won't reappear in locations
    std::vector<Item>& locItems = currentLocation.getItemsRef();
    
    // Ensure the item is in the location vector, add the weight to the user, obtain item
    bool found = false;
    for (auto it = locItems.begin(); it != locItems.end(); ++it) {
        if (toLower(it->getName()) == itemName) {
            itemWeight += it->getWeight();
            // Item found -> add it to the game inventory
            items.push_back(*it);
            // Remove the item from the location
            locItems.erase(it);
            std::cout << "You picked up " << itemName << "." << std::endl << std::endl;
            found = true;
            break;
        }
    }
    // If that item is not here let the user know
    if (!found) {
        std::cout << "There is no " << itemName << " here." << std::endl;
    }

    // Ensure the actual global location is being updated accordingly <- ChatGPT helped me with this idea
    for (auto &locRef : locations) {
        if (toLower(locRef.get().getName()) == toLower(currentLocation.getName())) {
            locRef.get() = currentLocation;
            break;
        }
    }
}


void Game::give(std::vector<std::string> target) {
    // If the user did not pass in an object
    if (target.empty()) {
        std::cout << "Give what?" << std::endl << std::endl;
        return;
    }

    std::string itemName = target[0];

    // Search the player's inventory for the item -- ChatGPT
    auto it = std::find_if(items.begin(), items.end(),
                           [&](const Item &i) { return toLower(i.getName()) == itemName; });
    if (it == items.end()) {
        // Item not in inventory
        std::cout << "You don't have a " << itemName << "." << std::endl << std::endl;
        return;
    }
    // The item was found, save a copy
    Item item = *it;
    // Decrease the carried weight by the item's weight
    itemWeight -= item.getWeight();
    // Remove the item from the player's inventory
    items.erase(it);

    // Now check if the current location is the woods
    if (currentLocation.getName() == "Woods Behind Campus") {
        // If the item has positive cals -> reduce cals needed and print message
        if (item.getNumCals() > 0) {
            neededCals -= item.getNumCals();
            std::cout << "You fed Powder with " << item.getName() 
                      << ". Calories reduced by " << item.getNumCals() << "." << std::endl << std::endl;

            // Check if the requirement has been met -> fun ending as well
            if (neededCals <= 0) {
                std::cout << "You've done it! You've helped me succeed, said Powder." << std::endl;
                std::cout << "You hear a loud roar from benhind you deeper into the woods." << std::endl;
                std::cout << "An elder dragon flies upwards and vanishes into the skylight" << std::endl;
                std::cout << "A portal opens, Powder extends her hand to you..." << std::endl;

                std::cout << std::endl << "Do you take her hand? (yes/no): ";
                std::string choice;
                std::getline(std::cin, choice);
                choice = toLower(choice);

                if (choice == "yes" || choice == "y") {
                    std::cout << std::endl << "You take Powder's hand and step into the portal..." << std::endl;
                    std::cout << "A feeling of bliss overtakes you... You feel... Happy..." << std::endl;
                    this->quit(target);
                } else {
                    std::cout << std::endl << "You let her go. Powder watches as the portal slowly closes behind her." << std::endl;
                    std::cout << "What is next for me? You look around confused, why didn't you take her hand?" << std::endl;
                    std::cout << "You feel a lightheadedness entering your brain. Is this the end?" << std::endl;
                    std::cout << "You faint... You feel... Lost..." << std::endl;
                    this->quit(target);
                }
            }
        } else {
            // If not edible, transport the player to a new random location
            currentLocation = randomLocation();
            std::cout << "That item is not edible! You are transported to " 
                      << currentLocation.getName() << "." << std::endl << std::endl;
        }
    } else {
        // You are not in the woods, place the item wherever you are
        currentLocation.getItemsRef().push_back(item);
        std::cout << "You placed " << item.getName() << " in your current location." << std::endl << std::endl;
    }

    // Update the global copy of the current location -- ChatGPT
    for (auto &locRef : locations) {
        if (toLower(locRef.get().getName()) == toLower(currentLocation.getName())) {
            locRef.get() = currentLocation;
            break;
        }
    }
}


void Game::go(std::vector<std::string> target) {
    // You have too many items
    if (itemWeight >= 30) {
        std::cout << "You are too heavy to move! Please drop some items." << std::endl;
        return;
    }

    // You did not give an object
    if (target.empty()) {
        std::cout << "You didn't tell me where we are going..." << std::endl;
        return;
    }

    std::string direction = target[0];

    // Get the neighbors of your location and see if you gave a valid travelable location
    auto neighbors = currentLocation.getLocations();
    auto it = neighbors.find(direction);

    // If you did set the visited flag and display a message
    if (it != neighbors.end()) {
        it->second.get().setVisited();
        currentLocation = it->second.get();
        std::cout << "You have traveled " << direction << " to " << currentLocation.getName() 
                  << "." << std::endl << std::endl;
    } else {
        std::cout << "Invalid Command" << std::endl << std::endl;
    }
}


void Game::showItems(std::vector<std::string> target) {
    // Display your items
    if (items.empty()) {
        std::cout << "There are no items." << std::endl << std::endl;
        return;
    }

    std::cout << "Items:" << std::endl;
    for (const auto& item : items) {
        std::cout << " - " << item << std::endl << std::endl;
    }
}


void Game::look(std::vector<std::string> target) {
    // Show the information regarding your current location
    std::cout << currentLocation << std::endl;
}


void Game::warp(std::vector<std::string> target) {
    // Check if the orb is in the player's inventory -- ChatGPT
    auto orbIt = std::find_if(items.begin(), items.end(),
                               [&](const Item &i) { 
                                   return toLower(i.getName()) == "orb"; 
                               });
    // No orb :(
    if (orbIt == items.end()) {
        std::cout << "You don't have the orb. You cannot warp!" << std::endl << std::endl;
        return;
    }

    // No object provided
    if (target.empty()) {
        std::cout << "Warp where?" << std::endl << std::endl;
        return;
    }
    
    // Join all tokens in target into one string -- multi word locations
    std::string warpTarget;
    for (const auto& token : target) {
        warpTarget += token + " ";
    }
    if (!warpTarget.empty())
        warpTarget.pop_back();
    // Convert the full warp target to lowercase
    warpTarget = toLower(warpTarget);
    bool found = false;
    
    // Check to see if the user provided a target available to travel to
    for (auto &locRef : locations) {
        // Compare stored location name (converted to lowercase) with the warp target.
        if (toLower(locRef.get().getName()) == warpTarget) {
            // Found the location -> Update currentLocation
            currentLocation = locRef.get();
            currentLocation.setVisited();  // Mark as visited
            std::cout << "Warping to " << currentLocation.getName() << "!" << std::endl << std::endl;
            found = true;
            break;
        }
    }
    
    // Not a valid location
    if (!found) {
        std::cout << "No such location: " << warpTarget << std::endl << std::endl;
    }
}


void Game::study(std::vector<std::string> target) {
    // If you are not in kindschi
    if (toLower(currentLocation.getName()) != "kindschi") {
        std::cout << "You try to study the items in the area but nothing happens." << std::endl;
        return;
    }

    // They are in the correct location
    std::vector<Item>& locItems = currentLocation.getItemsRef();
    bool hasMicroscope = false;
    bool hasDNA = false;

    // Check to see if the user has given the microscope and dna to the location
    for (const auto& item: locItems) {
        std::string nameLower = toLower(item.getName());
        if (nameLower == "microscope") {
            hasMicroscope = true;
        } else if (nameLower == "dna") {
            hasDNA = true;
        }
    }

    // If they did they found the secret ending
    if (hasDNA && hasMicroscope) {
        std::cout << std::endl
                  << "Secret Ending Unlocked:" << std::endl
                  << "You look at the DNA, uncovering the secrets of those here before." << std::endl
                  << "Am I really seeing what I'm seeing?" << std::endl
                  << "You wake up in a cold sweat... Oh... It was just a dream..." << std::endl;
        this->quit(target);
    // They are in kindschi but didn't have the required items
    } else {
        std::cout << "You study the area, but something seems to be missing..." << std::endl;
    }
}


void Game::quit(std::vector<std::string> target) {
    // The loop will cease, game will be deallocated in main
    gameContinue = false;
}

// Penned via standard programming aids
Location& Game::randomLocation() {
    if (locations.empty()) {
        throw std::runtime_error("No locations available.");
    }
    
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, locations.size() - 1);
    
    int index = dis(gen);
    return locations[index].get();
}


void Game::play() {
    // Fun message to start the game
    std::cout << "You wake up, find yourself on the campus of Grand Valley..." << std::endl
              << "Do your best to unlock the secrets that lay before you..." << std::endl
              << "Good Luck..." << std::endl << std::endl;
    std::string response;

    while (gameContinue) {
        std::cout << "-> ";
        std::getline(std::cin, response);
        // Tokenize the response
        auto tokenizedResponse = tokenizeInput(response);
        // If its blank, continue the loop
        if (tokenizedResponse.empty()) continue;

        std::string userCommand = tokenizedResponse[0];
        // https://stackoverflow.com/questions/40656871/remove-from-the-beginning-of-stdvector
        tokenizedResponse.erase(tokenizedResponse.begin());

        // Look up the command in the commands map
        auto cmdIt = commands.find(userCommand);
        if (cmdIt != commands.end()) {
            cmdIt->second(tokenizedResponse);
        // If the command is invalid
        } else {
            std::cout << "Unknown command: " << userCommand << std::endl;
        }
    } 
}