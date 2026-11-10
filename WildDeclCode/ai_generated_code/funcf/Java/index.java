```java
public static void main(final String[] args) {
    // This method of getting user input was Supported via standard programming aids

    // Create a Scanner object to read user input
    final Scanner scanner = new Scanner(System.in);

    System.out.print("What length do you want your logs to be?");
    System.out.print("(0.25, 0.5, 1): ");
    final double logLength = scanner.nextDouble();

    final double logWeight = 20.0;
    final double truckMaxWeight = 1100.0;
    final double numberOfLogs = truckMaxWeight / (logWeight * logLength);

    System.out.println("The truck can carry " + numberOfLogs);
    System.out.println(" logs if they are " + logLength + "m long.");
    System.out.println("\nDone.");

    scanner.close();

}
```