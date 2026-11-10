package nz.ac.canterbury.seng302.gardenersgrove.weather.openmeteo;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This class was Aided using common development resources where the JSON response
 * from the API was provided. It defines the entity for the
 * current weather parameter units.
 */
public class CurrentUnits {
    @JsonProperty("time")
    private String timestamp;

    @JsonProperty("interval")
    private String interval;

    @JsonProperty("temperature_2m")
    private String temperatureReading;

    @JsonProperty("relative_humidity_2m")
    private String relativeHumidity;

    @JsonProperty("weather_code")
    private String weatherCode;

    // Getters and setters
    public String getTime() {
        return timestamp;
    }

    public void setTime(String time) {
        this.timestamp = time;
    }

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }

    public String getTemperature2m() {
        return temperatureReading;
    }

    public void setTemperature2m(String temperature2m) {
        this.temperatureReading = temperature2m;
    }

    public String getRelativeHumidity2m() {
        return relativeHumidity;
    }

    public void setRelativeHumidity2m(String relativeHumidity2m) {
        this.relativeHumidity = relativeHumidity2m;
    }

    public String getWeatherCode() {
        return weatherCode;
    }

    public void setWeatherCode(String weatherCode) {
        this.weatherCode = weatherCode;
    }

    /**
     * A toString method Aided using common development resources to override the
     * information getting printed
     * @return a string containing all information about
     * current units
     */
    @Override
    public String toString() {
        return "CurrentUnits{" +
                "time='" + timestamp + '\'' +
                ", interval='" + interval + '\'' +
                ", temperatureReading='" + temperatureReading + '\'' +
                ", relativeHumidity='" + relativeHumidity + '\'' +
                ", weatherCode='" + weatherCode + '\'' +
                '}';
    }
}
