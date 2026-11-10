package nz.ac.canterbury.team1000.gardenersgrove.service;

import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import nz.ac.canterbury.team1000.gardenersgrove.entity.Garden;
import nz.ac.canterbury.team1000.gardenersgrove.entity.Weather;
import nz.ac.canterbury.team1000.gardenersgrove.entity.WeatherType;
import nz.ac.canterbury.team1000.gardenersgrove.repository.WeatherRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.web.client.RestTemplate;

public class WeatherServiceTest {

	private WeatherService weatherService;
	@Mock
	private WeatherRepository weatherRepository;
	@Mock
	private RestTemplate restTemplate;
	@Mock
	private GardenService gardenService;
	private Long gardenId;

	@BeforeEach
	void setUp() {
		weatherRepository = mock(WeatherRepository.class);
		restTemplate = mock(RestTemplate.class);
		gardenService = mock(GardenService.class);
		weatherService = new WeatherService(weatherRepository, restTemplate, new ObjectMapper(), gardenService);
		gardenId = 1L;
		List<Weather> weatherList = new ArrayList<>();
		when(weatherRepository.findByGardenId(gardenId)).thenReturn(weatherList);
		when(weatherRepository.save(any())).thenReturn(null);
		when(gardenService.getGardenById(gardenId)).thenReturn(new Garden("Name", "Address", "Suburb", "City", "Postcode", "Country", 0.0, 0.0, 1.0, "", null, true));

	}

	/**
	 * Helper function to make testing smoother regarding mocking the API.
	 *
	 * @param codes int array of weather codes
	 * @param temps double array of hourly temperature codes
	 * @return JSON string with the given values, essentially mocking the Open-Meteo API call
	 */
	public String generateHourlyResponse(int[] codes, double[] temps, int[] humidity, String[] time) {
		// Stephen Hockey (sho151) ChatGPT attribution: the idea to use Arrays.toString
		StringBuilder sb = new StringBuilder();
		sb.append("{\"hourly\":{\"time\":[");
		for (int i = 0; i < time.length; i++) {
			sb.append("\"").append(time[i]).append("\"");
			if (i < time.length - 1) {
				sb.append(",");
			}
		}
		sb.append("],\"temperature_2m\":").append(Arrays.toString(temps));
		sb.append(",\"relative_humidity_2m\":").append(Arrays.toString(humidity));
		sb.append(",\"weather_code\":").append(Arrays.toString(codes)).append("}}");

		return sb.toString();
	}

	/**
	 * Helper function to make testing smoother regarding mocking the API.
	 * Assisted with basic coding tools.
	 *
	 * @param codes int array of weather codes
	 * @return JSON string with the given values, essentially mocking the Open-Meteo API call
	 */
	public String generateDailyResponse(int[] codes, double[] maxTemps, double[] minTemps, int[] precipitation, String[] dates, String[] sunrises, String[] sunsets) {
		StringBuilder sb = new StringBuilder();
		sb.append("{\"daily\":{\"time\":[");
		for (int i = 0; i < dates.length; i++) {
			sb.append("\"").append(dates[i]).append("\"");
			if (i < dates.length - 1) {
				sb.append(",");
			}
		}
		sb.append("],\"weather_code\":").append(Arrays.toString(codes));
		sb.append(",\"temperature_2m_max\":").append(Arrays.toString(maxTemps));
		sb.append(",\"temperature_2m_min\":").append(Arrays.toString(minTemps));
		sb.append(",\"precipitation_probability_max\":").append(Arrays.toString(precipitation));
		sb.append(",\"sunrise\":[");
		for (int i = 0; i < sunrises.length; i++) {
			sb.append("\"").append(sunrises[i]).append("\"");
			if (i < sunrises.length - 1) {
				sb.append(",");
			}
		}
		sb.append("],\"sunset\":[");
		for (int i = 0; i < sunsets.length; i++) {
			sb.append("\"").append(sunsets[i]).append("\"");
			if (i < sunsets.length - 1) {
				sb.append(",");
			}
		}
		sb.append("]}}");

		return sb.toString();
	}

