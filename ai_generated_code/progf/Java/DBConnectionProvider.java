package no.ntnu.idatt1005.model.dao;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;

/** Class for getting a connection to the database for the application. This class was originally
 * made by lecturer Surya Kathayat and modified to fit these applications' specific requirements,
 * such as filepath.
 *
 * @author Therese Synnøve Rondeel, Sigrid Hoel
 */
public class DBConnectionProvider {

  /**
   * URL to the database.
   */
  private final String url;

  /**
   * Database connection provider that contributes to the singleton design pattern.
   */
  private static DBConnectionProvider databaseConnectionProvider;

  /** Constructor for the DBConnectionProvider class. It initializes the url to the database and
   * checks whether the database exists or not. If it doesn't, the createDatabase-method is called
   * to create said database.
   * This method was originally made by Surya Kathayat, but modified to fit this application.
   */
  public DBConnectionProvider() {
    String filePath = "src/main/resources/applicationDB.db";
    Path path = Paths.get(filePath);

    this.url = "jdbc:sqlite:" + filePath;

    if (!Files.exists(path) || path.toFile().length() == 0) {
      createDatabase();
    }
  }

  /** Method for getting a connection to the database. It will throw if there is an error with
   * connecting to said database.
   *
   * @return a connection to the database
   * @throws RuntimeException if the method was not able to get a connection to the database
   */
  public Connection getConnection() throws RuntimeException{
    try {
      return DriverManager.getConnection(url);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /** Method to ensure that the singleton pattern is used, and controls that there won't be
   * several DBConnectionProvider-objects throughout the application that may cause errors.
   * This method was made by Surya.
   *
   * @return instance of the databaseConnectionProvider
   */
  public static DBConnectionProvider instance() {
    if (databaseConnectionProvider == null) {
      databaseConnectionProvider = new DBConnectionProvider();
    }
    return databaseConnectionProvider;
  }

  /** Closes connections to the database, makes sure that resultSets, and statements gets closed
   * properly. This method was made by Surya Kathayat.
   * @param connection the connection to be closed
   * @param preparedStatement the preparedStatement to be closed
   * @param resultSet the resultSet to be closed
   */
  public static void close(
      Connection connection, PreparedStatement preparedStatement, ResultSet resultSet) {
    if (resultSet != null) {
      try {
        resultSet.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
    if (preparedStatement != null) {
      try {
        preparedStatement.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }
    if (connection != null) {
      try {
        connection.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }
    }

  }

  /** Method for creating the database if it is empty or doesn't yet exist. It locates the sql-file
   * and converts it to a String-array through the use of BufferedReader, StringBuilder and the
   * split-method that belongs to the String-class. After this, the sql-statements are executed
   * one by one to create the database. Any errors occuring while doing this are caught. This
   * method was made by the help of GitHub Copilot.
   */
  private void createDatabase() {
    //created with help from AI

    String sqlFilePath = "sql/application.sql";
    StringBuilder sqlScript = new StringBuilder();

    try (BufferedReader reader = new BufferedReader(new FileReader(sqlFilePath))) {
        String line;
        while ((line = reader.readLine()) != null) {
            sqlScript.append(line);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }

    String[] sqlStatements = sqlScript.toString().split(";");

    try (Connection connection = DriverManager.getConnection(url);
         Statement statement = connection.createStatement()) {
        for (String sql : sqlStatements) {
            if (!sql.trim().isEmpty()) {
                statement.execute(sql);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
  }
}

