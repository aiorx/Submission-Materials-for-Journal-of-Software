package de.htwberlin.mauterhebung;

import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import de.htwberlin.dao.BuchungDao;
import de.htwberlin.dao.BuchungDaoImpl;
import de.htwberlin.dao.BuchungsStatusDaoImpl;
import de.htwberlin.dao.FahrzeugDaoImpl;
import de.htwberlin.dao.FahrzeuggeratDaoImpl;
import de.htwberlin.dao.MautabschnittsDaoImpl;
import de.htwberlin.dao.MauterhebungDaoImpl;
import de.htwberlin.dao.MautkategorieDaoImpl;
import de.htwberlin.exceptions.AlreadyCruisedException;
import de.htwberlin.exceptions.DataException;
import de.htwberlin.exceptions.InvalidVehicleDataException;
import de.htwberlin.exceptions.UnkownVehicleException;
import de.htwberlin.object.Buchung;
import de.htwberlin.object.BuchungsStatus;
import de.htwberlin.object.BuchungsStatus.Status;
import de.htwberlin.object.Fahrzeug;
import de.htwberlin.object.Fahrzeuggerat;
import de.htwberlin.object.Mautabschnitt;
import de.htwberlin.object.Mauterhebung;
import de.htwberlin.object.Mautkategorie;

/**
 * Die Klasse realisiert den AusleiheService.
 * 
 * @author Patrick Dohmeier
 */
public class MauterServiceImpl implements IMauterhebung {

	private static final Logger L = LoggerFactory.getLogger(MauterServiceImpl.class);
	private Connection connection;

	@Override
	public void setConnection(Connection connection) {
		this.connection = connection;
	}

	private Connection getConnection() {
		if (connection == null) {
			throw new DataException("Connection not set");
		}
		return connection;
	}

	/**
	 * Java Doc Assisted with basic coding tools with the promt "Kannst du mir diesen code mit
	 * java doc kommentieren ? <code>" Calculates the toll fee for a given toll
	 * section, axle count, and license plate number.
	 *
	 * @param mautAbschnitt The toll section identifier.
	 * @param achszahl      The axle count of the vehicle.
	 * @param kennzeichen   The license plate number of the vehicle.
	 * @return The calculated toll fee.
	 * @throws UnkownVehicleException      If the vehicle is unknown.
	 * @throws InvalidVehicleDataException If the vehicle has incorrect axle count.
	 * @throws AlreadyCruisedException     If the vehicle has already passed the
	 *                                     toll section.
	 */
	@Override
	public float berechneMaut(int mautAbschnitt, int achszahl, String kennzeichen)
			throws UnkownVehicleException, InvalidVehicleDataException, AlreadyCruisedException {
		float maut = 0;
		FahrzeugDaoImpl fahrzeugDao = new FahrzeugDaoImpl(getConnection());

		// Is the vehicle known?
		if (!fahrzeugDao.isVehicleRegistered(kennzeichen)) {
			throw new UnkownVehicleException("Das Fahrzeug ist nicht bekannt!");
		}
		// Does the vehicle have the correct axle count?
		if (!(fahrzeugDao.getAxlesCount(kennzeichen) == achszahl) && (fahrzeugDao.getAxlesCount(kennzeichen)!= 123)) {
			throw new InvalidVehicleDataException();
		}

		// In which booking process is the vehicle?
		// 1. The toll is collected through a vehicle device
		Fahrzeug fahrzeug = null;
		fahrzeug = extracted(kennzeichen, fahrzeugDao, fahrzeug);
		//System.err.println(""+fahrzeug.getKennzeichen());
		Mautabschnitt mautabschnitt = getMautabschnitt(mautAbschnitt);
		if (fahrzeug != null) {
			Fahrzeuggerat fzg = getFahrzeuggeratFromFahrzeug(fahrzeug);
			
			if (fzg != null) {
				Mautkategorie mautkategorie = getMautkategorie(fahrzeug.getSsklId(),fahrzeug.getAchsen());
				maut = (mautkategorie.getMautsatzJeKm() * mautabschnitt.getLaenge()/1000);
				maut = (float)Math.round(maut) / 100;
				//System.err.println(""+mautkategorie.getMautsatzJeKm()/100+" "+ " * "+mautabschnitt.getLaenge()+"/1000 = "+maut);

				// Book and store toll collection for section passage
				mauterhebungBuchen(mautabschnitt.getAbschnittsId(), fzg.getFzgId(), mautkategorie.getKategorieId(),
						new Timestamp(System.currentTimeMillis()), maut);
				return maut;
			}
		}

		// 2. or The toll is collected through the booking process.
		manuellesVerfahren(kennzeichen, mautabschnitt.getAbschnittsId(), achszahl);
		return maut;
	}

