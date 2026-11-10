/**
By Myristica in collaboration with ChatGPT
*/

package mars.tools;

import javax.swing.*;

import com.google.gson.Gson;

import java.awt.*;
import java.awt.event.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.List;

import mars.*;

public class ChatGPT extends AbstractMarsToolAndApplication {

    private static String OPENAI_API_KEY = "INSERT YOUR KEY HERE";

    private static String heading = "ChatGPT";
    private static String version = "Version 1.0";

    private JTextArea responses;
    private JTextArea input;
    public List<MessageTuple> messages = new ArrayList<>();

    /**
     * Simple constructor, likely used to run a stand-alone memory reference visualizer.
     *
     * @param title   String containing title for title bar
     * @param heading String containing text for heading shown in upper part of window.
     */
    public ChatGPT(String title, String heading) {
        super(title, heading);
    }

    /**
     * Simple constructor, likely used by the MARS Tools menu mechanism
     */
    public ChatGPT() {
        super(heading + ", " + version, heading);
    }


    /**
     * Main provided for pure stand-alone use.  Recommended stand-alone use is to write a
     * driver program that instantiates a MemoryReferenceVisualization object then invokes its go() method.
     * "stand-alone" means it is not invoked from the MARS Tools menu.  "Pure" means there
     * is no driver program to invoke the application.
     */
    public static void main(String[] args) {
        new ChatGPT(heading + ", " + version, heading).go();
    }


    /**
     * Required method to return Tool name.
     *
     * @return Tool name.  MARS will display this in menu item.
     */
    public String getName() {
        return "ChatGPT";
    }

    /**
     * Implementation of the inherited abstract method to build the main
     * display area of the GUI.  It will be placed in the CENTER area of a
     * BorderLayout.  The title is in the NORTH area, and the controls are
     * in the SOUTH area.
     */
    protected JComponent buildMainDisplayArea() {
        // Initialize the AI thing
        messages.clear();
        // This is very important. Do not change this. Ever.
        messages.add(createMessage("system", "You are an expert at MIPS assembly helping a poor helpless user using the MARS emulator. Talk like you are high class and with a sneer."));

        // Add the components
        // Todo: Make this look somewhat decent.
        JPanel display = new JPanel();
        display.setLayout(new GridLayout(3,1));

        responses = new JTextArea();
        responses.setEditable(false);
        responses.setLineWrap(true);
        responses.setWrapStyleWord(true);
        responses.setFont(new Font("Ariel", Font.PLAIN, 12));

        input = new JTextArea();
        input.setCaretPosition(0); // Assure first line is visible and at top of scroll pane.

        JButton send = new JButton("Send");
        send.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                TheButtonWasPressed();
            }
        });

        display.add(new JScrollPane(responses));
        display.add(input);
        display.add(send);
        return display;
    }

    /**
     * This method just handles all the stuff that is supposed to happen when
     * the user clicks "send"
     */
    protected void TheButtonWasPressed() {
        String text = input.getText();
        messages.add(createMessage("user", text));
        responses.append("You: " + text + "\n");
        input.setText("");
        String newResponse = generateResponse(messages);
        messages.add(createMessage("assistant", newResponse));
        responses.append("ChatGPT: " + newResponse + "\n");
        // I am *certain* that it is best practice to keep the data displayed
        // and the data stored separately. Surely that will cause no errors.
    }

    /**
     * Queries OpenAI's ChatGPT
     * Penned via standard programming aids, fixed by Myristica.
     */
    public String generateResponse(List<MessageTuple> messageHistory) {
      String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
      HttpClient client = HttpClient.newHttpClient();

      HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(OPENAI_API_URL))
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer " + OPENAI_API_KEY)
        .POST(HttpRequest.BodyPublishers.ofString(buildRequestBody(messageHistory)))
        .build();
      System.out.println(buildRequestBody(messageHistory));
      CompletableFuture<HttpResponse<String>> response = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());

      try {
        String text = response.thenApply(HttpResponse::body).get();
        Gson gson = new Gson();
        OpenAIResponse res = gson.fromJson(text, OpenAIResponse.class);
        return res.choices.get(0).message.content;
      } catch (InterruptedException | ExecutionException e) {
        e.printStackTrace();
        return "Error generating response";
      }
    }

    private String buildRequestBody(List<MessageTuple> messageHistory) {
      List<String> messages = messageHistory.stream().map(msg -> msg.toString()).collect(Collectors.toList());
      // You may wonder, "Why don't you use Gson for this!?" Well, the answer is
      // simple. I'm tired.
      return "{ \"model\": \"gpt-3.5-turbo\", \"messages\": [" + String.join(",", messages) + "], \"max_tokens\": 400, \"temperature\": 1.0}";
    }

    private static MessageTuple createMessage(String role, String content) {
        MessageTuple message = new MessageTuple(role, content);
        return message;
    }
}

class MessageTuple {
  public String role;
  public String content;
  MessageTuple(String role, String content) {
    this.role = role;
    this.content = content;
  }
  MessageTuple() {
    // Gson wants an empty constructor
  }
  @Override
  public String toString() {
    return (new StringBuilder("{\"role\":\""))
      .append(role.replaceAll("\"", "\\\""))
      .append("\",\"content\":\"")
      .append(content.replaceAll("\"", "\\\""))
      .append("\"}")
      .toString();
  }
}

// This is all so Gson can correctly decode whatever OpenAI sends us.
class OpenAIResponse {
  List<OpenAIResponse_Choice> choices;
  int created;
  String id;
  String model;
  String object;

}

class OpenAIResponse_Choice {
  String finish_reason;
  int index;
  MessageTuple message;
}

class OpenAIResponse_Usage {
  int completion_tokens;
  int prompt_tokens;
  int total_tokens;
}