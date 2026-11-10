// get geo_location and generate stop_list
var current_latitude, current_longtitude, stop_list_with_dis = [], data_key = "_11451_stop_list";
window.addEventListener('load', function (evt) {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			current_latitude = position.coords.latitude;
			current_longtitude = position.coords.longitude;
			document.getElementById("geo_location_debugger").innerHTML =
				"Latitude: " + (current_latitude) + " Longtitude: " + (current_longtitude) + "";
			var do_download_stop_list = new Promise((resolve, reject) => {
				if (!sessionStorage.getItem(data_key)) {
					console.log("fetching resource");
					fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop")
						.then(response => response.json())
						.then(data => {
							sessionStorage.setItem(data_key, JSON.stringify(data));;
							resolve(sessionStorage.getItem(data_key));
						});
				} else {
					resolve(sessionStorage.getItem(data_key));
				}
			});

			do_download_stop_list.then((result) => {
				var candidates = JSON.parse(result);
				for (var stop of candidates.data) {
					dis = distance(Number(stop.lat), Number(stop.long), current_latitude, current_longtitude);
					var stop_obj = {
						uid: stop.stop,
						name_en: stop.name_en,
						distance: dis,
						latitude: Number(stop.lat),
						longitude: Number(stop.long)
					};
					stop_list_with_dis.push(stop_obj);
				}
				stop_list_with_dis.sort((obj1, obj2) => obj1.distance - obj2.distance);
				render_stop_list();
			});
		},
		(error) => {
			// error_handler_omitted
		}
	);

	document.getElementById("radius_selection").addEventListener('change', render_stop_list);
});

// haversine formula
distance = function (lat1, lon1, lat2, lon2) {
	var R = 6371e3;   // earth's radius in meters 
	var φ1 = lat1 * Math.PI / 180;   // φ, λ in radians 
	var φ2 = lat2 * Math.PI / 180;
	var Δφ = (lat2 - lat1) * Math.PI / 180;
	var Δλ = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) *
		Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;   // in meters 
	/* where φ is latitude, λ is longitude, and R is earth’s radius  
	we must convert the latitude and longitude coordinates to  
	radians before passing them to the trig functions.  */
	return d;
}

// time manipulation Adapted from standard coding samples
function formatTime(inputString) {
	var date = new Date(inputString); // Convert string to Date object

	var options = {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true // 12-hour clock
	};

	var formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

	return formattedTime;
}

render_stop_list = function () {
	var radius = Number(document.getElementById("radius_selection").value);
	html_text = "";
	if (stop_list_with_dis[0].distance > radius) {
		console.log(stop_list_with_dis[0].distance, radius)
		html_text = '<p class="not_found_cue">Cannot locate nearby bus stops</p>';
	} else {
		for (var stop of stop_list_with_dis) {
			if (stop.distance <= radius) {
				html_text += '<div class="margin_placement"><div class="yellow_region">';
				html_text += '<span class="distance_cue">DISTANCE: </span>';
				html_text += '<span class="distance_value">' + (Math.floor(stop.distance)) + "m </span>";
				html_text += '<span class="stop_cue">STOP: </span>';
				html_text += '<span class="stop_value">' + (stop.name_en) + "</span>";
				html_text += '</div><div class="ETA_details" id="' + (stop.uid) + '"></div>';
				html_text += "</div>";
			}
		}
	}
	document.getElementById("nearby_stops").innerHTML = html_text;
	Array.from(document.getElementsByClassName("stop_value")).forEach((element) => {
		element.addEventListener('click', (evt) => {
			Array.from(document.getElementsByClassName("ETA_details")).forEach((element) => {
				element.innerHTML = "";
			});

			Array.from(document.getElementsByClassName("stop_value")).forEach((element) => {
				element.style.backgroundColor = "white";
				element.previousSibling.style.backgroundColor = "white";
				element.previousSibling.previousSibling.style.backgroundColor = "white";
				element.previousSibling.previousSibling.previousSibling.style.backgroundColor = "white";
			});

			element.style.backgroundColor = "yellow";
				element.previousSibling.style.backgroundColor = "yellow";
				element.previousSibling.previousSibling.style.backgroundColor = "yellow";
				element.previousSibling.previousSibling.previousSibling.style.backgroundColor = "yellow";

			sibling = element.parentNode.nextSibling;
			fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/" + (sibling.id) + "")
				.then((response) => response.json())
				.then((data) => {
					var routes_list = [];
					for (var obj of data.data) {
						if (obj.eta) {
							var found = false;
							for (var i = 0; i != routes_list.length; i = i + 1) {
								if (routes_list[i].route == obj.route && routes_list[i].dir == obj.dir) {
									found = true;
									if (routes_list[i].service_type == obj.service_type) {
										routes_list[i].eta.push(obj.eta);
									}
								}
							}

							if (!found) {
								obj.eta = [obj.eta];
								routes_list.push(obj);
							}
						}
					}

					var html_text = "";
					if (0 == routes_list.length) {
						html_text = '<p class="no_route_cue">No bus route information</p>';
					} else {
						for (var i = 0; i != routes_list.length; i = i + 1) {
							html_text += "<div>";

							html_text += '<span class="route_value">' + (routes_list[i].route) + "</span>";
							html_text += '<span class="destination_value">' + (routes_list[i].dest_en) + "</span>";

							html_text += '<div class="ETA_list">';
							html_text += '<span class="ETA_cue">ETA: </span>';
							for (var e of routes_list[i].eta) {
								html_text += '<span class="ETAs">' + (formatTime(e)) + "</span>";
							}
							html_text += "</div>";

							html_text += "</div>";
						}
					}

					html_text = '<div id="map_counterpart">' + (html_text) + "</div>";
					html_text += '<div id="map"></div>';
					html_text = '<div id="to_be_scrolled">' + (html_text) + "</div>"

					sibling.innerHTML = html_text;

					var mid_latitude, mid_longtitude;
					for (var stop of stop_list_with_dis) {
						if (stop.uid == sibling.id) {
							mid_latitude = (current_latitude + stop.latitude) / 2;
							mid_longtitude = (current_longtitude + stop.longitude) / 2;
						}
					}

					var manual_zoom = [18, 17, 17, 16, 16];
					var gmap = new ol.Map({
						target: 'map',
						layers: [
							new ol.layer.Tile({
								source: new ol.source.OSM()
							})
						],
						view: new ol.View({
							center: ol.proj.fromLonLat([mid_longtitude, mid_latitude]),
							zoom: manual_zoom[Math.round(radius / 100) - 1]
						})
					});

					var myfeature1 = new ol.Feature({
						geometry: new ol.geom.Point(ol.proj.fromLonLat([current_longtitude, current_latitude]))
					});

					var myicon1 = new ol.style.Style({
						image: new ol.style.Icon({
							anchor: [0.5, 0.9],
							src: 'map-marker.ico'
						})
					});

					myfeature1.setStyle(myicon1);

					var myfeature2 = new ol.Feature({
						geometry: new ol.geom.Point(ol.proj.fromLonLat([2 * mid_longtitude - current_longtitude, 2 * mid_latitude - current_latitude]))
					});

					var myicon2 = new ol.style.Style({
						image: new ol.style.Icon({
							anchor: [0.5, 0.9],
							src: 'bus-icon.ico'
						})
					});
					
					myfeature2.setStyle(myicon2);

					var layer = new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [myfeature1, myfeature2]
						})
					});
					gmap.addLayer(layer);

					document.getElementById("to_be_scrolled").scrollIntoView();
				});
		});
	});
}