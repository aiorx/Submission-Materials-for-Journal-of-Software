package config;

/**
 * A class for storing configuration options.
 * This class makes it easy to adjust values and/or add new features to the application.
 *
 * @author Jonas Birkeli
 * @version 1.0.0
 * @since 1.0.0
 */
public class ConfigurationOptions {
  public static final int STATE_VIEW_DEPARTURES = 1;
  public static final int STATE_ADD_DEPARTURE = 2;
  public static final int STATE_REMOVE_DEPARTURE = 3;
  public static final int STATE_ASSIGN_TRACK = 4;
  public static final int STATE_ASSIGN_DELAY = 5;
  public static final int STATE_SELECT_TRAIN_BY_NUMBER = 6;
  public static final int STATE_SEARCH_BY_DESTINATION = 7;
  public static final int STATE_CHANGE_TIME = 8;
  public static final int STATE_EXIT = 9;
  public static final int STATE_HELP = 10;

  public static final String STATION_DEPARTURE_SCREEN_TITLE =
      "AVGANGER Departures                      SPOR Track   TOG-NUMMER Train-number";
  // Spaces at end to account for station
  public static final int MAX_DESTINATION_LENGTH = "Øvraørnefjeddstakkslåttå".length();
  // Øvraørnefjeddstakkslåttå is the city in Norway with the longest name
  public static final int MAX_LINE_LENGTH = 3;
  public static final int MAX_TRACK_LENGTH = 3;

  // Aided with basic GitHub coding tools
  private ConfigurationOptions() {}
  // Empty constructor to hide the implicit public one.
}
