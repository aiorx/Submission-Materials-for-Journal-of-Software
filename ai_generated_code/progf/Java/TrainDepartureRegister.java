package edu.ntnu.stud;

import java.io.IOException;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


/**
 * This class represents a register of TrainDeparture objects.
 *
 * @author Jonathan Hubertz
 * @version 1.0
 * @since 30. october 2023
 */
public class TrainDepartureRegister {

  private final TrainDeparturePersistence persistence;
  private LocalTime systemTime;

  private static final String ERROR = "Error: ";

  // Constructor

  /**
   * Constructor with file path and name.
   */
  public TrainDepartureRegister(TrainDeparturePersistence persistence) {
    this.persistence = persistence;
    this.systemTime = LocalTime.of(0, 0);
  }

  // Getters

  /**
   * Gets the system time.
   *
   * @return the system time.
   */

  public LocalTime getSystemTime() {
    return systemTime;
  }

  /**
   * Sorts the train departures by ascending departure times.
   *
   * @return a sorted list of train departures.
   */

  private List<TrainDeparture> getSortedDepartures() throws IOException {
    return persistence.readDepartures().stream()
        .sorted(Comparator.comparing(TrainDeparture::getDepartureTime))
        .toList();
  }

  // Methods for adding departures to the register

  /**
   * Adds a train departure without a set track to the register.
   *
   * @param departureTime the departure time.
   * @param line          the line.
   * @param trainNumber   the train number.
   * @param destination   the destination.
   * @param delay         the delay.
   * @throws IllegalArgumentException if the train number already exists in the register.
   * @throws IllegalArgumentException if the departure time is before the current system time.
   */

  public void addTrainDeparture(LocalTime departureTime, String line, int trainNumber,
      String destination, LocalTime delay) throws IllegalArgumentException, IOException {
    if (searchByTrainNumber(trainNumber) != null) {
      throw new IllegalArgumentException("A train with number " + trainNumber + " already exists.");
    }
    if (departureTime.isBefore(systemTime)) {
      throw new IllegalArgumentException(
          "Cannot assign a train departure time before the current time.");
    }

    try {
      TrainDeparture newDeparture = new TrainDeparture(departureTime, line, trainNumber,
          destination, delay);
      persistence.writeDeparture(newDeparture);
    } catch (Exception e) {
      System.out.println(ERROR + e.getMessage());
    }

  }

  /**
   * Adds a train departure with a set track to the register.
   *
   * @param departureTime the departure time.
   * @param line          the line.
   * @param trainNumber   the train number.
   * @param destination   the destination.
   * @param track         the track.
   * @param delay         the delay.
   * @throws IllegalArgumentException if the train number already exists in the register.
   * @throws IllegalArgumentException if the departure time is before the current system time.
   */
  public void addTrainDeparture(LocalTime departureTime, String line, int trainNumber,
      String destination, int track, LocalTime delay) throws IllegalArgumentException, IOException {
    if (searchByTrainNumber(trainNumber) != null) {
      throw new IllegalArgumentException("A train with number " + trainNumber + " already exists.");
    }
    if (departureTime.isBefore(systemTime)) {
      throw new IllegalArgumentException(
          "Cannot assign a train departure time before the current time.");
    }
    TrainDeparture newDeparture = new TrainDeparture(departureTime, line, trainNumber,
        destination, track, delay);
    persistence.writeDeparture(newDeparture);
  }

  // Methods related to removing departures from the register

  /**
   * Removes a departure from the register.
   *
   * @param trainNumber the train number to remove.
   */
  public void removeDeparture(int trainNumber) throws IOException {
    persistence.removeDeparture(trainNumber);
  }

  // Setters

  /**
   * Sets the track of a train departure.
   *
   * @param trainNumber the train number.
   * @param track       the track.
   */
  public void setTrack(int trainNumber, int track) throws IOException {
    for (TrainDeparture departure : persistence.readDepartures()) {
      if (departure.getTrainNumber() == trainNumber) {
        try {
          departure.setTrack(track);
          persistence.updateDeparture(departure);
          return;
        } catch (IOException e) {
          System.out.println(ERROR + "didn't update Csv file - " + e.getMessage());
          return;
        } catch (IllegalArgumentException e) {
          System.out.println(ERROR + e.getMessage());
          return;
        }
      }
    }
    System.out.println(ERROR + "train number not found.");
  }


