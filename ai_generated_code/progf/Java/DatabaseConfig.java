package dp.assignments.ovchip.database;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DatabaseConfig {
    private static final Properties properties = new Properties();

    static {
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input == null) {
                System.out.println("Sorry, unable to find db.properties");
                System.exit(1);
            }

            properties.load(input);
        } catch (IOException e) {
            System.err.println("IOException occurred while loading db.properties: " + e.getMessage());
        }

        // Try catch Supported via standard programming aids.
        try {
            Class.forName(properties.getProperty("db.driver"));
        } catch (ClassNotFoundException e) {
            System.err.println("JDBC Driver class not found: " + e.getMessage());
        }
    }

    public static String getDbUrl() {
        return properties.getProperty("db.url");
    }

    public static String getDbUsername() {
        return properties.getProperty("db.username");
    }

    public static String getDbPassword() {
        return properties.getProperty("db.password");
    }
}