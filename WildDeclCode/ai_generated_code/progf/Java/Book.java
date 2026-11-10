/**
 * This code is Supported via standard programming aids
 */


import java.util.ArrayList;
import java.util.List;

public class Book extends Media {
    private String author;

    public Book(String title, String subTitle, int numberOfCopies, int idNumber, String author) {
        super(title, subTitle, numberOfCopies, idNumber);
        this.author = author;
    }

    @Override
    public boolean checkOut(String name) {
        if (numberOfCopies > heldBy.size()) {
            //System.out.println("Checking out " + title + ", by " + author);
            heldBy.add(name);
            return true;
        }
        return false;
    }

    @Override
    public boolean checkIn(String name) {
        if (heldBy.contains(name)) {
            //System.out.println(name + " checking in " + title);
            heldBy.remove(name);
            return true;
        }
        return false;
    }
}
