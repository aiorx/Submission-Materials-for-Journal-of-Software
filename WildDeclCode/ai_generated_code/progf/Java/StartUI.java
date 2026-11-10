package src.UI;
import static javax.swing.BoxLayout.*;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Image;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

import src.UI.UIComponent.DefaultHeader;

public abstract class StartUI{

    protected static SingletonUiWindow uiWindow = SingletonUiWindow.getInstance();
    protected static final int WIDTH = 300;
    protected static final int HEIGHT = 500;

    protected JTextField txtUsername = new JTextField("");
    protected JPasswordField txtPassword = new JPasswordField("");

    protected JLabel lblPhoto;
    protected JLabel labelUsername = new JLabel("Username    ");
    protected JLabel labelPassword = new JLabel("Password      ");




    protected final DefaultHeader header = new DefaultHeader("🐥 Quackstagram 🐥");

    public StartUI(){
    }

    protected JPanel createProfilePicPanel(){
        JPanel profilePicPanel = new JPanel(); // Use a panel to center the photo label
        profilePicPanel.setLayout(new FlowLayout(FlowLayout.CENTER));

        lblPhoto = new JLabel();
        lblPhoto.setPreferredSize(new Dimension(80, 80));
        lblPhoto.setHorizontalAlignment(JLabel.CENTER);
        lblPhoto.setVerticalAlignment(JLabel.CENTER);
        lblPhoto.setIcon(new ImageIcon(new ImageIcon("img/logos/DACS.png").getImage().getScaledInstance(80, 80, Image.SCALE_SMOOTH)));
        profilePicPanel.add(lblPhoto);

        return profilePicPanel;
    }

    protected JPanel createUsernamePanel(){
        JPanel usernamePanel = new JPanel();
        usernamePanel.setLayout(new BoxLayout(usernamePanel, Y_AXIS));
        usernamePanel.add(labelUsername);
        usernamePanel.add(txtUsername);

        return usernamePanel;

    }

    protected JPanel createPasswordPanel(){
        JPanel passwordPanel = new JPanel();
        passwordPanel.setLayout(new BoxLayout(passwordPanel, Y_AXIS));
        passwordPanel.add(labelPassword);
        passwordPanel.add(txtPassword);

        return passwordPanel;
    }

    //the method below was extracted Derived using common development resources


    protected static String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(password.getBytes());

            // Convert the byte array to a hexadecimal string
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace(); // Handle the exception properly in a production environment
            return null;
        }
    }

    //the method above was extracted Derived using common development resources



}