	@Test
	public void GetCurrentWeatherForGarden_ReturnsWeatherList_WeatherListIsCorrectSize() {
		int[] codes = new int[]{1, 2, 3, 4, 5};
		double[] temps = new double[]{20.0, 18.0, 22.5, 20.0, 18.0};
		int[] humidity = new int[]{90, 87, 88, 90, 87};
		String[] times = new String[5];
		String date = LocalDate.now().toString();
		for (int i = 0; i < 5; i++) {
			if (i == 0) {
				String time = LocalTime.of(LocalTime.now().minusHours(2).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 1) {
				String time = LocalTime.of(LocalTime.now().minusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 2) {
				String time = LocalTime.of(LocalTime.now().getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 3) {
				String time = LocalTime.of(LocalTime.now().plusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else {
				String time = LocalTime.of(LocalTime.now().plusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			}
		}

		when(restTemplate.getForObject(anyString(), any())).thenReturn(
			generateHourlyResponse(codes, temps, humidity, times));

		List<Weather> weatherList = weatherService.getCurrentWeatherByGardenId(gardenId);

		Assertions.assertEquals(3, weatherList.size());
	}

	@Test
	public void GetWeather_WeatherCodesUniqueForWeatherType_WeatherTypesCorrect() {
		int[] codes = new int[]{20, 22, 13, 30, 10, 1, 5, 0, 27, 14, 2, 4};
		double[] temps = new double[]{20.0, 18.0, 22.5, 20.0, 18.0, 20.0, 18.0, 22.5, 20.0, 18.0, 17.0, 15.0};
		int[] humidity = new int[]{90, 87, 88, 90, 87, 90, 87, 88, 90, 87, 80, 91};
		String[] times = new String[12];
		String date = LocalDate.now().toString();

		for (int i = 0; i < 12; i++) {
			String time = LocalTime.of(LocalTime.now().plusHours(i).getHour(), 0).toString();
			times[i] = date + "T" + time;
		}

		when(restTemplate.getForObject(anyString(), any())).thenReturn(
			generateHourlyResponse(codes, temps, humidity, times));

		List<Weather> weatherList = weatherService.getWeather(gardenId, "");

		Assertions.assertEquals(WeatherType.DRIZZLE, weatherList.get(0).getType());
		Assertions.assertEquals(WeatherType.SNOW, weatherList.get(1).getType());
		Assertions.assertEquals(WeatherType.THUNDERSTORM, weatherList.get(2).getType());
		Assertions.assertEquals(WeatherType.DUST_STORM, weatherList.get(3).getType());
		Assertions.assertEquals(WeatherType.FOG, weatherList.get(4).getType());
		Assertions.assertEquals(WeatherType.CLOUDY, weatherList.get(5).getType());
		Assertions.assertEquals(WeatherType.HAZE, weatherList.get(6).getType());
		Assertions.assertEquals(WeatherType.CLEAR, weatherList.get(7).getType());
		Assertions.assertEquals(WeatherType.HAIL, weatherList.get(8).getType());
		Assertions.assertEquals(WeatherType.RAIN_SHOWER, weatherList.get(9).getType());
		Assertions.assertEquals(WeatherType.SAME, weatherList.get(10).getType());
		Assertions.assertEquals(WeatherType.FIRE, weatherList.get(11).getType());
	}

	@Test
	public void GetCurrentWeather_WeatherTypeIsSame_WeatherTypeChangedToPreviousHourWeatherType() {
		int[] codes = new int[]{0, 1, 2, 3, 4};
		double[] temps = new double[]{20.0, 18.0, 22.5, 20.0, 18.0};
		int[] humidity = new int[]{90, 87, 88, 90, 87};
		String[] times = new String[5];
		String date = LocalDate.now().toString();
		for (int i = 0; i < 5; i++) {
			if (i == 0) {
				String time = LocalTime.of(LocalTime.now().minusHours(2).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 1) {
				String time = LocalTime.of(LocalTime.now().minusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 2) {
				String time = LocalTime.of(LocalTime.now().getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 3) {
				String time = LocalTime.of(LocalTime.now().plusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else {
				String time = LocalTime.of(LocalTime.now().plusHours(2).getHour(), 0).toString();
				times[i] = date + "T" + time;
			}
		}

		when(restTemplate.getForObject(anyString(), any())).thenReturn(
			generateHourlyResponse(codes, temps, humidity, times));

		List<Weather> weatherList = weatherService.getCurrentWeatherByGardenId(gardenId);

		Assertions.assertEquals(weatherList.get(0).getType(), weatherList.get(1).getType());
		Assertions.assertEquals(WeatherType.CLOUDY, weatherList.get(1).getType());
	}

	@Test
	public void GetCurrentWeather_WeatherTypeSameAndPreviousHourWeatherTypeSame_WeatherTypeChangedToWeatherTypeTwoHoursAgo() {
		int[] codes = new int[]{0, 2, 2, 3, 4};
		double[] temps = new double[]{20.0, 18.0, 22.5, 20.0, 18.0};
		int[] humidity = new int[]{90, 87, 88, 90, 87};
		String[] times = new String[5];
		String date = LocalDate.now().toString();
		for (int i = 0; i < 5; i++) {
			if (i == 0) {
				String time = LocalTime.of(LocalTime.now().minusHours(2).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 1) {
				String time = LocalTime.of(LocalTime.now().minusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 2) {
				String time = LocalTime.of(LocalTime.now().getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else if (i == 3) {
				String time = LocalTime.of(LocalTime.now().plusHours(1).getHour(), 0).toString();
				times[i] = date + "T" + time;
			} else {
				String time = LocalTime.of(LocalTime.now().plusHours(2).getHour(), 0).toString();
				times[i] = date + "T" + time;
			}
		}

		when(restTemplate.getForObject(anyString(), any())).thenReturn(
			generateHourlyResponse(codes, temps, humidity, times));

		List<Weather> weatherList = weatherService.getCurrentWeatherByGardenId(gardenId);

		Assertions.assertEquals(weatherList.get(0).getType(), weatherList.get(1).getType());
		Assertions.assertEquals(WeatherType.CLEAR, weatherList.get(1).getType());
	}

	@Test
	public void GetFutureWeatherForGarden_ReturnsWeatherList_WeatherListIsCorrectSize() {
		int[] codes = {61, 63, 80};
		double[] maxTemps = {20.5, 22.0, 18.7};
		double[] minTemps = {12.3, 14.1, 10.2};
		int[] precipitation = {30, 20, 50};
		String[] dates = {"2023-05-01", "2023-05-02", "2023-05-03"};
		String[] sunrises = {"06:30", "06:31", "06:32"};
		String[] sunsets = {"18:00", "17:59", "17:58"};

		String mockResponse = generateDailyResponse(codes, maxTemps, minTemps, precipitation, dates, sunrises, sunsets);

		when(restTemplate.getForObject(anyString(), any())).thenReturn(mockResponse);

		List<Weather> weatherList = weatherService.getWeatherFuture(gardenId, "");

		Assertions.assertEquals(3, weatherList.size());
	}

	@Test
	public void GetFutureWeather_WeatherCodesUniqueForWeatherType_WeatherTypesCorrect() {
		int[] codes = {20, 22, 13, 30, 10, 1, 5, 0, 27, 14, 2, 4};
		double[] maxTemps = {25.0, 22.0, 27.5, 24.0, 20.0, 23.0, 21.0, 26.5, 24.5, 19.0, 20.5, 18.0};
		double[] minTemps = {15.0, 14.0, 17.5, 16.0, 12.0, 17.0, 15.0, 18.5, 16.5, 13.0, 14.5, 11.0};
		int[] precipitation = {30, 10, 50, 20, 5, 60, 40, 0, 70, 25, 15, 80};
		String[] dates = {"2023-05-01", "2023-05-02", "2023-05-03", "2023-05-04", "2023-05-05", "2023-05-06", "2023-05-07", "2023-05-08", "2023-05-09", "2023-05-10", "2023-05-11", "2023-05-12"};
		String[] sunrises = {"06:30", "06:29", "06:28", "06:27", "06:26", "06:25", "06:24", "06:23", "06:22", "06:21", "06:20", "06:19"};
		String[] sunsets = {"18:00", "18:01", "18:02", "18:03", "18:04", "18:05", "18:06", "18:07", "18:08", "18:09", "18:10", "18:11"};

		String mockResponse = generateDailyResponse(codes, maxTemps, minTemps, precipitation, dates, sunrises, sunsets);

		when(restTemplate.getForObject(anyString(), any())).thenReturn(mockResponse);

		List<Weather> weatherList = weatherService.getWeatherFuture(gardenId, "");

		Assertions.assertEquals(WeatherType.DRIZZLE, weatherList.get(0).getType());
		Assertions.assertEquals(WeatherType.SNOW, weatherList.get(1).getType());
		Assertions.assertEquals(WeatherType.THUNDERSTORM, weatherList.get(2).getType());
		Assertions.assertEquals(WeatherType.DUST_STORM, weatherList.get(3).getType());
		Assertions.assertEquals(WeatherType.FOG, weatherList.get(4).getType());
		Assertions.assertEquals(WeatherType.CLOUDY, weatherList.get(5).getType());
		Assertions.assertEquals(WeatherType.HAZE, weatherList.get(6).getType());
		Assertions.assertEquals(WeatherType.CLEAR, weatherList.get(7).getType());
		Assertions.assertEquals(WeatherType.HAIL, weatherList.get(8).getType());
		Assertions.assertEquals(WeatherType.RAIN_SHOWER, weatherList.get(9).getType());
		Assertions.assertEquals(WeatherType.SAME, weatherList.get(10).getType());
		Assertions.assertEquals(WeatherType.FIRE, weatherList.get(11).getType());
	}
}
