// Code Derived using common development resources

// date: UTC
// latitude: north is positive, south is negative
// longitude: east is positive, west is negative
function getSunElevation(latitude, longitude, date) {
    // Convert the date to Julian date
    var toJulianDate = function (date) {
        return date / 86400000 + 2440587.5;
    };

    var toRadians = function (deg) { return deg * Math.PI / 180; };
    var toDegrees = function (rad) { return rad * 180 / Math.PI; };

    var JD = toJulianDate(date);
    var d = JD - 2451545.0;

    // Mean longitude of the sun (deg)
    var L = (280.46 + 0.9856474 * d) % 360;
    // Mean anomaly of the sun (deg)
    var g = (357.528 + 0.9856003 * d) % 360;

    // Ecliptic longitude of the sun (deg)
    var lambda = L + 1.915 * Math.sin(toRadians(g)) + 0.02 * Math.sin(toRadians(2 * g));

    // Obliquity of the ecliptic (deg)
    var epsilon = 23.439 - 0.0000004 * d;

    // Sun's right ascension (RA) and declination (decl)
    var alpha = Math.atan2(
        Math.cos(toRadians(epsilon)) * Math.sin(toRadians(lambda)),
        Math.cos(toRadians(lambda))
    );
    var delta = Math.asin(Math.sin(toRadians(epsilon)) * Math.sin(toRadians(lambda)));

    // Convert time to UTC hours
    var utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

    // Greenwich Mean Sidereal Time (GMST) in degrees
    var GMST = (280.46061837 + 360.98564736629 * (JD - 2451545.0)) % 360;

    // Local Sidereal Time (LST)
    var LST = (GMST + longitude) % 360;

    // Hour angle (HA) in radians
    var HA = toRadians((LST - toDegrees(alpha) + 360) % 360);

    // Latitude in radians
    var latRad = toRadians(latitude);

    // Elevation angle
    var elevation = Math.asin(
        Math.sin(delta) * Math.sin(latRad) +
        Math.cos(delta) * Math.cos(latRad) * Math.cos(HA)
    );

    return toDegrees(elevation);
}

var latitude = gps.GetLatDegMillionths() / 1000000.0
var longitude = gps.GetLngDegMillionths() / 1000000.0
var date = new Date(Date.UTC(gps.GetYear(), gps.GetMonth(), gps.GetDay(), gps.GetHour(), gps.GetMinute(), gps.GetSecond())); // UTC time

var elevation = getSunElevation(latitude, longitude, date);

// Sleep logic
// If sun angle is low or battery is depleted, got back to sleep
if ((elevation < 25.0) || (sys.GetInputVoltageVolts() < 3.2) ) {
    // Creates an output driver on GPIO 21
    // and sets output value to 0 
    var pin = new Pin(21)

    // Shouldn't get here but just in case - redundant
    pin.Off()
    DelayMs(100)
}

