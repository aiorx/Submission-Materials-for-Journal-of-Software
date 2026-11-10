package view;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

import database.MusicStore;
import database.UserStorage;
import model.Album;
import model.LibraryModel;
import model.Playlist;
import model.Song;
import model.Song.Rating;
import model.User;

public class View {
	public static void main(String[] args) {
	    UserStorage storage = new UserStorage();
	    MusicStore musicStore = new MusicStore();
	    // Create a single Scanner for the entire program.
	    Scanner scanner = new Scanner(System.in);
	    
	    while (true) {
	        // CREATING ACCOUNT/LOGGING IN
	        User currentUser = authenticateUser(scanner, storage);
	        while (currentUser == null) {
	            System.out.println("Authentication failed. Please Retry.");
	            currentUser = authenticateUser(scanner, storage);
	        }
	    
	        LibraryModel library = currentUser.getLibrary();
	        showCommandMenu();
	        int command = 0;
	    
	        // MENU OPTIONS FOR USER
	        // Use the same scanner instance for commands.
	        while (command != 10) {
	            try {
	                System.out.print("Enter your command (in int): ");
	                command = Integer.valueOf(scanner.nextLine());
	                if (command == 0) {
	                    showCommandMenu();
	                }
	                if (command == 1) {
	                    searchMusicStore(scanner, musicStore);
	                    showCommandMenu();
	                }
	                if (command == 2) {
	                    searchLibrary(scanner, library, musicStore);
	                    showCommandMenu();
	                }
	                if (command == 3) {
	                    addSongToLibrary(scanner, library, musicStore);
	                    showCommandMenu();
	                }
	                if (command == 4) {
	                    removeSongFromLibrary(scanner, library, musicStore);
	                    showCommandMenu();
	                }
	                if (command == 5) {
	                    showItemsInLibrary(scanner, library);
	                    showCommandMenu();
	                }
	                if (command == 6) {
	                    createPlayList(scanner, library);
	                    showCommandMenu();
	                }
	                if (command == 7) {
	                    addOrRemoveSongFromPlaylist(scanner, library);
	                    showCommandMenu();
	                }
	                if (command == 8) {
	                    markSongAsFavorite(scanner, library);
	                    showCommandMenu();
	                }
	                if (command == 9) {
	                    rateSong(scanner, library);
	                    showCommandMenu();
	                }
	                if (command > 10 || command < 0) {
	                    System.out.println("Please enter valid command");
	                }
	                if (command == 10) {
	                    // Updating the user music library and saving the updated user data to database
	                    currentUser.updateLibrary(library);
	                    storage.saveUser(currentUser);
	                    System.out.println("Saving and logging out...");
	                    break;
	                }
	            } catch (Exception e) {
	                e.printStackTrace();
	            }
	        }
	        // The outer loop continues and prompts for authentication again.
	    }
	    // scanner.close(); // You could close it here when exiting the program.
	}

	
    /**
     * Handles user authentication by prompting for login or account creation.
     * @param scanner the Scanner used for user input
     * @param storage the UserStorage instance for loading/creating users
     * @return the authenticated User, or null if authentication fails
     */
    private static User authenticateUser(Scanner scanner, UserStorage storage) {
        System.out.println("\nWelcome! Do you want to:");
        System.out.println("1. Log in");
        System.out.println("2. Create a new account");
        System.out.println("3. Exit Program");
        
        int choice = 0;
        while (true) {
            System.out.print("Enter your command (int): ");
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input, please enter 1 or 2.");
                continue;
            }
            if (choice == 3) {
            	System.out.println("Program closed.");
            	System.exit(1);
            }
            if (choice == 1 || choice == 2) {
                break;
            } else {
                System.out.println("Invalid choice. Please choose 1 for login or 2 for account creation.");
            }
        }
        
        System.out.print("Enter username: ");
        String username = scanner.nextLine().trim();
        System.out.print("Enter password: ");
        String password = scanner.nextLine().trim();
        
