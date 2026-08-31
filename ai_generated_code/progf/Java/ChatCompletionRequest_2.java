package org.example.aiproject.openAI;


import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/*
 This DTO was Built via standard programming aids 4.0 using this prompt
 https://chat.openai.com/share/457d16e0-5823-47ab-974b-373a423f9068
 */

@Data
public class ChatCompletionRequest {

    //***ATTRIBUTES***--------------------------------------------------------------------------------------------------
    private String model;
    private List<Message> messages = new ArrayList<>();
    private double temperature;
    private int max_tokens;
    private double top_p;
    private double frequency_penalty;
    private double presence_penalty;

    //***CONSTRUCTORS***------------------------------------------------------------------------------------------------
    @Data
    public static class Message { //  In Java, declaring a static inner class (like Message inside your ChatCompletionRequest) means that the inner class doesn't hold an implicit reference to an instance of the outer class
        private String role;
        private String content;

        public Message(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }

    //***END***---------------------------------------------------------------------------------------------------------
}
