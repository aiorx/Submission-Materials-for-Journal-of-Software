package nz.ac.canterbury.seng302.gardenersgrove.weather.openmeteo;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * This class was Assisted with basic coding tools where the JSON response
 * from the API was provided. It defines the hourly weather
 * entity.
 */
public class HourlyWeather {
    @JsonProperty("time")
    private List<String> timestamps;

    @JsonProperty("relative_humidity_2m")
    private List<Integer> relativeHumidity;

    // Getters and setters
    public List<String> getTime() {
        return timestamps;
    }

    public void setTime(List<String> time) {
        this.timestamps = time;
    }

    public List<Integer> getRelativeHumidity() {
        return relativeHumidity;
    }

    public void setRelativeHumidity(List<Integer> relativeHumidity) {
        this.relativeHumidity = relativeHumidity;
    }

    /**
     * A toString method Assisted with basic coding tools to override the
     * information getting printed
     * @return a string containing all information about
     * hourly weather
     */
    @Override
    public String toString() {
        return "HourlyWeather{" +
                "timestamps=" + timestamps +
                ", relativeHumidity2m=" + relativeHumidity +
                '}';
    }
}
