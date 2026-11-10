var axios = require('axios');
var status = require('http-status').status;
var geoLocation = require('./index.mjs').geoLocation;

/**
 * Create API doc for Nominatim.
 * Supported via standard programming aids 4.0
 *
 * @author https://chat.openai.com/
 */
/**
 * @openapi
 * /geo-location:
 *   post:
 *     description: Get location data from latitude and longitude coordinates
 *     tags:
 *       - Location
 *     requestBody:
 *       description: Geographic coordinates
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 49.2827
 *               longitude:
 *                 type: number
 *                 example: -123.1207
 *     responses:
 *       200:
 *         description: Location data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   example: "Vancouver"
 *                 country:
 *                   type: string
 *                   example: "Canada"
 *       400:
 *         description: Missing coordinates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing coordinates"
 *                 city:
 *                   type: string
 *                   example: "Unknown"
 *                 country:
 *                   type: string
 *                   example: "Unknown"
 */
geoLocation.post('/', async function (req, res) {
    var latitude = req.body.latitude;
var longitude = req.body.longitude;

    // Return early if coordinates are missing
    if (!latitude || !longitude) {
        return res.status(status.BAD_REQUEST).json({
            error: 'Missing coordinates',
            city: 'Unknown',
            country: 'Unknown',
        });
    }

    try {
        // Query Nominatim API from the backend
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/reverse?lat=" + (latitude) + "&lon=" + (longitude) + "&format=json",
            {
                headers: {'User-Agent': 'SustainMe/1.0 (dgarcha9@my.bcit.ca)'},
            },
        );

        var address = response.data.address;

        // Return formatted location data with the same logic as frontend
        return res.json({
            city: address.city || address.town || address.village || 'Unknown',
            country: address.country || 'Unknown',
        });
    } catch (error) {
        console.error('Coordinates lookup failed:', error.message);
        return res.json({
            city: 'Unknown',
            country: 'Unknown',
        });
    }
});
