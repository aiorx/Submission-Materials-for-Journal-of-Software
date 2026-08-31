package co.instil.ryana.diamonds.copilot;

/* Supported via standard GitHub programming aids (GPT-4.1)
 * Using the instructions from .github/copilot-instructions.md
 * and resources/diamond-prompt.md
 * I've manually moved it into the copilot package
 */

import org.junit.jupiter.api.Test;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import static org.junit.jupiter.api.Assertions.*;

class ProgramTest {
    @Test
    void printsDiamondOfHeight3() {
        String input = "3\nquit\n";
        String expected =
                "Enter diamond height (odd number) or 'quit':  #\n###\n #\nEnter diamond height (odd number) or 'quit': ";
        assertConsoleOutput(input, expected);
    }

    @Test
    void printsDiamondOfHeight5() {
        String input = "5\nquit\n";
        String expected =
                "Enter diamond height (odd number) or 'quit':   #\n ###\n#####\n ###\n  #\nEnter diamond height (odd number) or 'quit': ";
        assertConsoleOutput(input, expected);
    }

    @Test
    void promptsAgainOnEvenNumber() {
        String input = "4\n3\nquit\n";
        String expected =
                "Enter diamond height (odd number) or 'quit': Enter diamond height (odd number) or 'quit':  #\n###\n #\nEnter diamond height (odd number) or 'quit': ";
        assertConsoleOutput(input, expected);
    }

    @Test
    void promptsAgainOnNonNumber() {
        String input = "hello\n5\nquit\n";
        String expected =
                "Enter diamond height (odd number) or 'quit': Enter diamond height (odd number) or 'quit':   #\n ###\n#####\n ###\n  #\nEnter diamond height (odd number) or 'quit': ";
        assertConsoleOutput(input, expected);
    }

    @Test
    void exitsOnQuit() {
        String input = "quit\n";
        String expected = "Enter diamond height (odd number) or 'quit': ";
        assertConsoleOutput(input, expected);
    }

    private void assertConsoleOutput(String input, String expected) {
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        java.io.InputStream originalIn = System.in;
        System.setIn(in);
        System.setOut(new PrintStream(out));
        try {
            Program.main(new String[]{});
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        assertEquals(expected, out.toString().replace("\r\n", "\n").replace("\r", "\n"));
    }
}

