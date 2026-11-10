package part01;

import java.util.ArrayList;

public class DefaultData {
    private static ArrayList<Artifact> artifcats = new ArrayList<Artifact>();
    private static ArrayList<Exhibit> exhibits = new ArrayList<Exhibit>();

    /**
     * Prevents Instatiation
     */
    private DefaultData(){}

    /**
     * Designed via basic programming aids
     * Version: GPT-4o
     * Used to Create the large test data
     */
    private static String[][] artifactData = {
            { "Rosetta Stone", "Stone", "11", "An ancient Egyptian artifact key to deciphering hieroglyphs." },
            { "Elgin Marbles", "Relief", "12", "A collection of classical Greek marble sculptures." },
            { "Sutton Hoo Helmet", "Helmet", "13", "An Anglo-Saxon helmet from the Sutton Hoo burial site." },
            { "Egyptian Mummy", "Mummy", "14", "A preserved body from ancient Egypt." },
            { "Assyrian Relief", "Relief", "15", "Depicts scenes from Assyrian life and mythology." },
            { "Lewis Chessmen", "Chess Piece", "16", "Medieval chess pieces carved from walrus ivory." },
            { "Roman Coin", "Coin", "10", "Ancient coin used in the Roman Empire." },
            { "Japanese Samurai Armor", "Armor", "1", "Traditional armor worn by Japanese samurai warriors." },
            { "Maya Codex", "Codex", "19", "An ancient Maya manuscript." },
            { "Greek Vase", "Vase", "11", "A decorated vase from ancient Greece." },
            { "Chinese Jade Bi", "Jade", "11", "A jade disc used in ancient Chinese rituals." },
            { "Benin Bronze Plaque", "Bronze", "2", "A plaque from the Kingdom of Benin, depicting royal life." },
            { "Persian Pottery", "Pottery", "3", "Decorative pottery from ancient Persia." },
            { "Byzantine Cross", "Cross", "4", "A cross from the Byzantine Empire." },
            { "Aztec Calendar Stone", "Stone", "15", "An Aztec stone depicting their calendar system." },
            { "Nok Terracotta Figure", "Terracotta", "6", "A terracotta figure from the Nok civilization." },
            { "Hittite Seal", "Seal", "7", "An ancient seal from the Hittite Empire." },
            { "Egyptian Sarcophagus", "Sarcophagus", "8", "A stone coffin from ancient Egypt." },
            { "Viking Sword", "Sword", "9", "A sword used by Viking warriors." },
            { "Ming Vase", "Vase", "10", "A vase from the Ming Dynasty in China." },
            { "Roman Bust", "Bust", "11", "A marble bust of a Roman emperor." },
            { "Babylonian Tablet", "Tablet", "12", "A clay tablet inscribed with cuneiform writing." },
            { "Egyptian Amulet", "Amulet", "13", "An amulet used for protection in ancient Egypt." },
            { "Sumerian Idol", "Idol", "14", "A small statue used in Sumerian religious rituals." },
            { "Renaissance Painting", "Painting", "15", "A painting from the European Renaissance period." },
            { "Medieval Manuscript", "Manuscript", "12", "A handwritten book from the medieval period." },
            { "Terracotta Army Figure", "Terracotta", "12", "A figure from the Terracotta Army in China." },
            { "Ancient Greek Lyre", "Lyre", "12", "A musical instrument from ancient Greece." },
            { "Phoenician Coin", "Coin", "12", "A coin from the Phoenician civilization." },
            { "Inca Textile", "Textile", "10", "A woven fabric from the Inca Empire." },
            { "Olmec Colossal Head", "Sculpture", "11", "A large stone head sculpted by the Olmecs." },
            { "Islamic Astrolabe", "Astrolabe", "12", "An instrument used for astronomical measurements." },
            { "Renaissance Dagger", "Dagger", "13", "A ceremonial dagger from the Renaissance period." },
            { "Anglo-Saxon Brooch", "Brooch", "14", "A brooch used by Anglo-Saxon nobility." },
            { "Egyptian Scarab", "Scarab", "15", "A beetle-shaped amulet from ancient Egypt." },
            { "African Mask", "Mask", "16", "A mask used in African tribal ceremonies." },
            { "Ancient Lamp", "Lamp", "13", "A lamp used in ancient Greece and Rome." },
            { "Victorian Era Coin", "Coin", "13", "A coin from Victorian England." },
            { "Han Dynasty Urn", "Urn", "19", "An urn from the Han Dynasty in China." },
            { "Chinese Scroll", "Scroll", "14", "A traditional Chinese painted scroll." },
            { "Neolithic Axe", "Axe", "11", "A stone axe from the Neolithic era." },
            { "Iron Age Spearhead", "Spearhead", "14", "A spearhead from the Iron Age." },
            { "Roman Mosaic", "Mosaic", "13", "A floor mosaic from ancient Rome." },
            { "Gothic Statue", "Statue", "14", "A statue from the Gothic period." },
            { "Mayan Bowl", "Bowl", "14", "A ceramic bowl from the Maya civilization." },
            { "Sumerian Cylinder Seal", "Seal", "14", "A cylindrical seal used in Sumer." },
            { "Sasanian Silver Plate", "Silver Plate", "14", "A silver plate from the Sasanian Empire." },
            { "Medieval Chalice", "Chalice", "18", "A drinking vessel from the medieval period." },
            { "Inca Quipu", "Quipu", "19", "A recording device used by the Inca civilization." },
            { "Persian Rug", "Rug", "15", "A decorative rug from Persia." },
            { "Islamic Calligraphy", "Calligraphy", "1", "Decorative Islamic calligraphy." },
            { "Indian Bronze Statue", "Bronze", "2", "A bronze statue from ancient India." },
            { "Ming Dynasty Porcelain", "Porcelain", "3", "A porcelain piece from the Ming Dynasty." },
            { "Byzantine Icon", "Icon", "4", "A religious icon from the Byzantine Empire." },
            { "Achaemenid Bracelet", "Bracelet", "5", "A bracelet from the Achaemenid Empire." },
            { "Ancient Harp", "Harp", "6", "A musical instrument from ancient times." },
            { "Venetian Glass", "Glass", "7", "Decorative glass from Venice." },
            { "Egyptian Cartouche", "Cartouche", "8", "A carved nameplate from ancient Egypt." },
            { "Roman Shield", "Shield", "9", "A shield used by Roman soldiers." },
            { "Tang Dynasty Mirror", "Mirror", "10", "A bronze mirror from the Tang Dynasty." },
            { "Minoan Fresco", "Fresco", "11", "A wall painting from ancient Minoan civilization." },
            { "Ancient Greek Coin", "Coin", "12", "A coin used in ancient Greece." },
            { "Celtic Torque", "Jewelry", "13", "A neck ring worn by the ancient Celts." },
            { "Egyptian Papyrus", "Papyrus", "14", "A manuscript made from the papyrus plant." },
            { "Roman Glass Vase", "Vase", "15", "A glass vase from the Roman Empire." },
            { "Indus Valley Seal", "Seal", "16", "An engraved seal from the Indus Valley civilization." },
            { "Mesopotamian Ziggurat Model", "Model", "16", "A model of a Mesopotamian ziggurat temple." },
            { "Ancient Greek Theater Mask", "Mask", "16", "A mask used in Greek theater." },
            { "Egyptian Shabti", "Shabti", "19", "A funerary figurine from ancient Egypt." },
            { "Medieval Armor", "Armor", "10", "Armor worn by medieval knights." },
            { "Phoenician Amphora", "Amphora", "17", "A large vessel used for storing wine or oil." },
            { "Neolithic Pottery", "Pottery", "17", "Pottery from the Neolithic period." },
            { "Roman Bronze Statue", "Statue", "13", "A bronze statue from ancient Rome." },
            { "Hellenistic Coin", "Coin", "17", "A coin from the Hellenistic period." },
            { "Egyptian Funerary Mask", "Mask", "17", "A mask used in Egyptian funerary practices." },
            { "Chinese Dragon Robe", "Clothing", "16", "An ornate robe worn by Chinese royalty." },
            { "Babylonian Cylinder Seal", "Seal", "17", "A small cylindrical seal used in Babylon." },
            { "Ancient Greek Helm", "Helmet", "18", "A helmet used by Greek soldiers." },
            { "Viking Brooch", "Brooch", "19", "A brooch from Viking-era Scandinavia." },
            { "Islamic Tile", "Tile", "10", "A decorative tile from the Islamic world." },
            { "Medieval Crown", "Crown", "11", "A crown worn by European royalty in the medieval period." },
            { "Sumerian Tablet", "Tablet", "12", "A clay tablet with Sumerian writing." },
            { "Persian Vase", "Vase", "13", "A decorated vase from ancient Persia." },
            { "Roman Lamp", "Lamp", "14", "An oil lamp from the Roman Empire." },
            { "Egyptian Coffin", "Coffin", "15", "A decorated coffin from ancient Egypt." },
            { "Byzantine Bracelet", "Bracelet", "16", "A bracelet from the Byzantine Empire." },
            { "Assyrian Bull Statue", "Statue", "17", "A statue depicting an Assyrian bull." },
            { "Ancient Indian Sculpture", "SculpturE", "18", "A sculpture from ancient India." },
            { "Tang Dynasty Horse", "Sculpture", "19", "A ceramic horse statue from the Tang Dynasty." },
            { "Roman Amphora", "Amphora", "10", "A vessel used to store goods in the Roman Empire." },
            { "Ancient Greek Krater", "Vase", "11", "A large Greek vase used for mixing wine." },
            { "Hittite Sword", "Sword", "12", "A ceremonial sword from the Hittite Empire." },
            { "Phoenician Necklace", "Jewelry", "13", "A necklace made by the Phoenicians." },
            { "Egyptian Wall Painting", "Fresco", "14", "A wall painting from an Egyptian tomb." },
            { "Medieval Crossbow", "Weapon", "15", "A crossbow used in medieval Europe." },
            { "Maya Jade Mask", "Mask", "16", "A jade mask from the Maya civilization." },
            { "Greek Amphora", "Amphora", "17", "A pottery vessel used in ancient Greece." },
            { "Egyptian Hieroglyphic Panel", "Panel", "18", "A panel inscribed with Egyptian hieroglyphs." },
            { "Viking Shield", "Shield", "19", "A wooden shield used by Viking warriors." },
            { "Sasanian Helmet", "Helmet", "2", "A helmet from the Sasanian Empire." },
            { "Renaissance Tapestry", "Tapestry", "1", "A decorative tapestry from the Renaissance." },
            { "Assyrian Winged Bull", "Sculpture", "2", "A monumental statue from Assyria." },
            { "Medieval Sword", "Sword", "3", "A sword used by knights in the medieval period." },
            { "Han Dynasty Jade", "Jade", "4", "A jade carving from the Han Dynasty." },
            { "Phoenician Pottery", "Pottery", "5", "Pottery from the Phoenician civilization." },
            { "Inca Gold Ornament", "Ornament", "6", "A gold ornament from the Inca civilization." },
            { "Greek Marble Head", "Sculpture", "7", "A marble head sculpture from ancient Greece." },
            { "Roman Legionnaire Helmet", "Helmet", "8", "A helmet used by Roman legionnaires." },
            { "Chinese Tang Horse", "Statue", "9", "A ceramic horse from the Tang Dynasty." },
            { "Aztec Obsidian Knife", "Knife", "10", "A ceremonial knife made of obsidian by the Aztecs." },
            { "Egyptian Funerary Statue", "Statue", "211", "A statue from an Egyptian burial site." },
            { "Babylonian Kudurru", "Stone", "12", "A boundary stone from ancient Babylon." },
            { "Ancient Greek Stele", "Stele", "13", "A stone slab inscribed with Greek text." },
            { "Persian Archer Figure", "Figure", "14", "A figure of an archer from Persia." },
            { "Byzantine Cross Pendant", "Jewelry", "15", "A cross pendant from the Byzantine period." },
            { "Sumerian Harp", "Harp", "216", "A musical instrument from ancient Sumer." },
            { "Roman Bronze Mirror", "Mirror", "17", "A hand-held mirror from the Roman Empire." },
            { "Egyptian God Statue", "Statue", "18", "A statue depicting an Egyptian deity." },
            { "African Ritual Mask", "Mask", "19", "A mask used in African rituals and ceremonies." },
            { "Islamic Manuscript", "Manuscript", "20", "An illuminated manuscript from the Islamic world." },
            { "Egyptian Obelisk", "Obelisk", "21", "A tall, four-sided monument from ancient Egypt." },
            { "Assyrian Cuneiform Tablet", "Tablet", "2", "A clay tablet inscribed with cuneiform writing." },
            { "Ancient Greek Statue", "Statue", "3", "A statue from classical Greece." },
            { "Viking Ring", "Jewelry", "4", "A decorative ring from the Viking era." },
            { "Mesoamerican Figurine", "Figurine", "5", "A small figurine from Mesoamerica." },
            { "Roman Medical Tools", "Tools", "226", "Surgical tools used in the Roman Empire." },
            { "Etruscan Mirror", "Mirror", "7", "A bronze mirror from the Etruscan civilization." },
            { "Chinese Han Burial Suit", "Suit", "8", "A jade burial suit from the Han Dynasty." },
            { "Greek Gold Necklace", "Jewelry", "9", "A gold necklace from ancient Greece." },
            { "Islamic Ceramics", "Ceramics", "7", "Intricately decorated ceramics from the Islamic world." },
            { "African Tribal Spear", "Spear", "21", "A spear used in African tribal ceremonies." },
            { "Byzantine Coin", "Coin", "22", "A coin from the Byzantine Empire." },
            { "Phoenician Amulet", "Amulet", "3", "An amulet from the Phoenician civilization." },
            { "Inca Ceremonial Knife", "Knife", "4", "A ceremonial knife used by the Inca." },
            { "Tang Dynasty Scroll", "Scroll", "5", "A painted scroll from the Tang Dynasty." },
            { "Ancient Japanese Sword", "Sword", "2", "A sword from ancient Japan." },
            { "Egyptian Ushabti", "Ushabti", "7", "A funerary figurine placed in Egyptian tombs." },
            { "Mughal Empire Dagger", "Dagger", "8", "An ornate dagger from the Mughal Empire." },
            { "Roman Chariot Wheel", "Wheel", "2", "A wheel from a Roman chariot." },
            { "Greek Bronze Shield", "Shield", "20", "A shield used in ancient Greece." },
            { "Chinese Zodiac Statue", "Statue", "2", "A statue representing one of the Chinese zodiac animals." },
            { "Babylonian Relief", "Relief", "2", "A relief sculpture from ancient Babylon." },
            { "Roman Laurel Wreath", "Wreath", "23", "A laurel wreath worn by victorious Romans." },
            { "Nubian Pottery", "Pottery", "4", "Pottery from ancient Nubia." },
            { "Ancient Egyptian Stela", "Stela", "5", "A stone slab inscribed with Egyptian text." },
            { "Islamic Brass Astrolabe", "Astrolabe", "6", "A brass instrument used for navigation." },
            { "Anglo-Saxon Sword", "Sword", "2", "A sword from the Anglo-Saxon period." },
            { "Egyptian Senet Board", "Board Game", "248", "An ancient Egyptian board game." },
            { "Assyrian Winged Genius", "Statue", "9", "A statue depicting a protective spirit from Assyria." },
            { "Roman Fresco", "Fresco", "250", "A wall painting from a Roman villa." },
            { "Medieval Book of Hours", "Manuscript", "25", "A medieval Christian devotional book." },
            { "Greek Bronze Helmet", "Helmet", "2", "A helmet used by Greek soldiers." },
            { "Aztec Shield", "Shield", "2", "A decorative shield from the Aztec civilization." },
            { "Han Dynasty Terra Cotta Soldier", "Statue", "4", "A terra cotta soldier from ancient China." },
            { "Islamic Geometric Tile", "Tile", "5", "A tile with geometric patterns from the Islamic world." },
            { "Roman Oil Lamp", "Lamp", "2", "An oil lamp from ancient Rome." },
            { "Sumerian Plaque", "Plaque", "7", "A clay plaque with Sumerian inscriptions." },
            { "Byzantine Chalice", "Chalice", "8", "A chalice used in Byzantine religious ceremonies." },
            { "Medieval Leather Helmet", "Helmet", "9", "A leather helmet from the medieval period." },
            { "Japanese Noh Mask", "Mask", "2", "A mask used in Japanese Noh theater." },
            { "Maya Stela", "Stela", "1", "A carved stone monument from the Maya civilization." },
            { "Egyptian Canopic Jar", "Jar", "6", "A jar used to store organs in ancient Egypt." },
            { "Inca Silver Llama", "Sculpture", "3", "A small silver llama figure from the Inca Empire." },
            { "Ancient Chinese Bronze Bell", "Bell", "264", "A ceremonial bell from ancient China." },
            { "Mesopotamian Idol", "Idol", "25", "A statue used in Mesopotamian religious rituals." },
            { "Greek Kylix", "Cup", "6", "A drinking cup used in ancient Greece." },
            { "Roman Gladiator Helmet", "Helmet", "7", "A helmet worn by Roman gladiators." },
            { "Hittite Figurine", "Figurine", "2", "A figurine from the Hittite civilization." },
            { "Renaissance Brass Compass", "Compass", "2", "A brass compass used during the Renaissance." },
            { "Egyptian Sphinx Statue", "Statue", "270", "A small statue depicting the Sphinx." },
            { "Phoenician Glass Bead", "Jewelry", "21", "A glass bead made by the Phoenicians." },
            { "Edo Bronze Head", "Bronze", "2", "A bronze head sculpture from the Kingdom of Benin." },
            { "Ancient Greek Fibula", "Jewelry", "3", "A brooch used in ancient Greece." },
            { "Roman Bath Mosaic", "Mosaic", "24", "A floor mosaic from a Roman bath." },
            { "Chinese Qing Vase", "Vase", "25", "A decorative vase from the Qing Dynasty." },
            { "Islamic Brass Lamp", "Lamp", "6", "A brass oil lamp from the Islamic world." },
            { "Byzantine Ivory Icon", "Icon", "7", "An ivory icon from the Byzantine Empire." },
            { "Persian Archer Statue", "Statue", "8", "A small statue of a Persian archer." },
            { "African Copper Bracelet", "Jewelry", "9", "A bracelet made of copper from Africa." },
            { "Viking Boat Model", "Model", "2", "A model of a Viking boat." },
            { "Egyptian Linen Shroud", "Cloth", "4",
                    "A fine linen shroud used in ancient Egypt for mummification and burial rituals." },
            { "Chinese Silk Brocade", "Fabric", "4",
                    "A richly embroidered silk fabric from China, often used in imperial clothing and ceremonial robes." },
            { "Medieval Tapestry Fragment", "Tapestry", "4",
                    "A fragment of a medieval European tapestry, depicting scenes from daily life and religious themes." },
            { "Bayeux Tapestry", "Tapestry", "3",
                    "A famous embroidered cloth depicting the events leading up to the Norman Conquest of England in 1066." },
            { "Persian Rug", "Textile", "2",
                    "An intricately woven carpet from Persia, known for its vibrant colors and detailed geometric patterns." },
            { "Andean Textiles", "Cloth", "4",
                    "Handwoven textiles from the Andean cultures of South America, often decorated with symbolic patterns and used in ceremonial attire." },
            { "Dead Sea Scroll", "Manuscript", "21",
                    "A set of ancient Jewish texts found near the Dead Sea, containing biblical and non-biblical writings." },
            { "Etruscan Bronze Tablet", "Scroll", "22",
                    "A bronze tablet inscribed with Etruscan language, used for recording laws and religious rituals." },
            { "Gutenberg Bible Page", "Manuscript", "4",
                    "A page from the Gutenberg Bible, one of the earliest printed books in Europe using movable type." },
            { "Egyptian Pharaoh's Throne", "Furniture", "4",
                    "A luxurious throne made of gilded wood, used by ancient Egyptian pharaohs during state ceremonies." },
            { "Medieval Crown of England", "Crown", "42",
                    "A crown worn by English monarchs, adorned with jewels and symbolizing royal authority." },
            { "Qing Dynasty Imperial Robe", "Clothing", "43",
                    "A richly embroidered silk robe worn by the emperor of China during formal ceremonies in the Qing Dynasty." },
            { "Hindu Ritual Bell", "Religious Object", "31",
                    "A small bell used in Hindu rituals to call upon deities during ceremonies and prayers." },
            { "Aztec Sacred Knife", "Ritual Tool", "32",
                    "A ceremonial obsidian knife used in Aztec religious sacrifices and offerings to the gods." },
            { "Ancient Roman Oil Lamp", "Lamp", "33",
                    "A small terracotta oil lamp used in Roman religious ceremonies to light altars and temples." },
            { "Minoan Terracotta Jug", "Pottery", "13",
                    "A hand-crafted terracotta jug from the Minoan civilization, used for storing liquids." },
            { "Greek Red-Figure Krater", "Vase", "14",
                    "A large, decorated krater used by ancient Greeks for mixing wine and water during banquets." },
            { "Persian Ceramic Vase", "Vase", "15",
                    "An intricately decorated ceramic vase from Persia, featuring floral motifs and bright colors." },
            { "Astrolabe", "Navigation Tool", "34",
                    "An ancient instrument used to measure the position of the stars and planets for navigation and astrology." },
            { "Viking Sunstone", "Navigational Tool", "32",
                    "A crystal used by Viking sailors to locate the sun's position on cloudy days for navigation." },
            { "Arabian Sextant", "Navigation Tool", "3",
                    "A brass sextant used by Arab navigators during the Islamic Golden Age for measuring the angle of stars." },
            { "Ancient Egyptian Surgical Knife", "Tool", "3",
                    "A bronze surgical knife used by ancient Egyptian physicians in medical procedures." },
            { "Roman Bone Saw", "Tool", "2",
                    "A metal saw used by Roman surgeons for bone cutting during medical treatments." },
            { "Chinese Acupuncture Needles", "Tool", "3",
                    "A set of finely crafted needles used in traditional Chinese acupuncture for healing and wellness." },
            { "Olmec Jade Mask", "Mask", "13",
                    "A finely carved jade mask from the Olmec civilization, used in religious ceremonies." },
            { "Ancient Greek Theater Mask", "Mask", "14",
                    "A dramatic mask used in Greek theater, symbolizing different characters and emotions." },
            { "Japanese Samurai Menpo", "Face Armor", "15",
                    "A protective face mask worn by samurai, designed to intimidate opponents and shield the face." },
            { "Ptolemaic World Map", "Map", "31",
                    "An ancient map based on the work of Ptolemy, illustrating the known world with early geographic concepts." },
            { "Mappa Mundi", "Map", "32",
                    "A medieval map depicting a religiously interpreted view of the world, centered around Jerusalem." },
            { "Chinese Star Map", "Celestial Map", "33",
                    "An ancient Chinese map of the stars, used for navigation and astrology during the Han Dynasty." },
            { "Byzantine Gold Earrings", "Jewelry", "21",
                    "A pair of ornate gold earrings from the Byzantine Empire, featuring intricate filigree work." },
            { "Viking Silver Arm Ring", "Jewelry", "22",
                    "A twisted silver arm ring worn by Viking warriors and nobles as a sign of wealth and allegiance." },
            { "Ancient Egyptian Faience Bead Necklace", "Jewelry", "23",
                    "A colorful necklace made of faience beads, popular in ancient Egypt for its vibrant hues and symbolic protection." },
            { "Celtic Torc", "Jewelry", "23",
                    "A large, twisted metal neck ring worn by Iron Age Celts as a symbol of status and power." },
            { "Iron Age Spearhead", "Weapon", "24",
                    "A forged iron spearhead used by Iron Age warriors for hunting and combat." },
            { "Hallstatt Culture Sword", "Weapon", "25",
                    "A long iron sword from the Hallstatt culture, decorated with intricate engravings." },
            { "Chola Bronze Nataraja", "Statue", "13",
                    "A bronze statue depicting Shiva as Nataraja, the cosmic dancer, from the Chola dynasty." },
            { "Mughal Jade Dagger Hilt", "Dagger Hilt", "14",
                    "An intricately carved jade dagger hilt from the Mughal period, often decorated with floral motifs." },
            { "Indus Valley Painted Pottery Jar", "Pottery", "15",
                    "A pottery jar from the Indus Valley civilization, decorated with geometric patterns." },
            { "Song Dynasty Celadon Bowl", "Bowl", "23",
                    "A green-glazed celadon bowl from the Song Dynasty, renowned for its smooth texture and subtle color." },
            { "Greek Black-Figure Amphora", "Vase", "24",
                    "An amphora with black-figure decoration depicting mythological scenes, used for storing wine or oil." },
            { "Iznik Tile", "Tile", "25",
                    "A colorful ceramic tile from the Ottoman period, decorated with floral and geometric patterns." },
            { "Ancient Egyptian Shabti Figurine", "Figurine", "23",
                    "A small figurine placed in tombs to serve the deceased in the afterlife." },
            { "Roman Grave Stele", "Stele", "24",
                    "A carved stone slab marking the burial site of a Roman citizen, with inscriptions commemorating their life." },
            { "Viking Burial Brooch", "Brooch", "25",
                    "An ornate brooch buried with Viking nobles, symbolizing their status and achievements." },
            { "Bodhisattva Statue", "Statue", "13",
                    "A serene statue of a Bodhisattva, symbolizing compassion and wisdom." },
            { "Prayer Wheel", "Religious Object", "14",
                    "A handheld prayer wheel inscribed with Buddhist mantras, used in meditation." },
            { "Thangka Painting", "Painting", "15",
                    "A Tibetan Thangka depicting scenes from the life of Buddha, used in meditation and teaching." }
    };

