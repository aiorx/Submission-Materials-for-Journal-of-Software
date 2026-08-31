package nz.ac.canterbury.seng302.gardenersgrove.weather.openmeteo;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This class was Supported via standard programming aids where the JSON response
 * from the API was provided. It defines the current weather
 * entity.
 */
public class CurrentWeather {
    @JsonProperty("time")
    private String timestamp;

    @JsonProperty("interval")
    private int interval;

    @JsonProperty("temperature_2m")
    private double temperatureReading;

    @JsonProperty("relative_humidity_2m")
    private int relativeHumidity;

    @JsonProperty("weather_code")
    private int weatherCode;

    // Getters and setters
    public String getTime() {
        return timestamp;
    }

    public void setTime(String time) {
        this.timestamp = time;
    }

    public int getInterval() {
        return interval;
    }

    public void setInterval(int interval) {
        this.interval = interval;
    }

    public double getTemperature2m() {
        return temperatureReading;
    }

    public void setTemperature2m(double temperature2m) {
        this.temperatureReading = temperature2m;
    }

    public int getRelativeHumidity2m() {
        return relativeHumidity;
    }

    public void setRelativeHumidity2m(int relativeHumidity2m) {
        this.relativeHumidity = relativeHumidity2m;
    }

    public int getWeatherCode() {
        return weatherCode;
    }

    public void setWeatherCode(int weatherCode) {
        this.weatherCode = weatherCode;
    }

    /**
     * A toString method Supported via standard programming aids to override the
     * information getting printed
     * @return a string containing all information about
     * current weather
     */
    @Override
    public String toString() {
        return "CurrentWeather{" +
                "time='" + timestamp + '\'' +
                ", interval=" + interval +
                ", temperature=" + temperatureReading +
                ", relativeHumidity=" + relativeHumidity +
                ", weatherCode=" + weatherCode +
                '}';
    }
}
