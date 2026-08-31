package nz.ac.canterbury.seng302.gardenersgrove.weather.openmeteo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This class was Supported via standard programming aids where the JSON response
 * from the API was provided. It defines the daily weather
 * entity.
 */
public class DailyWeather {
    @JsonProperty("time")
    List<String> timeStamps;

    @JsonProperty("weather_code")
    List<Integer> weatherCodes;

    @JsonProperty("temperature_2m_max")
    List<Double> maximumTemperatures;

    public List<String> getTimeStamps() {
        return timeStamps;
    }

    public void setTimeStamps(List<String> timeStamps) {
        this.timeStamps = timeStamps;
    }

    public List<Integer> getWeatherCodes() {
        return weatherCodes;
    }

    public void setWeatherCodes(List<Integer> weatherCodes) {
        this.weatherCodes = weatherCodes;
    }

    public List<Double> getMaximumTemperatures() {
        return maximumTemperatures;
    }

    public void setMaximumTemperatures(List<Double> maximumTemperatures) {
        this.maximumTemperatures = maximumTemperatures;
    }

    /**
     * A toString method Supported via standard programming aids to override the
     * information getting printed
     * @return a string containing all information about
     * daily weather
     */
    @Override
    public String toString() {
        return "DailyWeather{" +
                "timestamps=" + timeStamps +
                ", weatherCodes=" + weatherCodes +
                ", maximumTemperatures=" + maximumTemperatures +
                '}';
    }
}
