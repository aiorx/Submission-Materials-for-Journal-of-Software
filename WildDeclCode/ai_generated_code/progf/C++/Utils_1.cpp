
#include "pch.h"
#include "Utils.h"
#include "defines.h"

/// <summary>
/// Function Formed using common GitHub development resources.
/// </summary>
/// <returns></returns>
std::time_t Utils::GetCurrentUnixLocalTime() {
	// Get the current time as a time_point
	auto now = std::chrono::system_clock::now();

	// Convert the time_point to a time_t, which represents the time in seconds since the Unix epoch
	std::time_t now_c = std::chrono::system_clock::to_time_t(now);

	// Convert the time_t to a tm structure representing local time
	std::tm local_tm;
	localtime_s(&local_tm, &now_c);

	// Convert the tm structure back to a time_t representing the Unix local time
	std::time_t local_time = std::mktime(&local_tm);

	return local_time;
}

/// <summary>
/// Formed using common GitHub development resources.
/// </summary>
/// <param name="lat1"></param>
/// <param name="lon1"></param>
/// <param name="lat2"></param>
/// <param name="lon2"></param>
/// <returns></returns>
double Utils::CalculateDistance(double lat1, double lon1, double lat2, double lon2) {
    double lat1Rad = toRadians(lat1);
    double lon1Rad = toRadians(lon1);
    double lat2Rad = toRadians(lat2);
    double lon2Rad = toRadians(lon2);

    double dLat = lat2Rad - lat1Rad;
    double dLon = lon2Rad - lon1Rad;

    double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(lat1Rad) * cos(lat2Rad) *
        sin(dLon / 2) * sin(dLon / 2);
    double c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return EARTH_RADIUS * c;
}

double Utils::CalculateOrientation(double fromLat, double fromLong, double toLat, double toLong) {
    double fromLatRad = toRadians(fromLat);
    double fromLongRad = toRadians(fromLong);
    double toLatRad = toRadians(toLat);
    double toLongRad = toRadians(toLong);

    double dLong = toLongRad - fromLongRad;

    double y = sin(dLong) * cos(toLatRad);
    double x = cos(fromLatRad) * sin(toLatRad) - sin(fromLatRad) * cos(toLatRad) * cos(dLong);

    double bearingRad = atan2(y, x);

    return bearingRad;
}