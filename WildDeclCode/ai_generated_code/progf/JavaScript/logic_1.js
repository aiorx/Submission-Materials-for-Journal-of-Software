//Code Produced with third-party coding tools's ChatGPT (November 2024)
//Begin Code
// Create a map object and set default view
let map = L.map("map").setView([37.09, -95.71], 5); // Centered on the US

// Add a base tile layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
// USGS Earthquake Data URL for the past 7 days
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the data and add to the map
d3.json(earthquakeURL).then(function(data) {
    // Add GeoJSON data to the map
    L.geoJSON(data, {
        // Style each feature (circleMarker) based on magnitude and depth
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                `<h3>${feature.properties.place}</h3>
                 <hr>
                 <p>Magnitude: ${feature.properties.mag}</p>
                 <p>Depth: ${feature.geometry.coordinates[2]} km</p>`
            );
        }
    }).addTo(map);
});

// Function to define marker style based on magnitude and depth
function styleInfo(feature) {
    return {
        radius: feature.properties.mag * 4,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
    };
}

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 90 ? "#FF5E5E" :
           depth > 70 ? "#FF8E8E" :
           depth > 50 ? "#FFA07A" :
           depth > 30 ? "#FFD700" :
           depth > 10 ? "#ADFF2F" :
                        "#7CFC00";
}
// Add a legend to the map
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    const depths = [-10, 10, 30, 50, 70, 90];
    const colors = ["#7CFC00", "#ADFF2F", "#FFD700", "#FFA07A", "#FF8E8E", "#FF5E5E"];

    // Loop through intervals to generate legend
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background: ${colors[i]}"></i> ${depths[i]}${depths[i + 1] ? `&ndash;${depths[i + 1]}` : "+"}<br>`;
    }
    return div;
};

legend.addTo(map);
//End Code