    /**
     * Designed via basic programming aids
     * Version: GPT-4o
     * Used to Create the large test data
     */
    private static String[] exhibitNames = {
            "Ancient Egyptian Artifacts",
            "Ancient Greek Artifacts",
            "Babylonian Artifacts",
            "Persian Artifacts",
            "Assyrian Artifacts",
            "Phoenician Artifacts",
            "Ancient Chinese Artifacts",
            "Japanese Artifacts",
            "Viking Artifacts",
            "Mesoamerican (Maya) Artifacts",
            "Aztec Artifacts",
            "Inca and Andean Artifacts",
            "Islamic Artifacts",
            "African Tribal Artifacts",
            "Indian Artifacts",
            "Buddhist Artifacts",
            "Masks and Face Adornments",
            "Pottery and Vases",
            "Bronze Artifacts",
            "Iron Age Artifacts",
            "Ceramics and Porcelain",
            "Burial and Funerary Artifacts",
            "Weapons (Swords, Daggers, Spears)",
            "Helmets and Armor",
            "Sculptures and Statues",
            "Royal and Regal Artifacts",
            "Religious and Ritual Artifacts",
            "Textiles and Fabrics",
            "Jewelry and Decorative Items",
            "Tapestries and Woven Items",
            "Scrolls and Manuscripts",
            "Coins and Currency",
            "Paintings and Frescoes",
            "Navigation and Astronomical Instruments",
            "Medical and Tools",
            "Maps and Geographic Artifacts"
    };