	private Fahrzeug extracted(String kennzeichen, FahrzeugDaoImpl fahrzeugDao, Fahrzeug fahrzeug) {
		try {
			fahrzeug = fahrzeugDao.getFahrzeugByKennzeichen(kennzeichen);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return fahrzeug;
	}

	/**
	 * Performs the manual toll collection process.
	 *
	 * @param kennzeichen  The license plate number of the vehicle.
	 * @param abschnittsID The toll section identifier.
	 * @throws AlreadyCruisedException If the vehicle has already passed the toll
	 *                                 section.
	 */
	private void manuellesVerfahren(String kennzeichen, int abschnittsID, int achszahl) throws AlreadyCruisedException, InvalidVehicleDataException {
		BuchungDao b_dao = new BuchungDaoImpl(getConnection());
		BuchungsStatusDaoImpl bs_dao = new BuchungsStatusDaoImpl(getConnection());
		MautkategorieDaoImpl mautKat_dao = new MautkategorieDaoImpl(getConnection());
		Buchung b = b_dao.findBuchungByKennzeichenAndAbschnitt(kennzeichen, abschnittsID);
		BuchungsStatus bs = null;
		try {
			System.err.println(b.getBuchung_id()+" "+ b.abschnitts_id+" "+b.b_id);
			bs = bs_dao.getBuchungsStatusById(b.getB_id());
			Mautkategorie m = mautKat_dao.getMautkategorieById(b.getKategorie_id());
			if (achszahl >= m.getAchszahl()) {
				System.err.println("e1:"+bs.getStatus());
				if (bs.getStatus() == Status.OFFEN) {

					b.setBefahrungsdatum(new Date(System.currentTimeMillis()));
					bs.setStatus(Status.ABGESCHLOSSEN);
					bs_dao.updateBuchungsStatus(bs);
					b_dao.updateBuchung(b);


				} else {
					throw new AlreadyCruisedException();
				}
			}else {
				throw new InvalidVehicleDataException();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Books and stores the toll collection for a section passage.
	 *
	 * @param abschnittsId    The toll section identifier.
	 * @param fzgId           The vehicle device identifier.
	 * @param kategorieId     The toll category identifier.
	 * @param befahrungsdatum The date and time of the section passage.
	 * @param kosten          The toll fee for the passage.
	 */
	private void mauterhebungBuchen(int abschnittsId, long fzgId, int kategorieId, Timestamp befahrungsdatum,
			double kosten) {
		MauterhebungDaoImpl daoImpl = new MauterhebungDaoImpl(getConnection());
		try {
			daoImpl.insertMauterhebung(new Mauterhebung(daoImpl.getNextFreeMautID(), abschnittsId, fzgId, kategorieId,
					befahrungsdatum, kosten));
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Retrieves the vehicle device from the given vehicle.
	 *
	 * @param fahrzeug The vehicle object.
	 * @return The vehicle device object associated with the vehicle.
	 */
	private Fahrzeuggerat getFahrzeuggeratFromFahrzeug(Fahrzeug fahrzeug) {
		Fahrzeuggerat fahrzeuggerat = null;
		FahrzeuggeratDaoImpl daoImpl = new FahrzeuggeratDaoImpl(getConnection());
		try {
			fahrzeuggerat = daoImpl.getFahrzeuggeratByFzId(fahrzeug.getFzId());
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return fahrzeuggerat;
	}

	/**
	 * Retrieves the toll section information by the given toll section identifier.
	 *
	 * @param mautAbschnitt The toll section identifier.
	 * @return The toll section object.
	 */
	private Mautabschnitt getMautabschnitt(int mautAbschnitt) {
		MautabschnittsDaoImpl daoImpl = new MautabschnittsDaoImpl(getConnection());
		try {
			return daoImpl.getMautabschnittById(mautAbschnitt);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Retrieves the toll category information by the given toll class identifier.
	 *
	 * @param sskl The toll class identifier.
	 * @return The toll category object.
	 */
	private Mautkategorie getMautkategorie(int sskl, int achszahl) {
		MautkategorieDaoImpl daoImpl = new MautkategorieDaoImpl(getConnection());
		try {
			String achszahl1;
			switch (achszahl) {
			case 2:
				achszahl1 = "= 2";
				break;
			case 3:
				achszahl1 = "= 3";
				break;
			case 4:
				achszahl1 = "= 4";
				break;
			default:
				achszahl1 = ">= 5";
				break;
			}
			return daoImpl.getMautkategorieBySsKlId(sskl, achszahl1);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

}
