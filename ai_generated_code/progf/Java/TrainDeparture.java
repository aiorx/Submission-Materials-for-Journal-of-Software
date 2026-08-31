package edu.ntnu.stud.entity;

import java.time.LocalTime;
import java.util.regex.Pattern;

/**
 * <h5>Represents a train departure with train number, destination, departure time, track number,
 * train line and delay time.</h5>
 *
 * @author kristiangarder
 */

public class TrainDeparture {
  private LocalTime departureTime; // Initial departure time
  private LocalTime amountDelayed; // Delay time
  private String trainLine; // Train line
  private int trainNumber; // Train number
  private String destination; // Train destination
  private int trackNumber; // Track number

  /**
   * Creates an instance of TrainDeparture.
   *
   * @param departureTime    Time of the departure. Must be written in hh:mm format. If it isn't it
   *                         will be set to 00:00.
   * @param trainLine        Train line. If it is empty it will be set to an empty string.
   * @param trainNumber      Train number. If it is not a positive 1 or 2-digit number it will be
   *                         set to -1.
   * @param trainDestination Train destination. If it is empty it will be set to an empty string.
   * @param trackNum         Track where the departure leaves from. If it is not a positive 1 or
   *                         2-digit number it will be set to -1.
   * @param amountDelayed        Delay time of the departure. Must be written in hh:mm format. If it
   *                         isn't it will be set to 00:00.
   */
  public TrainDeparture(String departureTime, String trainLine, int trainNumber,
                        String trainDestination, int trackNum, String amountDelayed) {
    this.setDepartureTime(departureTime);
    this.setAmountDelayed(amountDelayed);
    this.setTrainLine(trainLine);
    this.setTrainNumber(trainNumber);
    this.setDestination(trainDestination);
    this.setTrackNumber(trackNum);
  }

  /**
   * Returns the amount the departure is delayed in "hh:mm" format.
   *
   * @return delayTime The amount delayed in "hh:mm" format.
   */
  public LocalTime getAmountDelayed() {
    return amountDelayed;
  }

  /**
   * Returns the initial departure time in "hh:mm" format.
   *
   * @return time The initial departure time in "hh:mm" format.
   */
  public LocalTime getDepartureTime() {
    return departureTime;
  }

  /**
   * Returns the expected time of the departure including the delay. If delay is 00:00, it will
   * return an empty string.
   *
   * @return sumTime The expected time of the departure as a string in "hh:mm" format.
   */
  public String getExpectedTime() {
    String empty = "";
    LocalTime sumTime =
        departureTime.plusHours(amountDelayed.getHour()).plusMinutes(amountDelayed.getMinute());
    if (amountDelayed.equals(LocalTime.parse("00:00"))) { // If delay is 00:00, return empty string

      return empty;
    } else {
      return sumTime.toString();
    }
  }

  /**
   * Returns the train line.
   *
   * @return line The train line.
   */
  public String getTrainLine() {
    return trainLine;
  }

  /**
   * Returns the train number.
   *
   * @return trainNumber The train number.
   */
  public int getTrainNumber() {
    return trainNumber;
  }

  /**
   * Returns the train destination.
   *
   * @return destination The train's destination.
   */
  public String getDestination() {
    return destination;
  }

  /**
   * Returns the track number.
   *
   * @return trackNumber The track number.
   */
  public int getTrackNumber() {
    return trackNumber;
  }

  /**
   * Sets the initial departure time of the train departure.
   * The given time must be written in hh:mm format. If it isn't it will be set to 00:00.
   * Parts of the code used under was suggested Aided via basic GitHub coding utilities.
   *
   * @param initialTime the initial time of the train departure.
   */
  public void setDepartureTime(String initialTime) {
    // Example pattern for a string in hh:mm format
    String patternExample = "([01]?[0-9]|2[0-3]):[0-5][0-9]";

    Pattern pattern = Pattern.compile(patternExample); // Compiles the pattern

    if (initialTime == null) { // If the initial time is empty, set time to 00:00
      departureTime = LocalTime.parse("00:00");
      // Else if the initial time matches the pattern, set time to the initial time
    } else if (pattern.matcher(initialTime).matches()) {
      departureTime = LocalTime.parse(initialTime);
    } else { // Else set time to 00:00
      departureTime = LocalTime.parse("00:00");
    }
  }

  /**
   * Sets the delay time of the train departure.
   * The given time must be written in hh:mm format. If it isn't it will be set to 00:00.
   * Parts of the code used under was suggested Aided via basic GitHub coding utilities.
   *
   * @param delayedTime the amount delayed in hh:mm format.
   */
  public void setAmountDelayed(String delayedTime) {
    // Example pattern for a string in hh:mm format
    String patternExample = "([01]?[0-9]|2[0-3]):[0-5][0-9]";

    Pattern pattern = Pattern.compile(patternExample); // Compiles the pattern

    if (delayedTime == null) { // If the delay time is empty, set time to 00:00
      amountDelayed = LocalTime.parse("00:00");
      // Else if the delay time matches the pattern, set time to the delay time
    } else if (pattern.matcher(delayedTime).matches()) {
      amountDelayed = LocalTime.parse(delayedTime);
    } else { // Else set time to 00:00
      amountDelayed = LocalTime.parse("00:00");
    }
  }

  /**
   * Sets the track number where the train will depart from.
   * If it is not a number between 1 and 99 it will be set to -1.
   *
   * @param trackNum the track number of the train.
   */

  public void setTrackNumber(int trackNum) {
    if (trackNum > 0 && trackNum < 100) { // If the track number is less than 0 or bigger than 100,
      // set track number to -1
      trackNumber = trackNum;
    } else { // Else set track number to the track number
      trackNumber = -1;
    }
  }

  /**
   * Sets the train number of the train.
   * If it is not a positive 1 or 2-digit number it will be set to -1.
   *
   * @param trainNum the train number of the train.
   */
  private void setTrainNumber(int trainNum) {
    // If the train number is positive and either a 1 or 2-digit number,
    // set train number to the train number
    if (trainNum > 0 && trainNum < 100) {
      trainNumber = trainNum;
    } else { // Else set train number to 0
      trainNumber = -1;
    }
  }

  /**
   * Sets the train line.
   * If it is empty it will be set to an empty string.
   *
   * @param trainLine the train line of the train.
   */
  public void setTrainLine(String trainLine) {
    if (trainLine == null) { // If the train line is empty, set train line to an empty string
      this.trainLine = "";
    } else { // Else set train line to the train line
      this.trainLine = trainLine;
    }
  }

  /**
   * Sets the destination of the train.
   * If it is empty it will be set to an empty string.
   *
   * @param trainDestination the destination of the train.
   */
  public void setDestination(String trainDestination) {
    // If the destination is empty, set destination to an empty string
    if (trainDestination == null) {
      destination = "";
    } else { // Else set destination to the destination
      destination = trainDestination;
    }
  }
}