        if (choice == 1) {
            User user = storage.loadUser(username, password);
            if (user != null) {
                System.out.println("Login successful!");
            } else {
                System.out.println("Invalid credentials.");
            }
            return user;
        } else { // choice == 2
            boolean created = storage.createUser(username, password);
            if (created) {
                System.out.println("Account created successfully!");
            } else {
                System.out.println("User with that username already exists. Please try logging in.");
                return null;
            }
            return storage.loadUser(username, password);
        }
    }

	
	private static void showCommandMenu() {
		System.out.println( "\n" +
"\n" +
"Welcome to Music Library App!\n" +
"Below are available commands. To call any, please enter the correct index:\n" +
"0. Print the command menu\n" +
"1. Search in Music Store\n" +
"	a. for a song by title\n" +
"	b. for a song by artist\n" +
"	c. for an album by title\n" +
"	d. for an album by artist\n" +
"2. Search/Shuffle in Library\n" +
"	a. for a song by title\n" +
"	b. for a song by artist\n" +
"	c. for a song by genre\n" +
"	d. for an album by title\n" +
"	e. for an album by artist\n" +
"	f. for a playlist by title\n" +
"	g. for a song (Title, Artist, and Album)\n" +
"	h. shuffle songs in library\n" +
"3. Add to library\n" +
"	a. song\n" +
"	b. album (with all the songs)\n" +
"4. Remove from library\n" +
"	a. song\n" +
"	b. album (with all the songs removed)\n" +
"5. Get a list of items from library\n" +
"	a. song titles (any order)\n" +
"	b. artist (any order)\n" +
"	c. albums (any order)\n" +
"	d. playlist (any order)\n" +
"	e. favorite songs (any order) \n" +
"	f. top rated songs (any order)\n" +
"	g. play a song in library\n" +
"	h. get recently played songs\n" +
"	i. get most played songs\n" +
"	j. get genre-based playlists\n" +
"	k. all song ratings (any order)\n" +
"6. Create a playlist\n" +
"7. Add/remove/shuffle songs from playlist\n" +
"8. Mark a song as \"favorite\"\n" +
"9. Rate a song\n" +
"10. Save and Log Out\n" +
"\n");
	}
	
	// COMMAND ONE menu options - The following code was Assisted with basic coding tools.
	// I did make some changes, such as reducing the code duplication by grouping code
	// into their own functions. I also formatted the output to be what was requested
	// in the specifications.
	private static void searchMusicStore(Scanner console, MusicStore musicStore) {
	    int searchChoice = 0;
	    
	    // Keep showing the sub-menu until the user chooses to exit
	    while (searchChoice != 5) {
	        System.out.println("\n" +
"\n" +
"Search in Music Store:\n" +
"1. Search Song By Title\n" +
"2. Search Song By Artist\n" +
"3. Search Album By Title\n" +
"4. Search Album By Artist\n" +
"5. Return to Main Menu\n");

	        System.out.print("Enter your search choice: ");
	        try {
	            searchChoice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-5.");
	            continue;  // re-display the sub-menu
	        }

	        switch (searchChoice) {
case 1:
    {;
    break;
	                System.out.print("Enter the song title: ");
	                String title = console.nextLine();
	                List<Song> foundSongs = musicStore.searchSongByTitle(title);
	                printSongs(foundSongs, String.format("Found these songs with title %s:", title));
	                
	            }
case 2:
    {;
    break;
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                List<Song> foundSongs = musicStore.searchSongByArtist(artist);
	                printSongs(foundSongs, String.format("Found these songs by %s:", artist));

	            }
case 3:
    {;
    break;
	                System.out.print("Enter the album title: ");
	                String albumTitle = console.nextLine();
	                List<Album> foundAlbums = musicStore.searchAlbumByTitle(albumTitle);
	                printAlbum(foundAlbums, albumTitle);
	            }
case 4:
    {;
    break;
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                List<Album> foundAlbums = musicStore.searchAlbumByArtist(artist);
	                printAlbum(foundAlbums, artist);
	            }
case 5:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	                // The while loop will end because searchChoice == 5
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	// Helper method to print song details:
	// 	print the song title, the artist, and the album it’s on
	private static void printSongs(List<Song> foundSongs, String searchTerm) {
		if (foundSongs.isEmpty()) {
            System.out.println("No songs found for title: " + searchTerm);
        } else {
            System.out.println(searchTerm);
            int index = 1;
            for (Song s : foundSongs) {
                System.out.println(String.format("%d. %s by %s (%d streams) - %s", index, 
                		s.getSongTitle(), s.getArtist(), s.getStreamCount(), s.getRating().toString()));
                System.out.println("	Album: " + s.getAlbumTitle() + "\n");
                index ++;
            }
        }
	}
	
	// Helper method to print album details:
	// 	print the album information and a list of the songs in the appropriate order
	private static void printAlbum(List<Album> foundAlbums, String searchTerm) {
		if (foundAlbums.isEmpty()) {
            System.out.println("No albums found for search query: " + searchTerm);
        } else {
            System.out.println("Found albums:\n");
            for (Album a : foundAlbums) {
            	System.out.println("Album Title: " + a.getAlbumTitle());
                System.out.println("Artist:      " + a.getArtist());
                System.out.println("Genre:       " + a.getGenre());
                System.out.println("Year:        " + a.getYear());
                System.out.println("Songs:");
                for (Song s : a.getSongArray()) {
                    System.out.println("  - " + s.getSongTitle());
                }
                System.out.println();
                
            }
        }
	}
	
	// COMMAND TWO menu options - Used the same code structure as above but
	// changed to reflect searching the Library instead of the MusicStore.
	private static void searchLibrary(Scanner console, LibraryModel library, MusicStore store) {
	    int searchChoice = 0;
	    
	    // Keep showing the sub-menu until the user chooses to exit
	    while (searchChoice != 9) {
	        System.out.println("\n" +
"\n" +
"Search in Music Library:\n" +
"1. Search Song By Title\n" +
"2. Search Song By Artist\n" +
"3. Search Song by Genre\n" +
"4. Search Album By Title\n" +
"5. Search Album By Artist\n" +
"6. Search Playlist by Title\n" +
"7. Search for Specific Song\n" +
"8. Shuffle songs in library\n" +
"9. Return to Main Menu\n");

	        System.out.print("Enter your search choice: ");
	        try {
	            searchChoice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-8.");
	            continue;  // re-display the sub-menu
	        }

	        switch (searchChoice) {
case 1:
    {;
    break;
	                System.out.print("Enter the song title: ");
	                String title = console.nextLine();
	                List<Song> foundSongs = library.searchSongByTitle(title);
	                printSongs(foundSongs, String.format("Found these songs with title %s:", title));
	                
	            }
case 2:
    {;
    break;
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                List<Song> foundSongs = library.searchSongByArtist(artist);
	                printSongs(foundSongs, String.format("Found these songs by %s:", artist));

	            }
case 3:
    {;
    break;
	                System.out.print("Enter the genre title: ");
	                String genre = console.nextLine();
	                List<Song> foundSongs = library.searchSongByGenre(genre);
	                printSongs(foundSongs, String.format("Found these songs in genre %s:", genre));
	            }
case 4:
    {;
    break;
	                System.out.print("Enter the album title: ");
	                String albumTitle = console.nextLine();
	                List<Album> foundAlbums = library.searchAlbumByTitle(albumTitle);
	                printAlbum(foundAlbums, albumTitle);
	            }
case 5:
    {;
    break;
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                List<Album> foundAlbums = library.searchAlbumByArtist(artist);
	                printAlbum(foundAlbums, artist);
	            }
case 6:
    {;
    break;
	                System.out.print("Enter the playlist title: ");
	                String playlistTitle = console.nextLine();
	                Optional<Playlist> maybePlaylist = library.searchPlaylistByTitle(playlistTitle);
	                if (maybePlaylist.isEmpty()) {
	                    System.out.println("No playlist with that title. Returning to main menu...");
	                    break; // or return to the sub-menu
	                }

	                // Get the actual playlist
	                Playlist playlist = maybePlaylist.get();
	                List<Song> songs = playlist.getSongArray();
	                if (songs.isEmpty()) {
	                    System.out.println("This playlist has no songs.");
	                    break; // or return to the sub-menu
	                }

	                // Show the user all songs with their indexes
	                System.out.println("Songs in \"" + playlistTitle + "\":");
	                for (int i = 0; i < songs.size(); i++) {
	                    System.out.println(i + ": " + songs.get(i).getSongTitle());
	                }
	            }
case 7:
    {;
    break;
	            	System.out.println("Enter song title: ");
	                String songTitle = console.nextLine().trim();

	                System.out.println("Enter artist: ");
	                String artist = console.nextLine().trim();

	                System.out.println("Enter album title: ");
	                String albumTitle = console.nextLine().trim();
	                
	                Song song = library.searchSong(songTitle, artist, albumTitle);
	                
		             // Display the result
		                if (song != null) {
		                    System.out.println("\nSong found:");
		                    System.out.println(song);
	
		                    // Ask if the user wants to view the album
		                   
		                    System.out.print("\nDo you want to view the album? (yes/no): ");
		                    String response = console.nextLine().trim().toLowerCase();
	
		                    if (response.equals("yes")) {
		                        System.out.println("\nAlbum details:");
		                        
		                        Album foundAlbum = store.searchAlbum(albumTitle, artist);
		                        if (foundAlbum != null) {
		                        	List<Album> albumToPrint = new ArrayList<Album>();
		                        	albumToPrint.add(foundAlbum);
		                        	printAlbum(albumToPrint, "");
		                        	
		                        } else {
		                        	// Should technically never happen
			                        System.out.println("Not Found!");
		                        }
		                        
 
		                    } else {
		                        System.out.println("Exiting...");
		                    }
		                } else {
		                    System.out.println("\nSong not found.");
		                }       
	            	
	            }
case 8:
    {;
    break;
                  System.out.println(String.format("This is the current order of songs in library: "));
                  List<Song> songs = library.getSongs();
                  printSongs(songs, "Current library: ");
                  // Shuffle
                  library.shuffleLibrarySongs();
                  songs = library.getSongs();
                  System.out.println(String.format("This is the new order of songs in library:"));
                  printSongs(songs, "Shuffled library: ");
	            }
case 9:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	                // The while loop will end because searchChoice == 9
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	// COMMAND THREE menu options - Used the same code structure as above but
	// changed to add song to library
	private static void addSongToLibrary(Scanner console, LibraryModel library, MusicStore store) {
		int searchChoice = 0;
	    
	    // Keep showing the sub-menu until the user chooses to exit
	    while (searchChoice != 3) {
	        System.out.println("\n" +
"	\n" +
"Add To Library:\n" +
"   1. A song\n" +
"   2. A whole album\n" +
"   3. Return to Main Menu\n");

	        System.out.print("Enter your search choice: ");
	        try {
	            searchChoice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-3.");
	            continue;  // re-display the sub-menu
	        }

	        switch (searchChoice) {
case 1:
    {;
    break;
	                System.out.print("Enter the song title: ");
	                String title = console.nextLine();
	                System.out.print("Enter the album title: ");
	                String album = console.nextLine();
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                
	                // 'addSong' returns true if added successfully, false if song isn't in the store
	                boolean status = library.addSong(store, title, artist, album);
	                if (status) {
	                    System.out.println(String.format("\"%s\" was added to library successfully!", title));
	                } else {
	                    System.out.println("Fail: Song isn't in the store");
	                }
	                
	            }
case 2:
    {;
    break;
	                System.out.print("Enter the album title: ");
	                String album = console.nextLine();
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                
	                // 'addAlbum' returns true if added successfully, false if album isn't in the store
	                boolean status = library.addAlbum(store, album, artist);
	                if (status) {
	                    System.out.println(String.format("Album \"%s\" was added to library successfully!", album));
	                } else {
	                    System.out.println("Fail: Album isn't in the store");
	                }
	            }
case 3:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	/* The removeSongFromLibrary method was written with the help of ChatGPT.
	 */
	public static void removeSongFromLibrary(Scanner console, LibraryModel library, MusicStore store) {
		int searchChoice = 0;

		while (searchChoice != 3) {
			System.out.println("\nRemove from library:");
		    System.out.println("1. Song");
		    System.out.println("2. Album");
		    System.out.println("3. Return to Main Menu");

		    System.out.print("Enter choice: ");
	    
	        try {
	            searchChoice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-3.");
	            continue;  // re-display the sub-menu
	        }

		    switch (searchChoice) {
case 1:
    {  // Remove a single song;
    break;
		            List<Song> songs = library.getSongs();
		            
		            if (songs.isEmpty()) {
		                System.out.println("No songs available to remove.");
		                return;
		            }
	
		            System.out.println("Songs in library:");
		            for (int i = 0; i < songs.size(); i++) {
		                Song song = songs.get(i);
		                System.out.printf("%d. %s by %s (Album: %s)%n", i + 1, song.getSongTitle(), song.getArtist(), song.getAlbumTitle());
		            }
	
		            System.out.print("Enter the index of the song to remove: ");
		            int index = 0;
		            try {
			            index = Integer.parseInt(console.nextLine().trim());
			        } catch (NumberFormatException e) {
			            System.out.println("Invalid input. Please enter a number 1-" + songs.size());
			            break;  // re-display the sub-menu
			        }
		            
		            if (library.removeSong(index - 1)) {
			            System.out.println("Successfully removed song.");
	                } else {
	                	 System.out.println("Couldn't find the song to remove.");
	                }
		        }
		        case 2-> { // Remove an album (and all its songs)
		            System.out.print("Enter album title: ");
		            String albumTitle = console.nextLine();
	
		            System.out.print("Enter artist name: ");
		            String artistName = console.nextLine();
		            
		            if (library.removeAlbum(albumTitle, artistName)) {
		                System.out.println("Removed album: " + albumTitle + " by " + artistName);
		            } else {
		                System.out.println("No matching album found.");
		            }
		        }
case 3:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	            }
		        default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	    	}
		}
	}
	
	// COMMAND FOUR menu options - Used the same code structure as above but
	// changed to show items in library
	private static void showItemsInLibrary(Scanner console, LibraryModel library) {
		int searchChoice = 0;
	    
	    // Keep showing the sub-menu until the user chooses to exit
	    while (searchChoice != 12) {
	        System.out.println("\n" +
"\n" +
"Add To Library:\n" +
"    1. Get all song titles\n" +
"    2. Get all artist names\n" +
"    3. Get all album titles\n" +
"    4. Get all playlist titles\n" +
"    5. Get all favorite songs \n" +
"    6. Get all top rated songs\n" +
"    7. Get all song ratings\n" +
"    8. Play a song in library\n" +
"    9. Get recently played songs\n" +
"    10. Get most played songs\n" +
"    11. Get genre-based playlists\n" +
"    12. Return to Main Menu\n");
	       

	        System.out.print("Enter your search choice: ");
	        try {
	            searchChoice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-12.");
	            continue;  // re-display the sub-menu
	        }

	        switch (searchChoice) {
case 1:
    {;
    break;
	                String[] songTitles = library.getSongTitles();
	                printItems(songTitles, "song titles");
	            }
case 2:
    {;
    break;
	            	String[] artists = library.getArtists();
	                printItems(artists, "artists");

	            }
case 3:
    {;
    break;
	            	String[] albumTitles = library.getAlbumTitles();
	                printItems(albumTitles, "album titles");

	            }
case 4:
    {;
    break;
	            	String[] playlistTitles = library.getPlaylistTitles();
	                printItems(playlistTitles, "playlist titles");

	            }
case 5:
    {;
    break;
	            	String[] favoriteSongs = library.getFavoriteSongs();
	                printItems(favoriteSongs, "favorite songs");

	            }
case 6:
    {;
    break;
	            	List<Song> topRatedSongs = library.getTopRatedSongs();
	                printSongs(topRatedSongs, "These are top rated songs:");

	            }
case 7:
    {;
    break;
	            	String[] songRatings= library.getSongRatings();
	                printItems(songRatings, "song ratings");

	            }
case 8:
    {;
    break;
	            	System.out.print("Enter the song title: ");
	                String title = console.nextLine();
	                List<Song> foundSongs = library.searchSongByTitle(title);
	                int songChoice = 0;
	                
	                if (foundSongs.size() > 0) {
	                	if (foundSongs.size() > 1) {
	                		printSongs(foundSongs, String.format("Found these songs with title %s:", title));
	                		System.out.println("Which song you want to play (enter the index)?");
		                	songChoice = console.nextInt() - 1;
		                	// keep asking if the input is invalid
	                		while (songChoice < 1 && songChoice > foundSongs.size()) {
	                			System.out.println("Invalid index, please try again.");
	                			songChoice = console.nextInt() - 1;
	                		}
	                	}
	                	Song chosenSong = foundSongs.get(songChoice);
		                playSong(chosenSong, library);
	                
	                } else {
	                	System.out.println(String.format("The song %s is not found anywhere in the library", title));
	                }
	                
	                
	            }
case 9:
    {;
    break;
	            	List<Song> recentSongList= library.getRecentSongs();
	            	Collections.reverse(recentSongList);
	                printSongs(recentSongList, "Recently played songs (most recent -> least recent)");

	            }
case 10:
    {;
    break;
	            	List<Song> mostPlayedSongList= library.getMostPlayedSongs();
	            	Collections.reverse(mostPlayedSongList);
	                printSongs(mostPlayedSongList, "Most played songs (with stream count): ");

	            }
case 11:
    {;
    break;
	            	Map<String, List<Song>> genrePlaylists = library.getGenrePlaylists();
	            	System.out.println("Here's are all genre-based playlists:");
	            	int index = 1;
	            	for (String key: genrePlaylists.keySet()) {
	            		System.out.println(String.format("%d. %s", index, key));
	            		index ++;
	            	}
	            	System.out.println("Enter the name of any genre playlists in here to see the songs:");
	            	String choice = console.nextLine().trim().toLowerCase();
	            	if (genrePlaylists.keySet().contains(choice)) {
	            		List<Song> genrePlaylist = genrePlaylists.get(choice);
	            		printSongs(genrePlaylist, String.format("Songs of genre %s:", choice));
	            	} 
	            	System.out.println("Going back to sub-menu");
	            }
case 12:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	                // The while loop will end because searchChoice == 5
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	// Helper method to print item out as line by line
	private static void printItems(String[] foundItems, String searchTerm) {
		if (foundItems.length == 0) {
            System.out.println(String.format("No  %s found", searchTerm));
        } else {
            System.out.println(String.format("Found %s:", searchTerm));
            int index = 1;
            for (int i=0; i<foundItems.length; i++) {
                System.out.println(index + ". " + foundItems[i]);
                index ++;
            }
        }
	}
	
	// Helper method to display song play and update stream count
	private static void playSong(Song song, LibraryModel library) {
		// Display song play
		System.out.println(String.format("\nListening to %s by %s", song.getSongTitle(), song.getArtist()));
		System.out.println("\n🎶♫ lılılı.ılılı.lılılı.ıllı ♪♬");
		System.out.println("↻      ◁     ||     ▷       ↺");
		// update mostPlayedSongs and recentSongs lists
		library.updateStreamCount(song);
		library.updatePlaylists(song);
	}
	

	
	// COMMAND FIVE menu options- create a song in library. The following again
	// uses the previous format Assisted with basic coding tools, but changes the options to
	// call the respective functions in library and print the correct sub menu
	// corresponding to the main menu.
	private static void createPlayList(Scanner console, LibraryModel library) {
	    int choice = 0;

	    while (choice != 2) {
	        System.out.println("\n" +
"Create a Playlist:\n" +
"1. Create new playlist\n" +
"2. Return to Main Menu\n");

	        System.out.print("Enter your choice: ");
	        try {
	            choice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-2.");
	            continue; // re-display the sub-menu
	        }

	        switch (choice) {
case 1:
    {;
    break;
	                System.out.print("Enter the new playlist name: ");
	                String playlistName = console.nextLine().trim();

	                // 'addPlaylist' returns true if created successfully, false if it already exists
	                boolean created = library.addPlaylist(playlistName);
	                if (created) {
	                    System.out.println("Playlist \"" + playlistName + "\" created!\n");
	                } else {
	                    System.out.println("A playlist with that name already exists!");
	                }
	            }
case 2:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	// COMMAND SIX menu options- add or remove a song from playlist. The following
	// uses the previous format Assisted with basic coding tools, but changes the options to
	// call the respective functions in library and print the correct sub menu
	// corresponding to the main menu.
	private static void addOrRemoveSongFromPlaylist(Scanner console, LibraryModel library) {
	    int choice = 0;

	    while (choice != 4) {
	        System.out.println("\n" +
"\n" +
"Operations for Playlist:\n" +
"1. Add a song to a playlist\n" +
"2. Remove a song from a playlist\n" +
"3. Shuffle the playlist\n" +
"4. Return to Main Menu\n");

	        System.out.print("Enter your choice: ");
	        try {
	            choice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-4.");
	            continue; // re-display the sub-menu
	        }

	        switch (choice) {
case 1:
    {;
    break;
	                System.out.print("Enter the wanted playlist name: ");
	                String playlistName = console.nextLine().trim();
	                System.out.print("Enter the song title: ");
	                String songTitle = console.nextLine().trim();
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine().trim();
	                System.out.print("Enter the album title: ");
	                String albumTitle = console.nextLine().trim();

	                // 'addSongToPlaylist' returns true if added successfully, false if song isn't in the store or playlist doesn't exist
	                boolean added = library.addSongToPlaylist(playlistName, songTitle, artist, albumTitle);
	                if (added) {
	                    System.out.println(String.format("\"%s\" was added successfully to playlist: %s", songTitle, playlistName));
	                } else {
	                    System.out.println("Fail: Song isn't in the store or playlist doesn't exist");
	                }
	            }
	            
case 2:
    {;
    break;
	            	// This part of the code to print out all songs in the playlist was
	            	// generated using ChatGPT.
	            	
	                System.out.print("Enter the playlist name: ");
	                String playlistName = console.nextLine().trim();

	                Optional<Playlist> maybePlaylist = library.searchPlaylistByTitle(playlistName);
	                if (maybePlaylist.isEmpty()) {
	                    System.out.println("No playlist with that title. Returning to main menu...");
	                    break; // or return to the sub-menu
	                }

	                // Get the actual playlist
	                Playlist playlist = maybePlaylist.get();
	                List<Song> songs = playlist.getSongArray();
	                if (songs.isEmpty()) {
	                    System.out.println("This playlist has no songs.");
	                    break; // or return to the sub-menu
	                }

	                // Show the user all songs with their indexes
	                System.out.println("Songs in \"" + playlistName + "\":");
	                for (int i = 0; i < songs.size(); i++) {
	                    System.out.println(i + ": " + songs.get(i).getSongTitle());
	                }

	                // prompt for the index to remove
	                System.out.print("Enter the index of the song to remove: ");
	                int index = Integer.parseInt(console.nextLine().trim());

	                // removeSongFromPlaylist returns true if successful, false if invalid
	                boolean removed = library.removeSongFromPlaylist(playlistName, index);
	                if (removed) {
	                    System.out.printf("Song was removed successfully from playlist: %s%n", playlistName);
	                } else {
	                    System.out.println("Fail: index isn't valid or playlist doesn't exist.");
	                }
	            }
	            
case 3:
    {;
    break;
	            	
	            	System.out.print("Enter the playlist name: ");
	                String playlistName = console.nextLine().trim();

	                Optional<Playlist> maybePlaylist = library.searchPlaylistByTitle(playlistName);
	                if (maybePlaylist.isEmpty()) {
	                    System.out.println("No playlist with that title.");
	                } else {
	                	// Get the actual playlist
		                Playlist playlist = maybePlaylist.get();
		                List<Song> songs = playlist.getSongArray();
		                if (songs.isEmpty()) {
		                    System.out.println("This playlist has no songs.");
		                    break; // or return to the sub-menu
		                }
		                System.out.println(String.format("This is the current order of songs in playlist: %s", playlist.getPlaylistTitle()));
		                printSongs(songs, "Current playlist: ");
		                
		                // after the playlist is shuffled, we need to get the updated playlist
		                playlist = library.shufflePlaylist(playlistName);
		                songs = playlist.getSongArray();
		                System.out.println(String.format("This is the new order of songs in playlist: %s", playlist.getPlaylistTitle()));
		                printSongs(songs, "Shuffled playlist: ");
	                }

	                
	            }

case 4:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	// COMMAND SEVEN menu options - mark a song as favorite. The following code
	// uses the previous format Assisted with basic coding tools, but changes the options to
	// call the respective functions in library and print the correct sub menu
	// corresponding to the main menu.
	private static void markSongAsFavorite(Scanner console, LibraryModel library) {
	    int choice = 0;

	    while (choice != 2) {
	        System.out.println("\n" +
"\n" +
"Available options:\n" +
" 1. Mark a song as favorite\n" +
" 2. Return to Main Menu\n");

	        System.out.print("Enter your choice: ");
	        try {
	            choice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-2.");
	            continue; // re-display the sub-menu
	        }

	        switch (choice) {
case 1:
    {;
    break;
	            	System.out.print("Enter the song title: ");
	                String title = console.nextLine();
	                System.out.print("Enter the album title: ");
	                String album = console.nextLine();
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                
	                // 'markAsFavorite' returns true if marked successfully, false if song isn't in the store or library
	                boolean status = library.markAsFavorite(title, artist, album);
	                if (status) {
	                    System.out.println(String.format("\"%s\" was marked as favorite successfully!", title));
	                } else {
	                    System.out.println("Fail: Song isn't in the store or library");
	                }
	            }
case 2:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	// COMMAND EIGHT menu options - rate a song and show all song raings. The following
	// uses the previous format Assisted with basic coding tools, but changes the options to
	// call the respective functions in library and print the correct sub menu
	// corresponding to the main menu.
	private static void rateSong(Scanner console, LibraryModel library) {
	    int choice = 0;

	    while (choice != 2) {
	        System.out.println("\n" +
"\n" +
"Available options:\n" +
" 1. Rate a song\n" +
" 2. Return to Main Menu\n");

	        System.out.print("Enter your choice: ");
	        try {
	            choice = Integer.parseInt(console.nextLine().trim());
	        } catch (NumberFormatException e) {
	            System.out.println("Invalid input. Please enter a number 1-2.");
	            continue; // re-display the sub-menu
	        }

	        switch (choice) {
case 1:
    {;
    break;
	            	System.out.print("Enter the song title: ");
	                String title = console.nextLine();
	                System.out.print("Enter the album title: ");
	                String album = console.nextLine();
	                System.out.print("Enter the artist name: ");
	                String artist = console.nextLine();
	                showRatingMenu();
	                int ratingChoice = 0;
	                Rating rating = Rating.UNRATED;
	                while (ratingChoice == 0) {
	                	try {
		    	            ratingChoice = Integer.parseInt(console.nextLine().trim());
			                switch (ratingChoice) {
case 1:
    {;
    break;
				                	rating = Rating.ONE_STAR;
				                }
case 2:
    {;
    break;
				                	rating = Rating.TWO_STAR;
				                }
case 3:
    {;
    break;
				                	rating = Rating.THREE_STAR;
				                }
case 4:
    {;
    break;
				                	rating = Rating.FOUR_STAR;
				                }
case 5:
    {;
    break;
				                	rating = Rating.FIVE_STAR;
				                }
				                default -> {
					                System.out.println("You chose a number other than 1-5 so rating is set to UNRATED");
					            }
			                }
		    	        } catch (NumberFormatException e) {
		    	            System.out.println("Invalid input. Please enter a number not a string.");
		    	            showRatingMenu();
		    	            continue;
		    	        }
	                }
	                
	                // 'rateSong' returns true if rated successfully, false if song isn't in the store or library
	                boolean status = library.rateSong(title, artist, album, rating);
	                if (status) {
	                    System.out.println(String.format("\"%s\" was rated %s successfully!", title, rating.toString()));
	                } else {
	                    System.out.println("Fail: Song isn't in the store or library");
	                }
	            }
case 2:
    {;
    break;
	                System.out.println("Returning to Main Menu...");
	            }
	            default -> {
	                System.out.println("Invalid choice. Please try again.");
	            }
	        }
	    }
	}
	
	private static void showRatingMenu() {
		System.out.println("Choose a rating from 1-5: ");
        System.out.println("1. ONE_STAR");
        System.out.println("2. TWO_STAR");
        System.out.println("3. THREE_STAR");
        System.out.println("4. FOUR_STAR");
        System.out.println("5. FIVE_STAR");
        System.out.println("Or enter any other number to set it as UNRATED");
	}
	
}
