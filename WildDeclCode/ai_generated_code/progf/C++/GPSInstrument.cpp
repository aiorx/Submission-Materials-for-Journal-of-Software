#include <cmath>

#include "pch.h"
#include "GPSInstrument.h"
#include "defines.h"

/// <summary>
/// Function Built with basic GitHub coding tools.
/// </summary>
/// <param name="initialLat"></param>
/// <param name="initialLong"></param>
/// <param name="speed"></param>
/// <param name="orientation"></param>
/// <param name="time"></param>
/// <returns></returns>
std::pair<double, double> GPSInstrument::calculateNewPosition(double speed, double orientation, double time) {
	// Convert latitude and longitude from degrees to radians
	double latRad = _lastLatitude * M_PI / 180.0;
	double longRad = _lastLongitude * M_PI / 180.0;

	// Calculate the distance traveled
	double distance = speed * time; // distance in meters

	// Calculate the new latitude
	double newLatRad = asin(sin(latRad) * cos(distance / dEARTH_RADIUS) +
		cos(latRad) * sin(distance / dEARTH_RADIUS) * cos(orientation));

	// Calculate the new longitude
	double newLongRad = longRad + atan2(sin(orientation) * sin(distance / dEARTH_RADIUS) * cos(latRad),
		cos(distance / dEARTH_RADIUS) - sin(latRad) * sin(newLatRad));

	// Convert the new latitude and longitude from radians to degrees
	double newLat = newLatRad * 180.0 / M_PI;
	double newLong = newLongRad * 180.0 / M_PI;

	return std::make_pair(newLat, newLong);
}

/// <summary>
/// Get a new location based on the current location, speed, and orientation.
/// </summary>
/// <param name="zSpeed">Positive: elevating, Negative: falling</param>
/// <param name="speed"></param>
/// <param name="orientation"></param>
/// <returns></returns>
Location GPSInstrument::GetNewLocation(double zSpeed, double speed, double orientation)
{
	// Maybe called from multiple threads.
	//     i.e. Reporting thread and the move to destination thread.
	std::lock_guard<std::mutex> lockTime(_mutexTime);

	Location location;
	std::time_t currentTime = Utils::GetCurrentUnixLocalTime();
	std::pair<double, double> newLocation = calculateNewPosition(speed, orientation, (double)(currentTime - _lastTime));

	_lastTime = currentTime;
	location.Latitude = newLocation.first;
	location.Longitude = newLocation.second;
	location.Altitude = _lastAltitude + (zSpeed * (double)(currentTime - _lastTime));

	_lastLatitude = location.Latitude;
	_lastLongitude = location.Longitude;
	_lastAltitude = location.Altitude;

	return location;
}

Location GPSInstrument::GetLastLocation()
{
	Location location;
	location.Latitude = _lastLatitude;
	location.Longitude = _lastLongitude;
	location.Altitude = _lastAltitude;
	return location;
}	

void GPSInstrument::SetLastLocation(double latitude, double longitude, double altitude)
{
	_lastLatitude = latitude;
	_lastLongitude = longitude;
	_lastAltitude = altitude;
	_lastTime = Utils::GetCurrentUnixLocalTime();
}