    private static ArrayList<ArrayList<Integer>> exhibitArtifacts = new ArrayList<>();;
    private static ArrayList<ArrayList<String>> exhibitRoutes = new ArrayList<>();;

    /**
     * Designed via basic programming aids
     * Version: GPT-4o
     * Used to Create the large test data
     */
    private static void createAllExhibitData() {
        // Initialize 36 themes (ArrayLists) to categorize similar artifacts by their
        // indexes
        for (int i = 0; i < 36; i++) {
            exhibitArtifacts.add(new ArrayList<Integer>());
            exhibitRoutes.add(new ArrayList<String>());
        }

        // Group artifacts into 36 unique thematic sets
        for (int i = 0; i < artifactData.length; i++) {
            String artifactName = artifactData[i][0];
            String artifactDescription = artifactData[i][3];

            // Assign artifacts to specific unique themes based on name and description
            if (artifactDescription.contains("Egypt") || artifactName.contains("Egypt")) {
                exhibitArtifacts.get(0).add(i); // Ancient Egyptian Artifacts
                exhibitRoutes.get(0).add(artifactDescription);
            } else if (artifactDescription.contains("Greece") || artifactName.contains("Greek")) {
                exhibitArtifacts.get(1).add(i); // Ancient Greek Artifacts
                exhibitRoutes.get(1).add(artifactDescription);
            } else if (artifactDescription.contains("Babylon") || artifactName.contains("Babylon")) {
                exhibitArtifacts.get(2).add(i); // Babylonian Artifacts
                exhibitRoutes.get(2).add(artifactDescription);
            } else if (artifactDescription.contains("Persia") || artifactDescription.contains("Persian")) {
                exhibitArtifacts.get(3).add(i); // Persian Artifacts
                exhibitRoutes.get(3).add(artifactDescription);
            } else if (artifactDescription.contains("Assyrian") || artifactName.contains("Assyria")) {
                exhibitArtifacts.get(4).add(i); // Assyrian Artifacts
                exhibitRoutes.get(4).add(artifactDescription);
            } else if (artifactDescription.contains("Phoenician") || artifactName.contains("Phoenician")) {
                exhibitArtifacts.get(5).add(i); // Phoenician Artifacts
                exhibitRoutes.get(5).add(artifactDescription);
            } else if (artifactDescription.contains("China") || artifactName.contains("Chinese")) {
                exhibitArtifacts.get(6).add(i); // Ancient Chinese Artifacts
                exhibitRoutes.get(6).add(artifactDescription);
            } else if (artifactDescription.contains("Japan") || artifactName.contains("Japanese")) {
                exhibitArtifacts.get(7).add(i); // Japanese Artifacts
                exhibitRoutes.get(7).add(artifactDescription);
            } else if (artifactDescription.contains("Viking") || artifactName.contains("Norse")) {
                exhibitArtifacts.get(8).add(i); // Viking Artifacts
                exhibitRoutes.get(8).add(artifactDescription);
            } else if (artifactDescription.contains("Maya") || artifactDescription.contains("Mesoamerica")) {
                exhibitArtifacts.get(9).add(i); // Mesoamerican (Maya) Artifacts
                exhibitRoutes.get(9).add(artifactDescription);
            } else if (artifactDescription.contains("Aztec") || artifactDescription.contains("Mexican")) {
                exhibitArtifacts.get(10).add(i); // Aztec Artifacts
                exhibitRoutes.get(10).add(artifactDescription);
            } else if (artifactDescription.contains("Inca") || artifactDescription.contains("Andes")) {
                exhibitArtifacts.get(11).add(i); // Inca and Andean Artifacts
                exhibitRoutes.get(11).add(artifactDescription);
            } else if (artifactDescription.contains("Islamic") || artifactDescription.contains("Muslim")) {
                exhibitArtifacts.get(12).add(i); // Islamic Artifacts
                exhibitRoutes.get(12).add(artifactDescription);
            } else if (artifactDescription.contains("African") || artifactDescription.contains("tribal")) {
                exhibitArtifacts.get(13).add(i); // African Tribal Artifacts
                exhibitRoutes.get(13).add(artifactDescription);
            } else if (artifactDescription.contains("Indian") || artifactDescription.contains("Hindu")) {
                exhibitArtifacts.get(14).add(i); // Indian Artifacts
                exhibitRoutes.get(14).add(artifactDescription);
            } else if (artifactDescription.contains("Buddhist") || artifactDescription.contains("Buddha")) {
                exhibitArtifacts.get(15).add(i); // Buddhist Artifacts
                exhibitRoutes.get(15).add(artifactDescription);
            } else if (artifactDescription.contains("mask")) {
                exhibitArtifacts.get(16).add(i); // Masks and Face Adornments
                exhibitRoutes.get(16).add(artifactDescription);
            } else if (artifactDescription.contains("pottery") || artifactName.contains("Vase")) {
                exhibitArtifacts.get(17).add(i); // Pottery and Vases
                exhibitRoutes.get(17).add(artifactDescription);
            } else if (artifactDescription.contains("bronze") || artifactName.contains("Bronze")) {
                exhibitArtifacts.get(18).add(i); // Bronze Artifacts
                exhibitRoutes.get(18).add(artifactDescription);
            } else if (artifactDescription.contains("iron") || artifactName.contains("Iron")) {
                exhibitArtifacts.get(19).add(i); // Iron Age Artifacts
                exhibitRoutes.get(19).add(artifactDescription);
            } else if (artifactDescription.contains("ceramic") || artifactDescription.contains("porcelain")) {
                exhibitArtifacts.get(20).add(i); // Ceramics and Porcelain
                exhibitRoutes.get(20).add(artifactDescription);
            } else if (artifactDescription.contains("tomb") || artifactDescription.contains("burial")) {
                exhibitArtifacts.get(21).add(i); // Burial and Funerary Artifacts
                exhibitRoutes.get(21).add(artifactDescription);
            } else if (artifactDescription.contains("weapon") || artifactDescription.contains("sword")
                    || artifactDescription.contains("dagger")) {
                exhibitArtifacts.get(22).add(i); // Weapons (Swords, Daggers, Spears)
                exhibitRoutes.get(22).add(artifactDescription);
            } else if (artifactDescription.contains("helmet") || artifactDescription.contains("armor")) {
                exhibitArtifacts.get(23).add(i); // Helmets and Armor
                exhibitRoutes.get(23).add(artifactDescription);
            } else if (artifactDescription.contains("sculpture") || artifactDescription.contains("statue")) {
                exhibitArtifacts.get(24).add(i); // Sculptures and Statues
                exhibitRoutes.get(24).add(artifactDescription);
            } else if (artifactDescription.contains("royal") || artifactDescription.contains("crown")
                    || artifactDescription.contains("regal")) {
                exhibitArtifacts.get(25).add(i); // Royal and Regal Artifacts
                exhibitRoutes.get(25).add(artifactDescription);
            } else if (artifactDescription.contains("religious") || artifactDescription.contains("ritual")) {
                exhibitArtifacts.get(26).add(i); // Religious and Ritual Artifacts
                exhibitRoutes.get(26).add(artifactDescription);
            } else if (artifactDescription.contains("textile") || artifactDescription.contains("cloth")) {
                exhibitArtifacts.get(27).add(i); // Textiles and Fabrics
                exhibitRoutes.get(27).add(artifactDescription);
            } else if (artifactDescription.contains("jewelry") || artifactName.contains("Jewelry")
                    || artifactDescription.contains("ornament")) {
                exhibitArtifacts.get(28).add(i); // Jewelry and Decorative Items
                exhibitRoutes.get(28).add(artifactDescription);
            } else if (artifactDescription.contains("tapestry") || artifactDescription.contains("woven")) {
                exhibitArtifacts.get(29).add(i); // Tapestries and Woven Items
                exhibitRoutes.get(29).add(artifactDescription);
            } else if (artifactDescription.contains("scroll") || artifactDescription.contains("manuscript")) {
                exhibitArtifacts.get(30).add(i); // Scrolls and Manuscripts
                exhibitRoutes.get(30).add(artifactDescription);
            } else if (artifactDescription.contains("coin") || artifactDescription.contains("currency")) {
                exhibitArtifacts.get(31).add(i); // Coins and Currency
                exhibitRoutes.get(31).add(artifactDescription);
            } else if (artifactDescription.contains("painting") || artifactDescription.contains("fresco")) {
                exhibitArtifacts.get(32).add(i); // Paintings and Frescoes
                exhibitRoutes.get(32).add(artifactDescription);
            } else if (artifactDescription.contains("navigation") || artifactDescription.contains("astrolabe")) {
                exhibitArtifacts.get(33).add(i); // Navigation and Astronomical Instruments
                exhibitRoutes.get(33).add(artifactDescription);
            } else if (artifactDescription.contains("medical") || artifactDescription.contains("tool")) {
                exhibitArtifacts.get(34).add(i); // Medical and Tools
                exhibitRoutes.get(34).add(artifactDescription);
            } else if (artifactDescription.contains("map") || artifactDescription.contains("chart")) {
                exhibitArtifacts.get(35).add(i); // Maps and Geographic Artifacts
                exhibitRoutes.get(35).add(artifactDescription);
            }
        }
    }