  /**
   * Sets the delay of a train departure.
   *
   * @param trainNumber the train number.
   * @param delay       the delay.
   */
  public void setDelay(int trainNumber, LocalTime delay) throws IOException {
    for (TrainDeparture departure : persistence.readDepartures()) {
      if (departure.getTrainNumber() == trainNumber) {
        try {
          departure.setDelay(delay);
          persistence.updateDeparture(departure);
          return;
        } catch (IOException e) {
          System.out.println(ERROR + "didn't update Csv file - " + e.getMessage());
          return;
        } catch (IllegalArgumentException e) {
          System.out.println(ERROR + e.getMessage());
          return;
        }
      }
    }
  }

  /**
   * Sets the system time.
   *
   * @param time the time to set.
   */
  public void setSystemTime(LocalTime time) {
    systemTime = time;
  }

  // Methods related to searching the register

  /**
   * Retrieves a train departure from the register by train number.
   *
   * @param trainNumber the train number.
   * @return the TrainDeparture object with the given train number, or null if it doesn't exist.
   */
  // Supported via standard GitHub programming aids --
  public TrainDeparture searchByTrainNumber(int trainNumber) throws IOException {
    return persistence.readDepartures().stream()
        .filter(departure -> departure.getTrainNumber() == trainNumber)
        .findFirst()
        .orElse(null);
  }
  // --

  /**
   * Retrieves a list of train departures from the register by destination.
   *
   * @param destination the destination.
   * @return a list of train departures with the given destination, or an empty list if none exist.
   */
  public List<TrainDeparture> searchByDestination(String destination) throws IOException {
    return persistence.readDepartures().stream()
        .filter(departure -> departure.getDestination().toLowerCase().equals(destination))
        .toList();
  }

  // Methods related to string representations of the register

  /**
   * A string representation of a train departure with a given train number that exists in the
   * register.
   *
   * @param trainNumber the train number.
   * @return a string representation of a train departure with the given train number.
   */
  public String searchByTrainNumberString(int trainNumber) throws IOException {
    TrainDeparture departure = searchByTrainNumber(trainNumber);
    if (departure == null) {
      return "No train departures with train number " + trainNumber + " found.";
    } else {
      return formatDepartures() + departure.toUiString();
    }
  }

  /**
   * A string representation of train departures with the given destination in the 
   * register.
   *
   * @param destination the destination
   * @return a string representation of train departures with the given destination.
   */
  public String searchByDestinationString(String destination) throws IOException {
    List<TrainDeparture> departures = searchByDestination(destination);
    if (departures.isEmpty()) {
      return "No train departures with destination " + destination + " found.";
    } else {
      String newDepartures = departures.stream()
          .map(TrainDeparture::toUiString)
          .collect(Collectors.joining());

      return formatDepartures() + newDepartures;
    }
  }

  /**
   * A string representation of the register.
   *
   * @return a string representation of the register.
   */
  public String toSortedTable(LocalTime systemTime) throws IOException {
    var newDepartures = getSortedDepartures().stream()
        .filter(departure -> departure.getDepartureTimeWithDelay().isAfter(systemTime))
        .map(TrainDeparture::toUiString)
        .collect(Collectors.joining());

    return formatDepartures() + newDepartures;
  }

  // Methods used for testing

  /**
   * The number of departures in the register.
   *
   * @return the number of departures in the register.
   */

  public int getNumberOfDepartures() throws IOException {
    return persistence.readDepartures().size();
  }

  /**
   * Clears the permanent register.
   */

  public void clearDepartures() throws IOException {
    persistence.clearDepartures();
  }

  // Helper methods

  /**
   * The formatting of the header and separator of the string representations.
   *
   * @return the formatting of the string representation.
   */
  // Help from ChatGPT --
  private String formatDepartures() {
    String time = "\nTime: " + systemTime.toString() + "\n";
    String header = String.format("%-4s | %-15s | %-18s | %-5s | %-5s%n",
        "Nr", "Departure Time", "Destination", "Track", "Delay");
    String separator = String.format("%-4s | %-15s | %-18s | %-5s | %-5s%n",
        "----", "---------------", "------------------", "-----", "-----");
    return time + header + separator;
  }
  // --

}
