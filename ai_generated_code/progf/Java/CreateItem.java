package org.example.Pages.Managers;

import java.awt.GridLayout;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;

import org.example.Data.controllers.Managers;
import org.example.Data.controllers.Managers.PostAddItem;
import org.example.Data.enums.ItemType;

// UI Assisted with basic coding tools
public class CreateItem extends JPanel {
    private JTextField nameField, priceField;
    private JTextArea descriptionArea;
    private JComboBox<Boolean> inStockCombo;
    private JComboBox<ItemType> itemTypeCombo;
    private JButton createButton;

    public CreateItem(Runnable exit) {
        setLayout(new GridLayout(6, 2, 10, 10)); // 6 rows, 2 columns, with 10px horizontal and vertical gap

        // Label and Text Field for Name
        JLabel nameLabel = new JLabel("Name:");
        nameField = new JTextField();

        // Label and Text Area for Description
        JLabel descriptionLabel = new JLabel("Description:");
        descriptionArea = new JTextArea();
        descriptionArea.setLineWrap(true); // Enable text wrapping
        descriptionArea.setWrapStyleWord(true); // Wrap at word boundaries
        JScrollPane descriptionScrollPane = new JScrollPane(descriptionArea); // Add a scroll pane for long text

        // Label and Text Field for Price
        JLabel priceLabel = new JLabel("Price:");
        priceField = new JTextField();

        // Label and Text Field for In Stock
        JLabel inStockLabel = new JLabel("In Stock:");
        inStockCombo = new JComboBox<>(new Boolean[] { false, true });
        inStockCombo.setSelectedItem(false);

        // Label and Combo Box for Type
        JLabel typeLabel = new JLabel("Type:");
        itemTypeCombo = new JComboBox<>(ItemType.values());
        itemTypeCombo.setSelectedItem(ItemType.Food);

        // Create Button
        createButton = new JButton("Create");
        createButton.addActionListener(e -> {
            try {
                var item = getItemDetails();
                Managers.addItem(item);
                exit.run();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(null, "Failed to create item.");
            }
        });

        var exitButton = new JButton("Exit");
        exitButton.addActionListener(e -> exit.run());

        // Add components to the panel
        add(nameLabel);
        add(nameField);
        add(descriptionLabel);
        add(descriptionScrollPane); // Add the scroll pane instead of the text area directly
        add(priceLabel);
        add(priceField);
        add(inStockLabel);
        add(inStockCombo);
        add(typeLabel);
        add(itemTypeCombo);
        add(createButton);
        add(exitButton);
    }

    public PostAddItem getItemDetails() throws Exception {
        String name = nameField.getText();
        var price = Integer.parseInt(priceField.getText());
        var description = descriptionArea.getText();
        var inStock = (Boolean) inStockCombo.getSelectedItem();
        var type = (ItemType) itemTypeCombo.getSelectedItem();
        return new PostAddItem(name, description, price, inStock, type);
    }
}
