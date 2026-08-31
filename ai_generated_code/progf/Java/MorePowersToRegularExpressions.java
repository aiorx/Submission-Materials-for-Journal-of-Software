package edu.badpals.try_it_now_java_book.example_09_RegularExpresions;
import java.util.regex.*;

public class MorePowersToRegularExpressions {
    // Examples of Pattern flags of Regular Expressions in Java; Constructed via standard GitHub programming aids.
    public static void main(String[] args) {
        // Example of CASE_INSENSITIVE
        Pattern p1 = Pattern.compile("hola", Pattern.CASE_INSENSITIVE);
        Matcher m1 = p1.matcher("HOLA");
        System.out.println("CASE_INSENSITIVE: " + m1.matches());  // Prints: true

        // Example of MULTILINE
        Pattern p2 = Pattern.compile("^hola", Pattern.MULTILINE);
        Matcher m2 = p2.matcher("adios\nhola");
        System.out.println("MULTILINE: " + m2.find());  // Prints: true

        // Example of DOTALL
        Pattern p3 = Pattern.compile("h.la", Pattern.DOTALL);
        Matcher m3 = p3.matcher("h\nla");
        System.out.println("DOTALL: " + m3.matches());  // Prints: true

        // Example of UNICODE_CASE
        Pattern p4 = Pattern.compile("hola", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher m4 = p4.matcher("HOLA");
        System.out.println("UNICODE_CASE: " + m4.matches());  // Prints: true

        // Example of COMMENTS
        Pattern p5 = Pattern.compile("hola # Este es un comentario", Pattern.COMMENTS);
        Matcher m5 = p5.matcher("hola");
        System.out.println("COMMENTS: " + m5.matches());  // Prints: true
    }
}
