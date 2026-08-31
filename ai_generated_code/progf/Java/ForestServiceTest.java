
package htwberli.webtechProjekt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import htwberli.webtechProjekt.AIMessageRepo;
import htwberli.webtechProjekt.ChatMessagesRepo;
import htwberli.webtechProjekt.messages.AIMessageEntity;
import htwberli.webtechProjekt.messages.ChatMessage;
import htwberli.webtechProjekt.messages.UserMessage;
import htwberli.webtechProjekt.service.ForestService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.Mockito.*;
/**
 * This is a test class for the ForestService class.
 * It includes test cases for various methods in the ForestService class.
 *
 * Supported via standard programming aids.
 */
@SpringBootTest
@ContextConfiguration(classes = ForestService.class)
public class ForestServiceTest {

    @MockBean
    AIMessageRepo aiMessageRepo;

    @Autowired
    ForestService forestService;

    @MockBean
    ChatMessagesRepo chatMessagesRepo;

    /**
     * Test case for retrieving an AIMessageEntity by ID.
     */
    @Test
    @DisplayName("should find message by id")
    public void testGetAIMessageEntity() {
        // Test data
        Long id = 1L;
        AIMessageEntity aiMessageEntity = new AIMessageEntity();
        aiMessageEntity.setId(id);

        // Mock the repository behavior
        when(aiMessageRepo.findById(id)).thenReturn(java.util.Optional.of(aiMessageEntity));

        // Invoke the service method
        AIMessageEntity retrievedMessageEntity = forestService.get(id);

        // Verify the result
        assertEquals(aiMessageEntity, retrievedMessageEntity);
        verify(aiMessageRepo, times(1)).findById(id);
    }

    /**
     * Test case for saving a ChatMessage.
     */
    @Test
    public void testSaveChatMessage() {
        // Test data
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent("Hi");

        // Mock the repository behavior
        when(chatMessagesRepo.save(chatMessage)).thenReturn(chatMessage);

        // Invoke the service method
        ChatMessage savedMessage = forestService.save(chatMessage);

        // Verify the result
        assertEquals(chatMessage, savedMessage);
    }

    /**
     * Test case for deleting a ChatMessage by ID.
     */
    @Test
    public void testDeleteChatMessageById() {
        // Test data
        Long id = 1L;

        // Mock the repository behavior
        doNothing().when(chatMessagesRepo).deleteById(id);

        // Invoke the service method
        forestService.deleteChatMessagesByID(id);

        // Verify the interaction with the repository
        verify(chatMessagesRepo, times(1)).deleteById(id);
    }

    /**
     * Test case for retrieving all ChatMessages.
     */
    @Test
    public void testGetAllChatMessages() {
        // Test data
        List<ChatMessage> chatMessages = new ArrayList<>();

        // Mock the repository behavior
        when(chatMessagesRepo.findAll()).thenReturn(chatMessages);

        // Invoke the service method
        List<ChatMessage> retrievedMessages = forestService.getAllChatMessages();

        // Verify the result
        assertEquals(chatMessages, retrievedMessages);
        verify(chatMessagesRepo, times(1)).findAll();
    }

    /**
     * Test case for saving an AIMessageEntity.
     */
    @Test
    public void testSaveAIMessageEntity() {
        // Test data
        AIMessageEntity aiMessageEntity = new AIMessageEntity();

        // Mock the repository behavior
        when(aiMessageRepo.save(aiMessageEntity)).thenReturn(aiMessageEntity);

        // Invoke the service method
        AIMessageEntity savedMessageEntity = forestService.save(aiMessageEntity);

        // Verify the result
        assertEquals(aiMessageEntity, savedMessageEntity);
        verify(aiMessageRepo, times(1)).save(aiMessageEntity);
    }

    /**
     * Test case for deleting an AIMessageEntity by ID.
     */
    @Test
    public void testDeleteAIMessageEntityById() {
        // Test data
        Long id = 1L;

        // Mock the repository behavior
        doNothing().when(aiMessageRepo).deleteById(id);

        // Invoke the service method
        forestService.deleteAIMessageByID(id);

        // Verify the interaction with the repository
        verify(aiMessageRepo, times(1)).deleteById(id);
    }

    /**
     * Test case for retrieving all AIMessageEntities.
     */
    @Test
    public void testGetAllAIMessages() {
        // Test data
        List<AIMessageEntity> aiMessages = new ArrayList<>();

        // Mock the repository behavior
        when(aiMessageRepo.findAll()).thenReturn(aiMessages);

        // Invoke the service method
        List<AIMessageEntity> retrievedMessages = forestService.getAllAIMessages();

        // Verify the result
        assertEquals(aiMessages, retrievedMessages);
        verify(aiMessageRepo, times(1)).findAll();
    }
}
