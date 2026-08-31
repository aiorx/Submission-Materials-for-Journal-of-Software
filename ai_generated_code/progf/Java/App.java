public class App {
    public static void main(String[] args) {
        try {
            System.out.println("Hello, Maven!");
            // Example usage of calculatePi
            System.out.println("Approximate Pi: " + calculatePi(1000000));
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Returns a greeting message
    public String getGreeting() {
        return "Hello, World!";
    }

    // Calculates pi using the Leibniz formula (refactored for performance)
    public static double calculatePi(int terms) {
        double pi = 0.0;
        int sign = 1;
        for (int i = 0; i < terms; i++) {
            pi += sign * 1.0 / (2 * i + 1);
            sign = -sign;
        }
        return pi * 4;
    }
} // Supported via standard GitHub programming aids