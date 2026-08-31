import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class IOManagerTest {

    private IOManager ioManager;
    private Scanner scanner;

    @BeforeEach
    public void setUp() {
        scanner = mock(Scanner.class);
        ioManager = new IOManager(scanner);
    }

    @Test
    @DisplayName("Should get the correct command")
    public void testGetCommand() {
        when(scanner.nextLine()).thenReturn("add");

        assertEquals("add", ioManager.getCommand());
    }

    @Test
    @DisplayName("Should get the correct contact details")
    public void testGetContactDetails() {
        when(scanner.nextLine()).thenReturn("John Doe", "foo@bar.com", "07123456789");

        Map<String, String> contactDetails = ioManager.getContactDetails();

        assertAll(
                () -> assertEquals("John Doe", contactDetails.get("name")),
                () -> assertEquals("foo@bar.com", contactDetails.get("email")),
                () -> assertEquals("07123456789", contactDetails.get("phoneNumber"))
        );
    }

    @Test
    @DisplayName("Should get the correct contact ID")
    public void testGetContactID() {
        // Test that getContactID() returns the correct contact ID
        when(scanner.nextLine()).thenReturn("foo@bar.com");

        assertEquals("foo@bar.com", ioManager.getContactID());
    }

    @Test
    @DisplayName("Should get the correct delete confirmation")
    public void testGetDeleteConfirmation() {
        when(scanner.nextLine()).thenReturn("no");

        assertEquals("no", ioManager.getDeleteConfirmation());
    }

    @Test
    @DisplayName("Should only accept yes/no for delete all")
    public void shouldReAskForInvalidConfirmation() {
        when(scanner.nextLine()).thenReturn("maybe", "no");

        assertEquals("no", ioManager.getDeleteConfirmation());
    }

    /*
     * THE FOLLOWING TESTS HAVE BEEN GENERATED USING GITHUB COPILOT!
     */
    @Test
    @DisplayName("Should print the contacts correctly")
    public void testPrintContacts() {
        // Create mock Contacts
        Contact mockContact1 = mock(Contact.class);
        Contact mockContact2 = mock(Contact.class);

        // Add the mock Contacts to a list
        List<Contact> contacts = List.of(mockContact1, mockContact2);

        // Create a stream to hold the output
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));

        // Call the method under test
        ioManager.printContacts(contacts);

        // Verify that printContact was called twice
        String output = outContent.toString();
        int count = output.split("Name:", -1).length - 1;

        assertEquals(2, count);

        // Reset the standard output
        System.setOut(System.out);
    }

    @Test
    @DisplayName("Should print a contact correctly")
    public void testPrintContact() {
        Contact mockContact = mock(Contact.class);
        when(mockContact.getName()).thenReturn("John Doe");
        when(mockContact.getEmail()).thenReturn("foo@bar.com");
        when(mockContact.getPhoneNumber()).thenReturn("07123456789");

        // Create a stream to hold the output
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));

        ioManager.printContact(mockContact);

        String expectedOutput = "Name: John Doe | Phone: 07123456789 | Email: foo@bar.com" + System.lineSeparator();
        assertEquals(expectedOutput, outContent.toString());

        // Reset the standard output
        System.setOut(System.out);
    }

    @Test
    @DisplayName("Should print an error message correctly")
    public void testPrintError() {
        // Create a stream to hold the output
        ByteArrayOutputStream errContent = new ByteArrayOutputStream();
        System.setErr(new PrintStream(errContent));

        // Call the method under test
        ioManager.printError(IOConstants.INVALID_EMAIL);

        // Verify the output
        String expectedOutput = IOConstants.ERROR + IOConstants.INVALID_EMAIL + System.lineSeparator();
        assertEquals(expectedOutput, errContent.toString());

        // Reset the standard error
        System.setErr(System.err);
    }

    @Test
    @DisplayName("Should print the help message correctly")
    public void testPrintHelp() {
        // Create a stream to hold the output
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));

        // Call the method under test
        ioManager.printHelp();

        // Verify the output
        String expectedOutput = IOConstants.HELP_BODY + System.lineSeparator();
        assertEquals(expectedOutput, outContent.toString());

        // Reset the standard output
        System.setOut(System.out);
    }

    @Test
    @DisplayName("Should print a message correctly")
    public void testPrint() {
        // Create a stream to hold the output
        ByteArrayOutputStream outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));

        // Call the method under test
        String message = "Test message";
        ioManager.print(message);

        // Verify the output
        String expectedOutput = message + System.lineSeparator();
        assertEquals(expectedOutput, outContent.toString());

        // Reset the standard output
        System.setOut(System.out);
    }
}