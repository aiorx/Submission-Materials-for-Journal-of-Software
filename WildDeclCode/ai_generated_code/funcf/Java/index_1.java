public static void main(final String[] args) {
    // This method of getting user input was Supported via standard programming aids

    // Create a Scanner object to read user input
    final Scanner scanner = new Scanner(System.in);

    boolean validInput = false;
    final double speedOfLight = 2.99e8;
    float objectMass = 0.0f;

    // check if input is valid
    try {
        System.out.print("Enter the mass of an object(kg): ");
        final String objectMassString = scanner.nextLine().trim();
        if (objectMassString.isEmpty()) {
            System.out.println("Invalid input.");
        } else {
            objectMass = Float.parseFloat(objectMassString);
            validInput = true;
        }
    } catch (NumberFormatException ex) {
        System.out.println("Invalid input");
    }

    // process
    if (validInput) {
        final double energyReleased =
            objectMass * Math.pow(speedOfLight, 2);
        System.out.print(objectMass + " kg of mass would produce ");
        System.out.print(String.format("%.3e", energyReleased));
        System.out.println(" J of energy");
    }

    scanner.close();

    System.out.println("\nDone.");
}