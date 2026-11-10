//Supported via standard programming aids
var express = require('express');
var axios = require('axios');
var app = express();
var port = 3000;

app.get('/weather', async function (req, res) {
    var plz = req.query.plz;

    if (!plz || plz.toString().length !== 4) {
        return res.status(400).json({ error: 'Invalid or missing PLZ. Please provide a 4-digit postal code.' });
    }

    var url = "https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=" + (plz) + "00";

    try {
        var response = await axios.get(url);
        var data = response.data;
        var temperature = data.currentTemperature || 'Temperature data not available';

        res.json({ plz, temperature });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(port, function () {
    console.log("App is listening on port " + (port) + "");
});
