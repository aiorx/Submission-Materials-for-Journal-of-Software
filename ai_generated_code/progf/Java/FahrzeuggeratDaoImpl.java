package de.htwberlin.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import de.htwberlin.object.Fahrzeuggerat;

/**
 * JavaDoc Aided using common development resources
 * The FahrzeuggeratDaoImpl class implements the FahrzeuggeratDao interface
 * and provides methods to access and manipulate Fahrzeuggerat objects in the database.
 */
public class FahrzeuggeratDaoImpl implements FahrzeuggeratDao {
    private Connection connection;

    /**
     * Constructs a new FahrzeuggeratDaoImpl with the specified database connection.
     *
     * @param connection The database connection.
     */
    public FahrzeuggeratDaoImpl(Connection connection) {
        this.connection = connection;
    }

    /**
     * Retrieves all Fahrzeuggerat objects from the database.
     *
     * @return A list of all Fahrzeuggerat objects.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public List<Fahrzeuggerat> getAllFahrzeuggerat() throws SQLException {
        List<Fahrzeuggerat> fahrzeuggeratList = new ArrayList<>();

        String query = "SELECT * FROM FAHRZEUGGERAT";
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                Fahrzeuggerat fahrzeuggerat = extractFahrzeuggeratFromResultSet(rs);
                fahrzeuggeratList.add(fahrzeuggerat);
            }
        }

        return fahrzeuggeratList;
    }

    /**
     * Retrieves a Fahrzeuggerat object by its FZG_ID.
     *
     * @param fzgId The FZG_ID of the Fahrzeuggerat.
     * @return The Fahrzeuggerat object.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public Fahrzeuggerat getFahrzeuggeratByFzgId(long fzgId) throws SQLException {
        String query = "SELECT * FROM FAHRZEUGGERAT WHERE FZG_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setLong(1, fzgId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return extractFahrzeuggeratFromResultSet(rs);
                }
            }
        }

        return null;
    }

    /**
     * Retrieves a Fahrzeuggerat object by its FZ_ID.
     *
     * @param fzId The FZ_ID of the Fahrzeuggerat.
     * @return The Fahrzeuggerat object.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public Fahrzeuggerat getFahrzeuggeratByFzId(long fzId) throws SQLException {
        Fahrzeuggerat fzg = null;
        String query = "SELECT * FROM FAHRZEUGGERAT WHERE FZ_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setLong(1, fzId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    fzg = extractFahrzeuggeratFromResultSet(rs);
                }
            }
        }

        return fzg;
    }

    /**
     * Inserts a new Fahrzeuggerat object into the database.
     *
     * @param fahrzeuggerat The Fahrzeuggerat object to be inserted.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public void insertFahrzeuggerat(Fahrzeuggerat fahrzeuggerat) throws SQLException {
        String query = "INSERT INTO FAHRZEUGGERAT (FZG_ID, FZ_ID, STATUS, TYP, EINBAUDATUM, AUSBAUDATUM) VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setLong(1, fahrzeuggerat.getFzgId());
            stmt.setLong(2, fahrzeuggerat.getFzId());
            stmt.setString(3, fahrzeuggerat.getStatus());
            stmt.setString(4, fahrzeuggerat.getTyp());
            stmt.setDate(5, new java.sql.Date(fahrzeuggerat.getEinbauDatum().getTime()));
            stmt.setDate(6, new java.sql.Date(fahrzeuggerat.getAusbauDatum().getTime()));

            stmt.executeUpdate();
        }
    }

    /**
     * Updates an existing Fahrzeuggerat object in the database.
     *
     * @param fahrzeuggerat The Fahrzeuggerat object to be updated.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public void updateFahrzeuggerat(Fahrzeuggerat fahrzeuggerat) throws SQLException {
        String query = "UPDATE FAHRZEUGGERAT SET FZ_ID = ?, STATUS = ?, TYP = ?, EINBAUDATUM = ?, AUSBAUDATUM = ? WHERE FZG_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setLong(1, fahrzeuggerat.getFzId());
            stmt.setString(2, fahrzeuggerat.getStatus());
            stmt.setString(3, fahrzeuggerat.getTyp());
            stmt.setDate(4, new java.sql.Date(fahrzeuggerat.getEinbauDatum().getTime()));
            stmt.setDate(5, new java.sql.Date(fahrzeuggerat.getAusbauDatum().getTime()));
            stmt.setLong(6, fahrzeuggerat.getFzgId());

            stmt.executeUpdate();
        }
    }

    /**
     * Deletes a Fahrzeuggerat object from the database by its FZG_ID.
     *
     * @param fzgId The FZG_ID of the Fahrzeuggerat to be deleted.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public void deleteFahrzeuggerat(long fzgId) throws SQLException {
        String query = "DELETE FROM FAHRZEUGGERAT WHERE FZG_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setLong(1, fzgId);

            stmt.executeUpdate();
        }
    }

    /**
     * Extracts a Fahrzeuggerat object from the ResultSet.
     *
     * @param rs The ResultSet containing the Fahrzeuggerat data.
     * @return The Fahrzeuggerat object.
     * @throws SQLException If an SQL exception occurs.
     */
    private Fahrzeuggerat extractFahrzeuggeratFromResultSet(ResultSet rs) throws SQLException {
        long fzgId = rs.getLong("FZG_ID");
        long fzId = rs.getLong("FZ_ID");
        String status = rs.getString("STATUS");
        String typ = rs.getString("TYP");
        Date einbauDatum = rs.getDate("EINBAUDATUM");
        Date ausbauDatum = rs.getDate("AUSBAUDATUM");

        return new Fahrzeuggerat(fzgId, fzId, status, typ, einbauDatum, ausbauDatum);
    }
}
