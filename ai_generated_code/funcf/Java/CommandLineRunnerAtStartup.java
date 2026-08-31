@Override
public void run(String... args) throws Exception {

    String description = "Engeland, 1912. Aan boord van de Titanic, het grootste passagiersschip ter wereld, wordt een jonge vrouw uit hoge sociale klasse verliefd op een straatarme kunstenaar. Na een dramatische gebeurtenis, begint voor beiden een liefdesverhaal over...";
    Movie titanic = movieRepository.save(new Movie("Titanic", description, LocalDate.of(1998, 1, 7), "James Cameron", Duration.ofMinutes(195)));

    description = "Wetenschapper J. Robert Oppenheimer leidt tijdens de Tweede Wereldoorlog het zeer geheime Manhattanproject, waarvoor hij met een groep wetenschappers de atoombom ontwikkelt. Dit zal voor altijd de loop van de geschiedenis veranderen.";
    Movie oppenheimer = movieRepository.save(new Movie("Oppenheimer", description, LocalDate.of(2023, 7, 19), "Christopher Nolan", Duration.ofMinutes(180)));

    description = "In Elemental City leven lucht-, aarde-, vuur- en waterbewoners in harmonie met elkaar. Maar vuurelement Ember heeft het niet zo gemakkelijk in de stad. Wanneer ze het waterwezen Wade ontmoet, blijken ze toch veel gemeen met elkaar te hebben.";
    Movie elemental = movieRepository.save(new Movie("Elemental", description, LocalDate.of(2023, 6, 14), "Peter Sohn", Duration.ofMinutes(102)));

    description = "Nadat student Peter Parker gebeten wordt door een radioactieve spin, krijgt hij superkrachten. Hij moet snel aan zijn nieuwe kracht wennen, want hij zal het moeten opnemen tegen de maniakale Green Goblin.";
    Movie spiderMan = movieRepository.save(new Movie("Spider-Man", description, LocalDate.of(2002, 6, 26), "Sam Raimi", Duration.ofMinutes(121)));

    description = "In een klein, gezellig dorpje in Midden-Aarde komt een ring met bijzondere krachten toevallig in handen van de hobbit Frodo. Het is een instrument dat Sauron, de duistere heerser van het koninkrijk Mordor, in staat zou stellen de wereld te veroveren.";
    Movie lotr = movieRepository.save(new Movie("The Lord of the Rings: The Fellowship of the Ring", description, LocalDate.of(2001, 12, 19), "Peter Jackson", Duration.ofMinutes(178)));

    description = "Verborgen in een smartphone, is de bruisende stad Textopolis de thuisbasis van alle emoji's. Elke emoji heeft maar één gezichtsuitdrukking, behalve Gene, een uitbundige emoji met meerdere uitdrukkingen.";
    Movie theEmojiMovie = movieRepository.save(new Movie("The Emoji Movie", description, LocalDate.of(2017, 7, 28), "Tony Leondis", Duration.ofMinutes(86)));

    //--- Built using basic development resources

    description = "In de jaren '80 ontdekken een groep kinderen uit het kleine stadje Hawkins een parallelle dimensie, genaamd de Upside Down. Met de hulp van een mysterieus meisje genaamd Eleven, proberen ze een kwaadaardige entiteit te verslaan die hun stad bedreigt.";
    Movie strangerThings = movieRepository.save(new Movie("Stranger Things", description, LocalDate.of(2016, 7, 15), "The Duffer Brothers", Duration.ofMinutes(50 * 8))); // Assuming average season duration.

    description = "Wanneer de jonge leeuwenwelp Simba wordt verbannen uit het koninkrijk na de dood van zijn vader, keert hij jaren later terug om zijn plek als koning van de savanne op te eisen.";
    Movie theLionKing = movieRepository.save(new Movie("The Lion King", description, LocalDate.of(1994, 6, 15), "Roger Allers, Rob Minkoff", Duration.ofMinutes(88)));

    description = "Het verhaal volgt de tiener Marty McFly, die per ongeluk terugreist naar 1955 in een tijdmachine die is uitgevonden door de excentrieke wetenschapper Doc Brown. Hij moet ervoor zorgen dat zijn ouders verliefd worden, anders wordt hij zelf nooit geboren.";
    Movie backToTheFuture = movieRepository.save(new Movie("Back to the Future", description, LocalDate.of(1985, 7, 3), "Robert Zemeckis", Duration.ofMinutes(116)));

    description = "Een piloot wiens leven volledig uit de hand loopt, wordt benaderd om mee te doen aan een elite trainingsprogramma genaamd Top Gun. Daar ontdekt hij de ware betekenis van vriendschap, liefde en verantwoordelijkheid.";
    Movie topGun = movieRepository.save(new Movie("Top Gun", description, LocalDate.of(1986, 5, 16), "Tony Scott", Duration.ofMinutes(110)));

    description = "Een excentrieke chocolatier nodigt vijf kinderen uit om zijn magische fabriek te bezoeken. Tijdens hun rondleiding komen ze unieke lekkernijen en vreemde tests tegen, die hun ware aard onthullen.";
    Movie willyWonka = movieRepository.save(new Movie("Willy Wonka & the Chocolate Factory", description, LocalDate.of(1971, 6, 30), "Mel Stuart", Duration.ofMinutes(100)));

    description = "In een toekomst waarin een dystopische samenleving wordt gecontroleerd door de elite, wordt een jonge vrouw genaamd Katniss Everdeen de symboolfiguur van een revolutionaire beweging om vrijheid en gerechtigheid te herstellen.";
    Movie theHungerGames = movieRepository.save(new Movie("The Hunger Games", description, LocalDate.of(2012, 3, 21), "Gary Ross", Duration.ofMinutes(142)));

    description = "Tijdens een ruimte-expeditie raakt astronaut Mark Watney gestrand op Mars. Hij moet zijn ingenieuze overlevingsvaardigheden gebruiken om contact te maken met de aarde en te wachten op redding.";
    Movie theMartian = movieRepository.save(new Movie("The Martian", description, LocalDate.of(2015, 10, 2), "Ridley Scott", Duration.ofMinutes(144)));

    description = "In een wereld waar dinosaurussen weer tot leven zijn gebracht, raakt een nieuw pretpark volledig in chaos wanneer de dinosaurussen losbreken en de bezoekers in gevaar brengen.";
    Movie jurassicPark = movieRepository.save(new Movie("Jurassic Park", description, LocalDate.of(1993, 6, 11), "Steven Spielberg", Duration.ofMinutes(127)));

    description = "De duistere ridder, Batman, gaat de strijd aan met zijn grootste vijand tot nu toe: de Joker. In een stad die op het randje van chaos balanceert, wordt de grens tussen held en schurk steeds vager.";
    Movie theDarkKnight = movieRepository.save(new Movie("The Dark Knight", description, LocalDate.of(2008, 7, 16), "Christopher Nolan", Duration.ofMinutes(152)));

    description = "Een jonge tovenaarsleerling ontdekt op zijn elfde verjaardag dat hij is voorbestemd om een groot kwaad te verslaan. Hij gaat naar een magische school genaamd Zweinstein en begint zijn avontuur.";
    Movie harryPotter = movieRepository.save(new Movie("Harry Potter and the Philosopher's Stone", description, LocalDate.of(2001, 11, 16), "Chris Columbus", Duration.ofMinutes(152)));

    description = "Wanneer Andy naar de universiteit gaat, worden Woody, Buzz en de andere speelgoedfiguren per ongeluk naar een kinderdagverblijf gestuurd. Daar ontdekken ze dat niet alles is wat het lijkt.";
    Movie toyStory3 = movieRepository.save(new Movie("Toy Story 3", description, LocalDate.of(2010, 6, 16), "Lee Unkrich", Duration.ofMinutes(103)));

    description = "In een tijd van strijd en magie volgt het verhaal de jonge Arthur, die een mystiek zwaard uit een steen trekt en zijn lot als koning vervult, terwijl hij het opneemt tegen donkere krachten.";
    Movie kingArthur = movieRepository.save(new Movie("King Arthur: Legend of the Sword", description, LocalDate.of(2017, 5, 12), "Guy Ritchie", Duration.ofMinutes(126)));

    description = "Een jonge vrouw wordt verliefd op een beestachtige prins die door een vloek in een monster is veranderd. Alleen ware liefde kan de vloek verbreken.";
    Movie beautyAndTheBeast = movieRepository.save(new Movie("Beauty and the Beast", description, LocalDate.of(1991, 11, 13), "Gary Trousdale, Kirk Wise", Duration.ofMinutes(84)));

    description = "In een afgelegen hotel worden een schrijver en zijn gezin geconfronteerd met bovennatuurlijke krachten en een duister verleden. Langzaam verliest de schrijver zijn grip op de werkelijkheid.";
    Movie theShining = movieRepository.save(new Movie("The Shining", description, LocalDate.of(1980, 5, 23), "Stanley Kubrick", Duration.ofMinutes(146)));

    description = "Een geavanceerde robot uit de toekomst reist terug naar het verleden met als missie om een jonge jongen te beschermen die de sleutel is tot de toekomst van de mensheid.";
    Movie terminator2 = movieRepository.save(new Movie("Terminator 2: Judgment Day", description, LocalDate.of(1991, 7, 3), "James Cameron", Duration.ofMinutes(137)));

    description = "Een charmante oplichter en een jonge weesjongen gaan op avontuur om een magische lamp te vinden, waarin een geest huist die drie wensen kan vervullen.";
    Movie aladdin = movieRepository.save(new Movie("Aladdin", description, LocalDate.of(1992, 11, 25), "Ron Clements, John Musker", Duration.ofMinutes(90)));

    description = "Het verhaal van een muzikale familie in Oostenrijk, geleid door een non die gouvernante wordt. Samen overwinnen ze hun angst en weerstand tegen een naderend gevaar tijdens de Tweede Wereldoorlog.";
    Movie theSoundOfMusic = movieRepository.save(new Movie("The Sound of Music", description, LocalDate.of(1965, 3, 2), "Robert Wise", Duration.ofMinutes(172)));

    description = "Wanneer een boer ontdekt dat zijn land op een intergalactische wormgat ligt, begint hij aan een missie door de ruimte om de toekomst van de mensheid veilig te stellen.";
    Movie interstellar = movieRepository.save(new Movie("Interstellar", description, LocalDate.of(2014, 11, 7), "Christopher Nolan", Duration.ofMinutes(169)));


    Reviewer sam = reviewerRepository.save(new Reviewer("SamB19","Sam", "Blondeel", LocalDate.of(2003,7,7)));
    Reviewer joshua = reviewerRepository.save(new Reviewer("Yoshima909","Joshua", "Maddelein", LocalDate.of(2003,2,8)));
    Reviewer bjarne = reviewerRepository.save(new Reviewer("Bjarnold","Bjarne", "De Wit", LocalDate.of(2004,4,4)));
    Reviewer anneLaure = reviewerRepository.save(new Reviewer("Livera","Anne-Laure", "Declerck", LocalDate.of(2005,5,5)));
    Reviewer testGebruiker2 = reviewerRepository.save(new Reviewer("You","Vives", "Test Gebruiker", LocalDate.of(2000,1,1)));
    Reviewer testGebruiker = reviewerRepository.save(new Reviewer("You","Vives", "Test Gebruiker", LocalDate.of(2000,1,1)));

    reviewRepository.save(new Review(sam, theEmojiMovie, 7, "Emoji yay:)"));
    reviewRepository.save(new Review(joshua, oppenheimer, 9, "Best wel banger movie:p"));
    reviewRepository.save(new Review(joshua, theEmojiMovie, 3, "Wat is deze troep?"));
    reviewRepository.save(new Review(joshua, spiderMan, 7, null));
    reviewRepository.save(new Review(joshua, lotr, 10, "Gewoon kijken, nu!"));
    reviewRepository.save(new Review(joshua, elemental, 6, null));
    reviewRepository.save(new Review(bjarne, spiderMan, 6, null));
    reviewRepository.save(new Review(bjarne, lotr, 8, null));
    reviewRepository.save(new Review(bjarne, elemental, 7, null));
    reviewRepository.save(new Review(anneLaure, oppenheimer, 6, null));
    reviewRepository.save(new Review(anneLaure, theEmojiMovie, 4, "Well dat is tijd dat ik nooit meer terug krijg..."));
    reviewRepository.save(new Review(anneLaure, lotr, 10, "Niet kijken, zeer verslavend, 10/10"));

    reviewRepository.save(new Review(sam, titanic, 8, "Een klassieker! Zelfs na al die jaren blijft hij indrukwekkend."));
    reviewRepository.save(new Review(joshua, titanic, 9, "Prachtige film, al moest ik wel een traantje laten."));
    reviewRepository.save(new Review(bjarne, titanic, 7, "Lang, maar toch een mooie kijkervaring."));
    //reviewRepository.save(new Review(anneLaure, titanic, 10, "Romantisch en hartverscheurend. Love it!"));

    reviewRepository.save(new Review(sam, interstellar, 9, "Geweldig visueel spektakel, echt een aanrader!"));
    reviewRepository.save(new Review(joshua, interstellar, 8, "Mind-blowing concept, maar wel wat ingewikkeld."));
    reviewRepository.save(new Review(bjarne, interstellar, 7, "Mooie beelden, maar niet helemaal mijn ding."));
    reviewRepository.save(new Review(anneLaure, interstellar, 9, "Waanzinnig verhaal, kippenvel momenten!"));

    reviewRepository.save(new Review(sam, theDarkKnight, 10, "De perfecte Batman-film, Heath Ledger is legendarisch."));
    reviewRepository.save(new Review(joshua, theDarkKnight, 9, "Actie, diepgang en een epische Joker, wat wil je nog meer?"));
    //reviewRepository.save(new Review(bjarne, theDarkKnight, 8, "Sterke film, maar een beetje overhyped misschien."));
    reviewRepository.save(new Review(anneLaure, theDarkKnight, 10, "Heath Ledger tilt deze film naar een ander niveau."));

    reviewRepository.save(new Review(sam, strangerThings, 9, "Super spannende serie met een geweldige 80s vibe!"));
    reviewRepository.save(new Review(joshua, strangerThings, 8, "Seizoen 1 was top, maar daarna wat wisselend."));
    reviewRepository.save(new Review(bjarne, strangerThings, 7, "Goed, maar soms een beetje te veel van hetzelfde."));
    reviewRepository.save(new Review(anneLaure, strangerThings, 10, "Heerlijk nostalgisch en die kinderen acteren fantastisch!"));

    //reviewRepository.save(new Review(sam, theLionKing, 10, "Een meesterwerk, Hakuna Matata voor het leven."));
    reviewRepository.save(new Review(joshua, theLionKing, 9, "Tijdloos en emotioneel, de muziek blijft iconisch."));
    reviewRepository.save(new Review(bjarne, theLionKing, 8, "Erg mooi, maar de remake had niet gehoeven."));
    reviewRepository.save(new Review(anneLaure, theLionKing, 10, "Mijn jeugd in één film, gewoon prachtig."));

    reviewRepository.save(new Review(sam, backToTheFuture, 9, "Geweldige tijdreisfilm, de humor blijft werken."));
    //reviewRepository.save(new Review(joshua, backToTheFuture, 8, "Klassieker, maar sommige delen voelen wat gedateerd."));
    reviewRepository.save(new Review(bjarne, backToTheFuture, 9, "Heel leuk en creatief, een echte aanrader!"));
    reviewRepository.save(new Review(anneLaure, backToTheFuture, 9, "Michael J. Fox is perfect, wat een avontuur!"));

    reviewRepository.save(new Review(sam, topGun, 8, "Tom Cruise op z’n best, heerlijke actiescènes."));
    reviewRepository.save(new Review(joshua, topGun, 7, "Beetje cheesy, maar die jets zijn cool."));
    //reviewRepository.save(new Review(bjarne, topGun, 7, "Niet helemaal mijn stijl, maar wel vermakelijk."));
    reviewRepository.save(new Review(anneLaure, topGun, 8, "Actie en een beetje romantiek, wat wil je nog meer?"));

    reviewRepository.save(new Review(sam, willyWonka, 9, "Pure fantasie, Gene Wilder is geniaal."));
    reviewRepository.save(new Review(joshua, willyWonka, 8, "Een beetje creepy, maar super creatief."));
    reviewRepository.save(new Review(bjarne, willyWonka, 7, "Leuk, maar niet helemaal mijn ding."));
    reviewRepository.save(new Review(anneLaure, willyWonka, 9, "Betoverend en lekker nostalgisch."));

    //reviewRepository.save(new Review(sam, theHungerGames, 8, "Spannend en origineel, Jennifer Lawrence is top."));
    reviewRepository.save(new Review(joshua, theHungerGames, 7, "Goed, maar soms wat traag."));
    reviewRepository.save(new Review(bjarne, theHungerGames, 8, "De actie is geweldig, het verhaal ook."));
    reviewRepository.save(new Review(anneLaure, theHungerGames, 9, "Intense en meeslepende serie, echt goed gedaan!"));

    reviewRepository.save(new Review(sam, theMartian, 8, "Leuk en grappig, Matt Damon draagt de film."));
    reviewRepository.save(new Review(joshua, theMartian, 9, "Inspirerend en verrassend luchtig voor een survivalfilm."));
    reviewRepository.save(new Review(bjarne, theMartian, 8, "Goed verhaal, maar iets te veel uitleg soms."));
    reviewRepository.save(new Review(anneLaure, theMartian, 8, "Heel vermakelijk en best leerzaam!"));

    reviewRepository.save(new Review(sam, jurassicPark, 10, "Dino's op hun best, blijft een klassieker."));
    reviewRepository.save(new Review(joshua, jurassicPark, 9, "Steven Spielberg weet hoe je spanning bouwt."));
    reviewRepository.save(new Review(bjarne, jurassicPark, 8, "Indrukwekkend, maar sommige effecten zijn wat verouderd."));
    //reviewRepository.save(new Review(