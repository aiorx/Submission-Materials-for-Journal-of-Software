/*
 Designed via basic programming aids using the following prompt:
"show me the java code to create an editable table.  
Use a jtable for the table. each row of the table will contain an object of type 
Person which consists of a firstname (type String), a lastname (type string) 
and an an attribute "retired" of type boolean."
 */
package csd214.lecture4_1.ex4;

/**
 *
 * @author Chagpt
 */
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

class Person {
    private String firstName;
    private String lastName;
    private boolean retired;

    public Person(String firstName, String lastName, boolean retired) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.retired = retired;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isRetired() {
        return retired;
    }

    public void setRetired(boolean retired) {
        this.retired = retired;
    }
}

public class EditableTableExample {
    public static void main(String[] args) {
        List<Person> personList = new ArrayList<>();
        personList.add(new Person("John", "Doe", false));
        personList.add(new Person("Jane", "Doe", true));

        String[] columnNames = {"First Name", "Last Name", "Retired"};
        Object[][] data = new Object[personList.size()][3];

        for (int i = 0; i < personList.size(); i++) {
            Person person = personList.get(i);
            data[i][0] = person.getFirstName();
            data[i][1] = person.getLastName();
            data[i][2] = person.isRetired();
        }

        DefaultTableModel model = new DefaultTableModel(data, columnNames) {
            @Override
            public Class<?> getColumnClass(int column) {
                if (column == 2) return Boolean.class;
                return String.class;
            }

            @Override
            public boolean isCellEditable(int row, int column) {
                return true; // Make all cells editable
            }
        };

        JTable table = new JTable(model);
        JScrollPane scrollPane = new JScrollPane(table);

        JFrame frame = new JFrame("Editable Table Example");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(scrollPane, BorderLayout.CENTER);
        frame.pack();
        frame.setVisible(true);
    }
}
