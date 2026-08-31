import requests
from datetime import datetime
import geocoder

# Assisted with basic coding tools.
def get_lat_long():
    g = geocoder.ip('me')
    lat, lng = g.latlng
    return lat, lng

# Assisted with basic coding tools and edits made.
def get_weather(lat: float, long: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": long,
        "hourly": "temperature_2m,precipitation,snowfall,windspeed_10m",
        "forecast_days": 2,
        "timezone": "auto"
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        response_data = response.json()

        times = response_data["hourly"]["time"]
        temps = response_data["hourly"]["temperature_2m"]
        precs = response_data["hourly"]["precipitation"]
        snows = response_data["hourly"]["snowfall"]
        winds = response_data["hourly"]["windspeed_10m"]
        
        # Fake time for debugging purpose.
        # fake_now = datetime.strptime("2025-06-23T23:15", f"%Y-%m-%dT%H:%M")
        # now = fake_now.replace(minute=0, second=0).strftime(f"%Y-%m-%dT%H:00")

        now = datetime.now().replace(minute=0, second=0).strftime(f"%Y-%m-%dT%H:00")
        if now not in times:
            print("Curent time not found.")
            return
        index = times.index(now)
        datas = []
        # title = f"DATE\t🕒 TIME\t🌡️ Temp\t💧 Rain\t❄️ Snow\t💨 Wind"
        for i in range(index, min(index + 20, len(times))):
            time_str = datetime.strptime(times[i], f"%Y-%m-%dT%H:%M")
            converted_time = time_str.strftime(f"%d.%m.%Y, %A\t%H:%M")
            forecast = f"🕒 {converted_time}\t🌡️ Temp: {temps[i]}°C\t💧 Rain: {precs[i]} mm\t❄️ Snow: {snows[i]} mm\t💨 Wind: {winds[i]} km/h"
            if precs[i] > 0:
                forecast += "\t🌂 Bring an umbrella!"
            if snows[i] > 0:
                forecast += "\t🧤 Dress warm, snow expected!"
            datas.append(forecast)
        return "\n".join(datas)
    except Exception as e:
        return f"Error fetching data: {e}"

# Debug purpose.
# print(*get_lat_long())
# print(get_weather(*get_lat_long()))

def save_weather_data():
    with open("weather_data.txt", "w", encoding="utf-8") as f_w:
        f_w.write(get_weather(*get_lat_long()))