package com.example.elearningfra;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Provides database access methods for the eLearning application.
 */
public class Database {
    private static final String URL = "jdbc:mariadb://localhost:3306/elearningfh";
    private static final String USER = "root";
    private static final String PASSWORD = "2536";
    private static Connection connection;

    /**
     * Establishes and returns a connection to the database.
     * @return the connection to the database
     * @throws SQLException if a database access error occurs
     */
    //Derived using common development resources
    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
        }
        return connection;
    }

    /**
     * Retrieves the module names for a given semester.
     * @param semester the semester number
     * @return a map of module IDs and their corresponding names
     * @throws SQLException if a database access error occurs
     */
    //partly Derived using common development resources
    public static Map<Integer, String> getModuleNames(int semester) throws SQLException {
        Map<Integer, String> moduleNames = new HashMap<>();
        String query = "SELECT modul_id, modul_name FROM modul WHERE semester = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, semester);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                moduleNames.put(rs.getInt("modul_id"), rs.getString("modul_name"));
            }
        }
        return moduleNames;
    }

    /**
     * Retrieves the details of a module given its ID.
     * @param modulId the ID of the module
     * @return the details of the module, or null if not found
     * @throws SQLException if a database access error occurs
     */
    public static ModulDetails getModulDetails(int modulId) throws SQLException {
        String query = "SELECT * FROM modul WHERE modul_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, modulId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new ModulDetails(
                        rs.getInt("modul_id"),
                        rs.getString("modul_name"),
                        rs.getInt("cp"),
                        rs.getInt("dauer"),
                        rs.getString("pruefung"),
                        rs.getInt("semester"),
                        rs.getString("sprache"),
                        rs.getString("koordination"),
                        rs.getString("verfuegbarkeit"),
                        rs.getString("voraussetzung"),
                        rs.getBoolean("vorleistung"),
                        rs.getString("inhalt"),
                        rs.getTimestamp("timestamp_modul")
                );
            }
        }
        return null;
    }

    /**
     * Retrieves the professors for a given module ID.
     * @param modulId the ID of the module
     * @return a list of professors for the module
     * @throws SQLException if a database access error occurs
     */
    public static List<Professor> getProfessorsForModul(int modulId) throws SQLException {
        List<Professor> professors = new ArrayList<>();
        String query = "SELECT p.* FROM professor p JOIN lehrt l ON p.professor_id = l.professor_id WHERE l.modul_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, modulId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                professors.add(new Professor(
                        rs.getInt("professor_id"),
                        rs.getString("nachname"),
                        rs.getString("vorname"),
                        rs.getString("email"),
                        rs.getString("sprechzimmer")
                ));
            }
        }
        return professors;
    }

    /**
     * Retrieves the materials for a given module ID.
     * @param modulId the ID of the module
     * @return a list of materials for the module
     * @throws SQLException if a database access error occurs
     */
    public static List<Material> getMaterialsForModul(int modulId) throws SQLException {
        List<Material> materials = new ArrayList<>();
        String query = "SELECT * FROM material WHERE modul_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, modulId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                materials.add(new Material(
                        rs.getInt("material_id"),
                        rs.getInt("modul_id"),
                        rs.getString("typ"),
                        rs.getString("thema"),
                        rs.getString("beschreibung"),
                        rs.getString("url")
                ));
            }
        }
        return materials;
    }

    /**
     * Retrieves the timestamp for a given semester.
     * @param semester the semester number
     * @return the timestamp of the semester
     * @throws SQLException if a database access error occurs
     */
    public static java.sql.Timestamp getTimestamp(int semester) throws SQLException {
        String query = "SELECT timestamp_value FROM timestamp WHERE semester = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, semester);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getTimestamp("timestamp_value");
            }
        }
        return null;
    }

    /**
     * Retrieves the timestamp for a given module ID.
     * @param modulId the ID of the module
     * @return the timestamp of the module
     * @throws SQLException if a database access error occurs
     */
    public static java.sql.Timestamp getModulTimestamp(int modulId) throws SQLException {
        String query = "SELECT timestamp_modul FROM modul WHERE modul_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, modulId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getTimestamp("timestamp_modul");
            }
        }
        return null;
    }

    /**
     * Deletes a module given its ID.
     * @param modulId the ID of the module to delete
     * @throws SQLException if a database access error occurs
     */
    public static void deleteModule(int modulId) throws SQLException {
        String query = "DELETE FROM modul WHERE modul_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, modulId);
            stmt.executeUpdate();
        }
    }

    /**
     * Adds a new module to the database.
     * @param moduleName the name of the module
     * @param cp the credit points of the module
     * @param pruefung the exam type of the module
     * @param semester the semester number of the module
     * @param sprache the language of the module
     * @param koordination the coordination of the module
     * @param verfuegbarkeit the availability of the module
     * @param voraussetzung the prerequisites of the module
     * @param vorleistung whether the module requires prior performance
     * @param inhalt the content of the module
     * @throws SQLException if a database access error occurs
     */
    public static void addModule(String moduleName, int cp, String pruefung, int semester, String sprache, String koordination, String verfuegbarkeit, String voraussetzung, boolean vorleistung, String inhalt) throws SQLException {
        String query = "INSERT INTO modul (modul_name, cp, pruefung, semester, sprache, koordination, verfuegbarkeit, voraussetzung, vorleistung, inhalt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setString(1, moduleName);
            stmt.setInt(2, cp);
            stmt.setString(3, pruefung);
            stmt.setInt(4, semester);
            stmt.setString(5, sprache);
            stmt.setString(6, koordination);
            stmt.setString(7, verfuegbarkeit);
            stmt.setString(8, voraussetzung);
            stmt.setBoolean(9, vorleistung);
            stmt.setString(10, inhalt);
            stmt.executeUpdate();
        }
    }

    /**
     * Updates an existing module in the database.
     * @param modulId the ID of the module to update
     * @param moduleName the new name of the module
     * @param cp the new credit points of the module
     * @param pruefung the new exam type of the module
     * @param semester the new semester number of the module
     * @param sprache the new language of the module
     * @param koordination the new coordination of the module
     * @param verfuegbarkeit the new availability of the module
     * @param voraussetzung the new prerequisites of the module
     * @param vorleistung the new prior performance requirement of the module
     * @param inhalt the new content of the module
     * @throws SQLException if a database access error occurs
     */
    public static void updateModule(int modulId, String moduleName, int cp, String pruefung, int semester, String sprache, String koordination, String verfuegbarkeit, String voraussetzung, boolean vorleistung, String inhalt) throws SQLException {
        String query = "UPDATE modul SET modul_name = ?, cp = ?, pruefung = ?, semester = ?, sprache = ?, koordination = ?, verfuegbarkeit = ?, voraussetzung = ?, vorleistung = ?, inhalt = ? WHERE modul_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setString(1, moduleName);
            stmt.setInt(2, cp);
            stmt.setString(3, pruefung);
            stmt.setInt(4, semester);
            stmt.setString(5, sprache);
            stmt.setString(6, koordination);
            stmt.setString(7, verfuegbarkeit);
            stmt.setString(8, voraussetzung);
            stmt.setBoolean(9, vorleistung);
            stmt.setString(10, inhalt);
            stmt.setInt(11, modulId);
            stmt.executeUpdate();
        }
    }

    /**
     * Retrieves all module names.
     * @return a map of module IDs and their corresponding names
     * @throws SQLException if a database access error occurs
     */
    public static Map<Integer, String> getAllModuleNames() throws SQLException {
        Map<Integer, String> moduleNames = new HashMap<>();
        String query = "SELECT modul_id, modul_name FROM modul";
        try (Statement stmt = getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                moduleNames.put(rs.getInt("modul_id"), rs.getString("modul_name"));
            }
        }
        return moduleNames;
    }

    /**
     * Retrieves the last inserted module ID.
     * @return the ID of the last inserted module, or -1 if not found
     * @throws SQLException if a database access error occurs
     */
    public static int getLastInsertedModuleId() throws SQLException {
        String query = "SELECT LAST_INSERT_ID() AS last_id";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("last_id");
            }
        }
        return -1;
    }

    /**
     * Adds a new professor and links them to a module.
     * @param professor the professor to add
     * @param moduleId the ID of the module to link the professor to
     * @throws SQLException if a database access error occurs
     */
    public static void addProfessor(Professor professor, int moduleId) throws SQLException {
        String query = "INSERT INTO professor (nachname, vorname, email, sprechzimmer) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = getConnection().prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, professor.getNachname());
            stmt.setString(2, professor.getVorname());
            stmt.setString(3, professor.getEmail());
            stmt.setString(4, professor.getSprechzimmer());
            stmt.executeUpdate();

            ResultSet generatedKeys = stmt.getGeneratedKeys();
            if (generatedKeys.next()) {
                int professorId = generatedKeys.getInt(1);
                linkProfessorToModule(professorId, moduleId);
            }
        }
    }

    /**
     * Links a professor to a module.
     * @param professorId the ID of the professor
     * @param moduleId the ID of the module
     * @throws SQLException if a database access error occurs
     */
    //Derived using common development resources
    private static void linkProfessorToModule(int professorId, int moduleId) throws SQLException {
        String query = "INSERT INTO lehrt (professor_id, modul_id) VALUES (?, ?)";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, professorId);
            stmt.setInt(2, moduleId);
            stmt.executeUpdate();
        }
    }

    /**
     * Adds a new material to a module.
     * @param material the material to add
     * @param moduleId the ID of the module to link the material to
     * @throws SQLException if a database access error occurs
     */
    public static void addMaterial(Material material, int moduleId) throws SQLException {
        String query = "INSERT INTO material (modul_id, typ, thema, beschreibung, url) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, moduleId);
            stmt.setString(2, material.getTyp());
            stmt.setString(3, material.getThema());
            stmt.setString(4, material.getBeschreibung());
            stmt.setString(5, material.getUrl());
            stmt.executeUpdate();
        }
    }

    /**
     * Deletes a professor given their ID.
     * @param professorId the ID of the professor to delete
     * @throws SQLException if a database access error occurs
     */
    public static void deleteProfessor(int professorId) throws SQLException {
        String query = "DELETE FROM professor WHERE professor_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, professorId);
            stmt.executeUpdate();
        }
    }

    /**
     * Deletes a material given its ID.
     * @param materialId the ID of the material to delete
     * @throws SQLException if a database access error occurs
     */
    public static void deleteMaterial(int materialId) throws SQLException {
        String query = "DELETE FROM material WHERE material_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setInt(1, materialId);
            stmt.executeUpdate();
        }
    }

    /**
     * Validates a user given their username and password.
     * @param username the username of the user
     * @param password the password of the user
     * @return true if the user is valid, false otherwise
     * @throws SQLException if a database access error occurs
     */
    public static boolean validateUser(String username, String password) throws SQLException {
        String query = "SELECT * FROM benutzer WHERE benutzername = ? AND passwort = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }
    }

    /**
     * Updates an existing professor in the database.
     * @param professor the professor to update
     * @throws SQLException if a database access error occurs
     */
    public static void updateProfessor(Professor professor) throws SQLException {
        String query = "UPDATE professor SET nachname = ?, vorname = ?, email = ?, sprechzimmer = ? WHERE professor_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setString(1, professor.getNachname());
            stmt.setString(2, professor.getVorname());
            stmt.setString(3, professor.getEmail());
            stmt.setString(4, professor.getSprechzimmer());
            stmt.setInt(5, professor.getProfessorId());
            stmt.executeUpdate();
        }
    }

    /**
     * Updates an existing material in the database.
     * @param material the material to update
     * @throws SQLException if a database access error occurs
     */
    public static void updateMaterial(Material material) throws SQLException {
        String query = "UPDATE material SET typ = ?, thema = ?, beschreibung = ?, url = ? WHERE material_id = ?";
        try (PreparedStatement stmt = getConnection().prepareStatement(query)) {
            stmt.setString(1, material.getTyp());
            stmt.setString(2, material.getThema());
            stmt.setString(3, material.getBeschreibung());
            stmt.setString(4, material.getUrl());
            stmt.setInt(5, material.getMaterialId());
            stmt.executeUpdate();
        }
    }
}
