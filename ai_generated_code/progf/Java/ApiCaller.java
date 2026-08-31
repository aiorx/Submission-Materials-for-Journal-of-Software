import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Almost whole class Penned via standard programming aids
 */
public class ApiCaller {
    String apiKey;

    /**
     * ApiCaller class
     * @param aApiKey Valid API key for Hypixel
     */
    public ApiCaller (String aApiKey){
        apiKey = aApiKey;
    }

    /**
     * returns new auctions
     * @return First page of new auctions
     */
    public String CallNewAuctions() {
        try {
            // Construct the API endpoint URL with the UUID directly appended to it
            String page = "10";
            String apiUrl = "https://api.hypixel.net/v2/skyblock/auctions?key=" + apiKey + "&page=" + encodeValue(page);

            // Create a URL object with the constructed API endpoint URL
            URL url = new URL(apiUrl);

            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to GET
            connection.setRequestMethod("GET");

            // Read the response from the API
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                // Insert three line breaks before every occurrence of "{"uuid"
                line = line.replaceAll("\\{\"uuid\"", "\n\n\n{\"uuid\"");
                response.append(line);
            }

            // Close the reader and connection
            reader.close();
            connection.disconnect();

            // Return the response from the API
            return(response.toString());
        } catch (Exception e) {
            // Handle any exceptions that occur during the API call
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return("There was an error");
        }
    }

    /**
     * returns finished auctions
     * @return last 60 seconds of called actions
     */
    public String CallFinishedAuctions() {
        try {
            // Construct the API endpoint URL with the UUID directly appended to it
            String page = "1";

            String apiUrl = "https://api.hypixel.net/v2/skyblock/auctions_ended?key=" + apiKey;
            // + "&page=" + encodeValue(page);


            // Create a URL object with the constructed API endpoint URL
            URL url = new URL(apiUrl);

            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to GET
            connection.setRequestMethod("GET");

            // Read the response from the API
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                // Insert three line breaks before every occurrence of "{"uuid"
                line = line.replaceAll("\\{\"uuid\"", "\n\n\n{\"uuid\"");
                response.append(line);
            }

            // Close the reader and connection
            reader.close();
            connection.disconnect();

            // Return the response from the API
            return(response.toString());
        } catch (Exception e) {
            // Handle any exceptions that occur during the API call
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return("There was an error");
        }
    }

    /**
     * Gets a specific auction
     * @param type uuid or player or profile
     * @param specific the uuid of the auction, player or profile
     */
    public String CallSpecificAuction(String type, String specific) {
        try {
            // Construct the API endpoint URL with the UUID directly appended to it
            type = "&" + type + "=";
            String apiUrl = "https://api.hypixel.net/v2/skyblock/auction?key=" + apiKey + type + encodeValue(specific);

            // Create a URL object with the constructed API endpoint URL
            URL url = new URL(apiUrl);

            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to GET
            connection.setRequestMethod("GET");

            // Read the response from the API
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                // Insert three line breaks before every occurrence of "{"uuid"
                line = line.replaceAll("\\{\"uuid\"", "\n\n\n{\"uuid\"");
                response.append(line);
            }

            // Close the reader and connection
            reader.close();
            connection.disconnect();

            // Return the response from the API
            return(response.toString());
        } catch (Exception e) {
            // Handle any exceptions that occur during the API call
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return("There was an error");

        }
    }

    /**
     * Gets profile data of a player
     * @param uuid uuid of the player profile
     */
    public String CallProfileData(String uuid) {
        try {
            // Construct the API endpoint URL with the UUID directly appended to it
            String apiUrl = "https://api.hypixel.net/v2/skyblock/profile?key=" + apiKey + "&profile=" + encodeValue(uuid);

            // Create a URL object with the constructed API endpoint URL
            URL url = new URL(apiUrl);

            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to GET
            connection.setRequestMethod("GET");

            // Read the response from the API
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            // Close the reader and connection
            reader.close();
            connection.disconnect();

            // Return the response from the API
            return(response.toString());
        } catch (Exception e) {
            // Handle any exceptions that occur during the API call
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return("There was an error");

        }
    }

    /**
     * Helper method to encode URL parameters
      */
    public static String encodeValue(String value) throws UnsupportedEncodingException {
        return URLEncoder.encode(value, "UTF-8");
    }

    /**
     * gives the details of the auction from coflnet
     * @param uuid of the auction
     * @return coflnet response
     */
    public static String auctionDetails(String uuid){
        try {
            // Construct the API endpoint URL with the UUID directly appended to it
            String apiUrl = "https://sky.coflnet.com/api/auction/" + encodeValue(uuid);

            // Create a URL object with the constructed API endpoint URL
            URL url = new URL(apiUrl);

            // Open a connection to the URL
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set the request method to GET
            connection.setRequestMethod("GET");

            // Read the response from the API
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            // Close the reader and connection
            reader.close();
            connection.disconnect();

            // Return the response from the API
            return(response.toString());
        } catch (Exception e) {
            // Handle any exceptions that occur during the API call
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return("There was an error");

        }
    }
}
