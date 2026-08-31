package de.htwberlin.dao;

import java.sql.SQLException;
import java.util.List;

import de.htwberlin.object.Fahrzeuggerat;
/**
 * JavaDoc Aided using common development resources
 * The FahrzeuggeratDao interface provides methods for accessing and manipulating Fahrzeuggerat objects in the database.
 * Fahrzeuggerat refers to the equipment associated with a Fahrzeug (vehicle).
 **/
public interface FahrzeuggeratDao {
	/**
	 * Retrieves a list of all Fahrzeuggerat objects from the database.
	 *
	 * @return List of Fahrzeuggerat objects.
	 * @throws SQLException If an SQL error occurs.
	 */
	List<Fahrzeuggerat> getAllFahrzeuggerat() throws SQLException;

	/**
	 * Retrieves a Fahrzeuggerat object from the database by its identifier.
	 *
	 * @param fzgId The identifier of the Fahrzeuggerat object.
	 * @return The Fahrzeuggerat object with the specified identifier.
	 * @throws SQLException If an SQL error occurs.
	 */
	Fahrzeuggerat getFahrzeuggeratByFzgId(long fzgId) throws SQLException;

	/**
	 * Updates an existing Fahrzeuggerat object in the database.
	 *
	 * @param fahrzeuggerat The Fahrzeuggerat object to be updated.
	 * @throws SQLException If an SQL error occurs.
	 */
	void updateFahrzeuggerat(Fahrzeuggerat fahrzeuggerat) throws SQLException;

	/**
	 * Deletes a Fahrzeuggerat object from the database by its identifier.
	 *
	 * @param fzgId The identifier of the Fahrzeuggerat object to be deleted.
	 * @throws SQLException If an SQL error occurs.
	 */
	void deleteFahrzeuggerat(long fzgId) throws SQLException;

	/**
	 * Inserts a new Fahrzeuggerat object into the database.
	 *
	 * @param fahrzeuggerat The Fahrzeuggerat object to be inserted.
	 * @throws SQLException If an SQL error occurs.
	 */
	void insertFahrzeuggerat(Fahrzeuggerat fahrzeuggerat) throws SQLException;

	/**
	 * Retrieves a Fahrzeuggerat object from the database by the identifier of the associated Fahrzeug.
	 *
	 * @param fzId The identifier of the associated Fahrzeug.
	 * @return The Fahrzeuggerat object associated with the specified Fahrzeug identifier.
	 * @throws SQLException If an SQL error occurs.
	 */
	Fahrzeuggerat getFahrzeuggeratByFzId(long fzId) throws SQLException;

}
