```java
// Method to check password
public static boolean checkPassword() {
    String password = JOptionPane.showInputDialog(null, "Enter password:");
    if (password == null) {
        return false; //cancell the code when input is false
    }
    //Code refferd Adapted from standard coding samples
    boolean hasSpecialChar = password.matches(".*[!@$%^&*()_\\-+=<>?/{}#~].*");
    boolean hasCapitalLetter = password.matches(".*[A-Z].*");
    boolean hasNumber = password.matches(".*[0-9].*");
    boolean isLengthValid = password.length() >= 8;
    //displays messeges when the conditions are met
    if (!isLengthValid || !hasSpecialChar || !hasCapitalLetter || !hasNumber) {
        JOptionPane.showMessageDialog(null, "Password is not correctly formatted. Please ensure that the password contains at least eight characters, a capital letter, a number, and a special character.");
        return false; //cancell the code when input is false
    } else {
        JOptionPane.showMessageDialog(null, "Password successfully captured");
        return true; //cancell the code when input is true
    }
}
```