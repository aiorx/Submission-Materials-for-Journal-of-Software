package de.htwberlin.dao;

import java.sql.SQLException;
import java.util.List;

import de.htwberlin.object.Mautabschnitt;

/**
 * Javadoc Supported via standard programming aids
 * The MautabschnittDao interface provides methods for accessing and
 * manipulating Mautabschnitt objects in the database.
 */
public interface MautabschnittDao {

	/**
	 * Retrieves a Mautabschnitt object from the database by its abschnittsId.
	 *
	 * @param abschnittsId The ID of the Mautabschnitt.
	 * @return The Mautabschnitt object with the specified ID, or null if not found.
	 * @throws SQLException If an SQL exception occurs.
	 */
	Mautabschnitt getMautabschnittById(int abschnittsId) throws SQLException;

	/**
	 * Retrieves a list of all Mautabschnitt objects from the database.
	 *
	 * @return A list of Mautabschnitt objects.
	 * @throws SQLException If an SQL exception occurs.
	 */
	List<Mautabschnitt> getAllMautabschnitte() throws SQLException;

}
