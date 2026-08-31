const fetchData = async () => {
    const LOCATION = {
        lat: destination.geopoint._lat,
        lon: destination.geopoint._long,
    };

    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${LOCATION.lat}&lon=${LOCATION.lon}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather data could not be fetched');


        const data = await response.json();
        console.log(data);
        setWeather(data); // Assuming 'data' is the structure similar to the API response you provided
    } catch (error) {
        setError(error.message);
    }
};