    /**
     * Creates a new Artifact with the provided parameters
     * @param name
     * @param Type
     * @param engagementTime
     * @return
     */
    private static Artifact createArtifact(String name, String Type, int engagementTime) {
        try {
            return new Artifact(name, Type, engagementTime);
        } catch (Exception e) {
            System.out.println("Bad Data");
            return null;
        }
    }

    /**
     * Creates a new Exhibit with the provided paremters
     * @param name
     * @param artifactsID
     * @param route
     * @return
     */
    private static Exhibit createExhibit(String name, ArrayList<Integer> artifactsID, ArrayList<String> route) {
        try {
            return new Exhibit(name, artifactsID, route);
        } catch (Exception e) {
            System.out.println("Bad Data");
            return null;
        }
    }

    /**
     * Creates an ArrayList of Artifacts using the large artifacts data set above
     * @return
     */
    public static ArrayList<Artifact> populateArtifacts() {
        artifcats = new ArrayList<Artifact>();
        
        for (int i = 0; i < artifactData.length; i++) {
            Artifact artifact = createArtifact(artifactData[i][0], artifactData[i][1],
                    Integer.valueOf(artifactData[i][2]));
            artifcats.add(artifact);
        }
        return artifcats;
    }

    /**
     * Creates an array list of Exhibits using the large dataSet above
     * @return
     */
    public static ArrayList<Exhibit> populateExhibits() {
        exhibits = new ArrayList<Exhibit>();
        exhibitArtifacts = new ArrayList<>();;
        exhibitRoutes = new ArrayList<>();;
        createAllExhibitData();
        for (int i = 0; i < exhibitNames.length; i++) {
            Exhibit exhibit = createExhibit(exhibitNames[i], exhibitArtifacts.get(i), exhibitRoutes.get(i));
            exhibits.add(exhibit);
        }
        return exhibits;
    }

    /**
     * Creates a 2D array of 12x3 filled with the numbers 0-35
     * Matches the exhibit IDs created by populateExhibits
     * @return
     */
    public static int[][] populateExhibitionPlan() {
        int[][] exhibitionPlan = new int[12][3];
        int k = 0;
        for (int i = 0; i < 12; i++) {
            for (int j = 0; j < 3; j++) {
                exhibitionPlan[i][j] = k;
                k++;
            }
        }
        return exhibitionPlan;
    }
}
