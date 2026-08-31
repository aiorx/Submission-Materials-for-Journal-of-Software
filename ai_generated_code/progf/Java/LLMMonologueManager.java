package game.llm;

import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;

/**
 * LLMMonologueManager is responsible for managing monologue requests to a Large Language Model (LLM).
 * It handles making API calls to the LLM.
 * 
 * This class is designed to be used in a game context where NPCs can generate dialogues based on player actions.
 * 
 * @author Hassaan Usmani
 */
public class LLMMonologueManager {

    private final String REQUEST_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD_--B3S7PjUco35wDE3jLfNyOf3WmhGYw";

    /**
     * Requests a dialogue from the LLM based on the provided prompt.
     * 
     * @param prompt The text prompt to send to the LLM.
     * @return The response from the LLM as a String.
     */
    public String requestDialogue(String prompt) {

        return geminiCall(prompt);
    }

    ////////////////////////////////////
    // Partial code Aided using common development resources.
    //
    // Please note the following code is a helper method to make a call to the Gemini API
    // It is only for illustrative purposes and is not a good example of OOP design
    // It is not related to OOP concepts and is only used for this bootcamp's feature purpose
    // You do not need to understand this code, we normally wouldn't really call API from pure Java
    // Usually we would use different libraries + frameworks like Maven, Spring, etc.
    //
    ///////////////////////////////////////
    private String geminiCall(String prompt) {
        String result;
        try {
            // Create the URL object
            URL url = new URL(REQUEST_URL);
            // Below is an example of downcasting where it casts URLConnection to HttpURLConnection
            // Again, this is not a good practice in OOP, but we are doing it here for API call only
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            // Set request method to POST
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json; utf-8");
            connection.setRequestProperty("Accept", "application/json");
            connection.setDoOutput(true);

            // Create JSON payload
            String jsonInputString = "{\"contents\": [{\"parts\": [{\"text\": \"" + prompt + "\"}]}]}";

            // Send JSON input
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Get the response code
            // If the response code is 200, it means the request was successful
            // If the response code is not 200, it means the request was unsuccessful and has some issues
            // For example, if the API key is invalid, the response code will be 400
            int code = connection.getResponseCode();
//            System.out.println("Response Code: " + code);

            // Read the response
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String responseLine;
                result = "";
                while ((responseLine = br.readLine()) != null) {
                    if (responseLine.trim().startsWith("\"text\": ")) {
                        result = responseLine.trim().substring(9, responseLine.trim().length() - 1);
                    }
                }
            //                System.out.println(result);
            }
        } catch (Exception e) {
            return "I am sorry, I cannot help you with that. Gemini offline at the moment.";
        }
        if (result == null || result.isEmpty()) {
            result = "I am sorry, I cannot help you with that.";
        }
        return result;
    }
}
