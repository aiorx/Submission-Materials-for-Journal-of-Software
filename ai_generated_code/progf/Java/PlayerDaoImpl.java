package no.ntnu.idatx2003.exam2025.boardgames.dao.player;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javafx.scene.paint.Color;
import no.ntnu.idatx2003.exam2025.boardgames.model.Player;
import no.ntnu.idatx2003.exam2025.boardgames.util.Log;
import org.slf4j.Logger;

/**
 * Implementation of the PlayerDao interface for managing Player entities in the
 * database.
 * Provides methods to create, find, and delete players.
 * Parts of this code has BEEN Assisted using common GitHub development utilities USING CHATGPT 4.0!
 */
public class PlayerDaoImpl implements PlayerDao {
  private final Connection connection;
  private static final Logger log = Log.get(PlayerDaoImpl.class);

  /**
   * Default constructo takes a connection object.
   *
   * @param connection represents a database Connection.
   */
  public PlayerDaoImpl(Connection connection) {
    this.connection = connection;
  }

  private String colorToHex(Color color) {
    int r = (int) Math.round(color.getRed() * 255);
    int g = (int) Math.round(color.getGreen() * 255);
    int b = (int) Math.round(color.getBlue() * 255);
    return String.format("#%02X%02X%02X", r, g, b);
  }

  @Override
  public int create(Player player) throws SQLException {
    String sql = """
            INSERT INTO players (player_name, player_age, player_color)
            VALUES (?, ?, ?);
        """;
    try (PreparedStatement stmt = connection.prepareStatement(sql,
        PreparedStatement.RETURN_GENERATED_KEYS)) {
      stmt.setString(1, player.getPlayerName());
      stmt.setInt(2, player.getPlayerAge());
      stmt.setString(3, colorToHex(player.getPlayerColor()));
      stmt.executeUpdate();

      // Retrieve the generated player_id
      try (ResultSet rs = stmt.getGeneratedKeys()) {
        if (rs.next()) {
          return rs.getInt(1); // Return the generated player_id
        }
      }
      // Unsure if getPlayerId works here without setting it for the object
      log.debug(
          "Persisted player {} with the ID: {}, and color {}", player.getPlayerName(),
          player.getPlayerId(), player.getPlayerColor());
    }
    throw new SQLException("Failed to create player, no ID obtained.");
  }

  // Retrieves/loads a player from the database as a new player object.
  @Override
  public Player findById(int playerId) throws SQLException {
    String sql = "SELECT * FROM players WHERE player_id = ?";

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
      log.debug("Attempting to retrieve player by ID {}", playerId);

      stmt.setInt(1, playerId);

      try (ResultSet rs = stmt.executeQuery()) {
        if (rs.next()) {
          Color color = Color.web(rs.getString("player_color"));
          Player player = new Player(
              rs.getInt("player_id"),
              null, // PlayerStats can be set later
              rs.getString("player_name"),
              rs.getInt("player_age"),
              color);
          log.info("Successfully retrieved player with ID {}: {}, color: {}",
              playerId, player.getPlayerName(), player.getPlayerColor());
          return player;
        }
      }
      log.debug("Player with ID {} not found.", playerId);
    } catch (SQLException e) {
      log.error("Error retrieving player by ID {}: {}", playerId, e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Unexpected error retrieving player by ID {}: {}", playerId, e.getMessage());
      throw new SQLException("Unexpected error retrieving player", e);
    }
    return null;
  }

  @Override
  public void update(Player player) throws SQLException {
    String sql = """
          UPDATE players
             SET player_name = ?, player_age = ?, player_color = ?
           WHERE player_id = ?
        """;

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
      stmt.setString(1, player.getPlayerName());
      stmt.setInt(2, player.getPlayerAge());
      stmt.setString(3, colorToHex(player.getPlayerColor()));
      stmt.setInt(4, player.getPlayerId());
      int rows = stmt.executeUpdate();
      if (rows == 0) {
        throw new SQLException("No player found with ID " + player.getPlayerId());
      }
      log.debug("Updated player {} → name='{}', age={}, color={}",
          player.getPlayerId(),
          player.getPlayerName(),
          player.getPlayerAge(),
          player.getPlayerColor());
    }
  }

  @Override
  public void delete(int playerId) throws SQLException {
    String sql = "DELETE FROM players WHERE player_id = ?";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
      stmt.setInt(1, playerId);
      int affectedRows = stmt.executeUpdate();
      if (affectedRows == 0) {
        log.warn("No player found with ID {} to delete.", playerId);
      } else {
        log.info("Successfully deleted player with ID {}", playerId);
      }
    } catch (SQLException e) {
      log.error("Error deleting player with ID {}: {}", playerId, e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Unexpected error deleting player with ID {}: {}", playerId, e.getMessage());
      throw new SQLException("Unexpected error deleting player", e);
    }
  }

  @Override
  public List<String> getAllPlayerNames() throws SQLException {
    List<String> names = new ArrayList<>();
    String sql = "SELECT player_name FROM players";
    try (PreparedStatement stmt = connection.prepareStatement(sql);
        ResultSet rs = stmt.executeQuery()) {
      while (rs.next()) {
        names.add(rs.getString("player_name"));
      }
    } catch (SQLException e) {
      log.error("Error retrieving all player names: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Unexpected error retrieving all player names: {}", e.getMessage());
      throw new SQLException("Unexpected error retrieving all player names", e);
    }
    return names;
  }

  @Override
  public List<Integer> getAllPlayerIds() throws SQLException {
    List<Integer> ids = new ArrayList<>();
    String sql = "SELECT player_id FROM players";
    try (PreparedStatement stmt = connection.prepareStatement(sql);
        ResultSet rs = stmt.executeQuery()) {
      while (rs.next()) {
        ids.add(rs.getInt("player_id"));
      }
    } catch (SQLException e) {
      log.error("Error retrieving all player IDs: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Unexpected error retrieving all player IDs: {}", e.getMessage());
      throw new SQLException("Unexpected error retrieving all player IDs", e);
    }
    return ids;
  }

  /**
   * Retrieves all players from the database.
   *
   * @return a list of all Player objects in the database
   * @throws SQLException if a database access error occurs
   */
  public List<Player> getAllPlayers() throws SQLException {
    List<Player> players = new ArrayList<>();
    String sql = "SELECT * FROM players";
    try (PreparedStatement stmt = connection.prepareStatement(sql);
        ResultSet rs = stmt.executeQuery()) {
      log.debug("Attempting to retrieve all players from the database.");
      while (rs.next()) {
        Color color = Color.web(rs.getString("player_color"));
        Player player = new Player(
            rs.getInt("player_id"),
            null, // PlayerStats can be set later
            rs.getString("player_name"),
            rs.getInt("player_age"),
            color);
        players.add(player);
      }
      log.info("Successfully retrieved {} players from the database.", players.size());
    } catch (SQLException e) {
      log.error("Error retrieving all players: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("Unexpected error retrieving all players: {}", e.getMessage());
      throw new SQLException("Unexpected error retrieving all players", e);
    }
    return players;
  }
}
