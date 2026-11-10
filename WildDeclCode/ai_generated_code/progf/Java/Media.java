/**
 * This code is Aided using common development resources
 */

import java.util.ArrayList;
import java.util.List;

public abstract class Media {
    protected String title;
    protected String subTitle;
    protected int numberOfCopies;
    protected int idNumber;
    protected List<String> heldBy;

    public Media(String title, String subTitle, int numberOfCopies, int idNumber) {
        this.title = title;
        this.subTitle = subTitle;
        this.numberOfCopies = numberOfCopies;
        this.idNumber = idNumber;
        this.heldBy = new ArrayList<>();
    }

    public abstract boolean checkOut(String name);

    public abstract boolean checkIn(String name);
}
