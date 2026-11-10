package de.htwberlin.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import de.htwberlin.object.BuchungsStatus;

public class BuchungsStatusDaoImpl implements BuchungsStatusDao {
    private Connection connection;

    /**
     * JavaDoc Aided using common development resources
     * Constructs a new BuchungsStatusDaoImpl with the specified database connection.
     *
     * @param connection The database connection.
     */
    public BuchungsStatusDaoImpl(Connection connection) {
        this.connection = connection;
    }

    /**
     * Retrieves all BuchungsStatus objects from the database.
     *
     * @return A list of all BuchungsStatus objects.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public List<BuchungsStatus> getAllBuchungsStatus() throws SQLException {
        List<BuchungsStatus> buchungsStatusList = new ArrayList<>();

        String query = "SELECT * FROM buchungstatus";
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                BuchungsStatus buchungsStatus = extractBuchungsStatusFromResultSet(rs);
                buchungsStatusList.add(buchungsStatus);
            }
        }

        return buchungsStatusList;
    }

    /**
     * Retrieves a BuchungsStatus object by its ID.
     *
     * @param bId The ID of the BuchungsStatus.
     * @return The BuchungsStatus object.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public BuchungsStatus getBuchungsStatusById(int bId) throws SQLException {
        BuchungsStatus buchungsStatus = null;
        String query = "SELECT * FROM buchungstatus WHERE B_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, bId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    buchungsStatus = extractBuchungsStatusFromResultSet(rs);
                 
                }
            }
        }
        return buchungsStatus;
    }

    /**
     * Inserts a new BuchungsStatus object into the database.
     *
     * @param buchungsStatus The BuchungsStatus object to be inserted.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public void insertBuchungsStatus(BuchungsStatus buchungsStatus) throws SQLException {
        String query = "INSERT INTO buchungstatus (B_ID, STATUS) VALUES (?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, buchungsStatus.getBId());
            stmt.setString(2, buchungsStatus.getStatus().name());

            stmt.executeUpdate();
        }
    }

    /**
     * Updates an existing BuchungsStatus object in the database.
     *
     * @param buchungsStatus The BuchungsStatus object to be updated.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public void updateBuchungsStatus(BuchungsStatus buchungsStatus) throws SQLException {
        String query = "UPDATE buchungstatus SET STATUS = ? WHERE B_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setString(1, buchungsStatus.getStatus().name());
            stmt.setInt(2, buchungsStatus.getBId());
            stmt.executeUpdate();
        }
    }

    /**
     * Deletes a BuchungsStatus object from the database by its ID.
     *
     * @param bId The ID of the BuchungsStatus to be deleted.
     * @throws SQLException If an SQL exception occurs.
     */
    @Override
    public void deleteBuchungsStatus(int bId) throws SQLException {
        String query = "DELETE FROM buchungstatus WHERE B_ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(query)) {
            stmt.setInt(1, bId);
            stmt.executeUpdate();
        }
    }

    /**
     * Extracts a BuchungsStatus object from the current row of the ResultSet.
     *
     * @param rs The ResultSet object.
     * @return The extracted BuchungsStatus object.
     * @throws SQLException If an SQL exception occurs.
     */
    private BuchungsStatus extractBuchungsStatusFromResultSet(ResultSet rs) throws SQLException {
        int bId = rs.getInt("B_ID");
        String statusStr = rs.getString("STATUS");

        return new BuchungsStatus(bId, statusStr);
    }
}
