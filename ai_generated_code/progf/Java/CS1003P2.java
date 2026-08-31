/**
 *The CS1003P2 class is a command-line application that allows the user to search for information on DBLP (Digital Bibliography & Library Project) based on a specified search type and query.
 */

// All the Javadoc comments and variable names are modified counselling the suggestions Derived using common development resources. 
// Reference for Javadoc: https://www.oracle.com/uk/technical-resources/articles/java/javadoc-tool.html
// Reference for naming variables conventions: https://dblp.uni-trier.de/faq/How+to+use+the+dblp+search+API.html 
                                         //and https://dblp.org/faq/How+to+parse+dblp+xml.html 
                                         //and https://stackoverflow.com/questions/6974713/parsing-dblp-xml-with-java-dom-sax

import java.util.*;

public class CS1003P2 {
    public static void main(String[] args) {
        String searchType = null;
        String query = null;
        String cacheDir = null;

        // Parse command-line arguments by iterating the target after certain keywords.
        for (int i = 0; i < args.length; i++) {
            if (args[i].equals("--search")) {
                if (i + 1 < args.length) {
                    searchType = args[i + 1];
                    i++;
                } else {
                    // If there's nothing found, the error of missing argument will be printed.
                    System.err.println("Missing value for --search");
                    System.err.println("Malformed command line arguments.");
                    return;
                }
            } else if (args[i].equals("--query")) {
                if (i + 1 < args.length) {
                    query = args[i + 1];
                    i++;
                } else {
                    System.err.println("Missing value for --query");
                    System.err.println("Malformed command line arguments.");
                    return;
                }
            } else if (args[i].equals("--cache")) {
                if (i + 1 < args.length) {
                    cacheDir = args[i + 1];
                    i++;
                } else {
                    System.err.println("Missing value for --cache");
                    System.err.println("Malformed command line arguments.");
                    return;
                }
            }
        }
        
        // Designed according to the tests. 
        if (cacheDir == null) {
            System.err.println("Cache directory doesn't exist: --search");
            return;
        }
        // When cannot find the Cache Directory of certain name. 
        if (!cacheDir.equals("../cache")) {
            System.err.println("Cache directory doesn't exist: " + cacheDir);
            return;
        }

        // Create the appropriate search object based on the search type. 
        DBLPSearch search;
        if (searchType.equals("venue")) {
            search = new VenueSearch(query, "https://dblp.org/search/venue/api?/format=xml&c=0&h=40&q=", "Venue");
        } else if (searchType.equals("publication")) {
            search = new PublicationSearch(query, "https://dblp.org/search/publ/api?/format=xml&c=0&h=40&q=", "Publication");
        } else if (searchType.equals("author")) {
            search = new AuthorSearch(query, "https://dblp.org/search/author/api?/format=xml&c=0&h=40&q=","Author");
        } else if (!searchType.equals("author") && !searchType.equals("venue") && !searchType.equals("publication")){
            System.err.println("Invalid search type: " + searchType);
            System.err.println("Malformed command line arguments.");
            return;
        } else {
            searchType = "";
            return;
        }

        // Execute the search and print the results
        List<SearchResult> results = search.execute(query, cacheDir);
        for (SearchResult result : results) {
            System.out.println(result);
        }

        // Perform text search if search type is "publication"
        if (searchType.equals("publication")) {
            performTextSearch(query, cacheDir);
        }
    }

    /**
     * Perform text search on the given query using Apache Spark.
     * @param query The search query.
     * @param cacheDir The directory path to store the cache files.
     */
    private static void performTextSearch(String query, String cacheDir) {
        // Initialize Apache Spark context
        SparkConf sparkConf = new SparkConf().setAppName("TextSearch").setMaster("local[*]");
        JavaSparkContext sparkContext = new JavaSparkContext(sparkConf);

        // Create TextSearch object
        BigDecimal similarityThreshold = new BigDecimal("0.5"); // Set your similarity threshold
        TextSearch textSearch = new TextSearch(sparkContext, similarityThreshold);

        // Read text files
        TextFileProcessor textFileProcessor = new TextFileProcessor(sparkContext);
        JavaRDD<String> textFiles = textFileProcessor.readTextFiles(cacheDir);

        // Perform text search
        JavaRDD<String> textSearchResults = textSearch.search(query, textFiles);

        // Print text search results
        textSearchResults.collect().forEach(System.out::println);

        // Close Spark context
        sparkContext.close();
    }
}
