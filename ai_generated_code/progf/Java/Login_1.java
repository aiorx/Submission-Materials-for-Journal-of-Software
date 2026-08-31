package org.example.Pages;

import javax.swing.*;

import org.example.Data.controllers.General;

import java.awt.*;
import java.awt.event.*;
import java.util.Optional;

// UI Assisted with basic coding tools
public class Login extends JPanel {
    private JTextField usernameField;
    private JPasswordField passwordField;
    private JButton loginButton;

    public interface LoginFunction {
        void login();
    }

    public Login(LoginFunction login) {
        // Create a panel to hold the components with GridBagLayout
        JPanel mainPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Username Label and Field
        gbc.gridx = 0;
        gbc.gridy = 0;
        mainPanel.add(new JLabel("Username:"), gbc);

        gbc.gridx = 1;
        gbc.gridy = 0;
        gbc.weightx = 1.0;
        usernameField = new JTextField();
        mainPanel.add(usernameField, gbc);

        // Password Label and Field
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.weightx = 0.0;
        mainPanel.add(new JLabel("Password:"), gbc);

        gbc.gridx = 1;
        gbc.gridy = 1;
        gbc.weightx = 1.0;
        passwordField = new JPasswordField();
        mainPanel.add(passwordField, gbc);

        // Login Button
        gbc.gridx = 1;
        gbc.gridy = 2;
        gbc.weightx = 0.0;
        loginButton = new JButton("Login");
        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String username = usernameField.getText();
                String password = new String(passwordField.getPassword());
                Optional<String> token = General.login(username, password);
                if (token.isPresent()) {
                    login.login();
                    usernameField.setText("");
                    passwordField.setText("");
                } else {
                    JOptionPane.showMessageDialog(Login.this, "Invalid username or password. Please try again.");
                    // Clear the password field
                    passwordField.setText("");
                }
            }
        });
        mainPanel.add(loginButton, gbc);

        // Add the main panel to the frame
        add(mainPanel);
    }

}