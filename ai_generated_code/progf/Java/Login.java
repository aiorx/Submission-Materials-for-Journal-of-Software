 package com.mycompany.chatapp;

/**
 * The Login class handles user registration, including validation for username,
 * password, and cellphone number formats.
 * 
 * Regex and validation logic in this class were assisted/Supported via standard programming aids (OpenAI).
 */
public class Login {
    private String firstname;
    private String username;
    private String password;
    private String cellNumber;
    private final String lastname;

    // Constructor
    public Login(String firstname, String lastname, String username, String password, String cellNumber) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.password = password;
        this.cellNumber = cellNumber;
    }

    // Getter for firstname
    public String getFirstname() {
        return firstname;
    }

    // Getter for lastname
    public String getLastname() {
        return lastname;
    }

    // Getter for username
    public String getUsername() {
        return username;
    }

    // Setter for username
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Checks if the username contains an underscore and is no more than 5 characters long.
     * @return true if valid, false otherwise
     */
    public boolean checkUsernameFormat() {
        return username.contains("_") && username.length() <= 5;
    }

    /**
     * Checks if the password meets complexity rules:
     * - At least 8 characters
     * - Contains uppercase, lowercase, number, and special character
     * @param password The password to validate
     * @return true if complex, false otherwise
     */
    public static boolean isPasswordComplex(String password) {
        return password.length() >= 8 &&
               password.matches(".*[A-Z].*") &&
               password.matches(".*[a-z].*") &&
               password.matches(".*\\d.*") &&
               password.matches(".*[!@#$%^&*()].*");
    }

    /**
     * Validates if the cellphone number starts with '0' and has exactly 10 digits.
     * @param regcell The cellphone number to validate
     * @return true if valid, false otherwise
     */
    public boolean checkCellphoneNumber(String regcell) {
        // Regex pattern generated with the help of ChatGPT (OpenAI)
        return regcell.matches("^0\\d{9}$");
    }

    /**
     * Performs all registration checks and returns appropriate message.
     * @return Success or error message
     */
    public String registerUser() {
        System.out.println("NOTE: Validation rules generated with assistance from ChatGPT (OpenAI).");

        if (!checkUsernameFormat()) {
            return "Username not correctly formatted. Please ensure that your username contains an underscore and is no more than 5 characters long.";
        }

        if (!isPasswordComplex(password)) {
            return "Password is not correctly formatted. It must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.";
        }

        if (!checkCellphoneNumber(cellNumber)) {
            return "Cellphone number is incorrectly formatted. It should start with '0' and be 10 digits long.";
        }

        return "Registration successful!";
    }
}


