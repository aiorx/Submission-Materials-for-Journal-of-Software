// Most of the file was Supported via standard programming aids. Some modifications were made to apply the code for our purposes

package com.weathertraffic.service;

import com.weathertraffic.model.Measurement;
import com.weathertraffic.model.WeatherStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import java.time.Instant;
import java.time.temporal.ChronoUnit;


@Service
public class WeatherService {
    // API key, urls, etc...
    private static final String FMI_API_URL =
            "https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature" +
                    "&storedquery_id=fmi::observations::weather::timevaluepair&place={city}" +
                    "&parameters=n_man,ri_10min,r_1h,snow_aws,temperature,vis,windspeedms&starttime={starttime}&endtime={endtime}";

    private Measurement<Float> parseMeasurement(Document document, String parameter)
    {
        // Parse temperature values
        float measuredValue = Float.NaN;
        String measurementTime = "Unknown";
        NodeList measurementNodes = document.getElementsByTagName("wml2:MeasurementTimeseries");
        for (int i = 0; i < measurementNodes.getLength(); i++) {
            String description = measurementNodes.item(i).getAttributes().getNamedItem("gml:id").getTextContent();
            if (description.contains(parameter)) {
                NodeList temperatureValues = measurementNodes.item(i).getChildNodes();
                for (int j = 0; j < temperatureValues.getLength(); j++) {
                    if (temperatureValues.item(j).getNodeName().equals("wml2:point")) {
                        NodeList pointNodes = temperatureValues.item(j).getChildNodes();
                        for (int k = 0; k < pointNodes.getLength(); k++)
                        {
                            if (pointNodes.item(k).getNodeName().equals("wml2:MeasurementTVP")) {
                                String time = pointNodes.item(k).getChildNodes().item(1).getTextContent();
                                String value = pointNodes.item(k).getChildNodes().item(3).getTextContent();

                                if (!Float.isNaN(Float.parseFloat(value)))
                                {
                                    measurementTime = time;
                                    measuredValue = Float.parseFloat(value);
                                }
                            }
                        }
                    }
                }
            }
        }
        return new Measurement<>(measuredValue, measurementTime);
    }

    private WeatherStatus getWeather(String city, String starttime, String endtime) throws Exception  {
        RestTemplate restTemplate = new RestTemplate();

        String url = FMI_API_URL
                .replace("{city}", city)
                .replace("{starttime}", starttime)
                .replace("{endtime}", endtime);

        String xmlData = restTemplate.getForObject(url, String.class);

        // Parse XML Data
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        assert xmlData != null;
        Document document = builder.parse(new java.io.ByteArrayInputStream(xmlData.getBytes()));

        Measurement<Float> temperature = parseMeasurement(document, "temperature");
        Measurement<Float> windSpeed = parseMeasurement(document, "windspeedms");
        Measurement<Float> rainAmount = parseMeasurement(document, "r_1h");
        Measurement<Float> rainIntensity = parseMeasurement(document, "ri_10min");
        Measurement<Float> visibility = parseMeasurement(document, "vis");
        Measurement<Float> cloudiness = parseMeasurement(document, "n_man");
        Measurement<Float> snowAmount = parseMeasurement(document, "snow_aws");

        String finalDescription = "Weather in " + city
                + ": cloud amount at " + cloudiness.getTime()
                + ", rain amount at " + rainAmount.getTime()
                + ", rain intensity at " + rainIntensity.getTime()
                + ", snow amount at " + snowAmount.getTime()
                + ", Temperature (C) at " + temperature.getTime()
                + ", visibility at " + visibility.getTime()
                + ", wind speed (m/s) at " + windSpeed.getTime();

        WeatherStatus status = new WeatherStatus();
        status.setDescription(finalDescription);
        status.setTemperature(temperature.getData());
        status.setWindSpeed(windSpeed.getData());
        status.setRainAmount(rainAmount.getData());
        status.setRainIntensity(rainIntensity.getData());
        status.setVisibility(visibility.getData());
        status.setCloudAmount(cloudiness.getData());
        status.setSnowAmount(snowAmount.getData());
        return status;
    }

    public WeatherStatus getCurrentWeather(String city) throws Exception {
        Instant now = Instant.now();
        String starttime = now.minus(1, ChronoUnit.DAYS).toString().substring(0, 10) + "T23:50:00Z";
        String endtime = now.toString().substring(0, 10) + "T23:50:00Z";
        return getWeather(city, starttime, endtime);
    }

    public WeatherStatus getWeatherAtTime(String city, String time) throws Exception {
        return getWeather(city, time, time);
    }
}
