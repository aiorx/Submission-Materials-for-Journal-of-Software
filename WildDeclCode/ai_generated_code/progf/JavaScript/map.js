// Initialize and add the map
/**
   * Performs the merge sort. 
   * I found this code on google Cloud Console.
   *
   * @author  "Google Cloud console"
   * @see "https://console.cloud.google.com/google/maps-apis/overview;onboard=true?project=bby11-423421"
   */



let map;
user_lat;
 User_lng;
let User_Position;
var closest = 100;
var closestID;

console.log("closetId " + closestID);

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Browser doesn't support geolocation.");
  }
}

async function showPosition(position) {
  user_lat = position.coords.latitude;
  User_lng = position.coords.longitude;
  User_Position = {
    lat: user_lat,
    lng: User_lng,
  };

  station.forEach(station => {
    let d = distance(station.lat, station.lng);
    
   
    if (d < closest && station.robots_in_stock > 0) {
      closest = d;
      closestID = station._id;
    }
    
    closest.toFixed(2) + " km";
  });

  await initMap();
}

async function initMap() {
  // The location of Uluru
  const position = { lat: 49.24948493217268, lng: -123.00357710131459 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } =
    await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: position,
    mapId: "DEMO_MAP_ID",
  });

  station.forEach(station => {
    let coords = { lat: station.lat, lng: station.lng };
  
    addMarker(station._id, {
      coords: coords,
      content: `<h1>${station.station_name}</h1>`,
    }); 
  });

  function addMarker(station_ID, props) {
    const icon = document.createElement("div");
    if(station_ID == closestID) {
      icon.setAttribute(
        "style",
        "background-color: green; border-top: 8px solid #e14242;border: 2px solid white;  clip-path: polygon(50% 4%, 69% 10%, 82% 21%, 86% 35%, 84% 52%, 79% 66%, 71% 79%, 60% 92%, 52% 100%, 43% 91%, 31% 77%, 24% 64%, 18% 51%, 17% 37%, 22% 21%, 33% 10%); "
      );
    } else {
      icon.setAttribute(
        "style",
        "background-color: rgba(0, 126, 167, 1); border-top: 8px solid #e14242;border: 2px solid white;  clip-path: polygon(50% 4%, 69% 10%, 82% 21%, 86% 35%, 84% 52%, 79% 66%, 71% 79%, 60% 92%, 52% 100%, 43% 91%, 31% 77%, 24% 64%, 18% 51%, 17% 37%, 22% 21%, 33% 10%); "
      );
    }

    icon.innerHTML = `
      <a href="#" onclick="scrollToSection('id-button${station_ID}', '${station_ID}'); return false;">
        <img src="/robot.png" style="position: relative; bottom: 3px; width: 40px; height: 40px;">
      </a>
    `;

    const marker = new AdvancedMarkerElement({
      map: map,
      position: props.coords,
      content: icon,
    });

    if (props.iconImage) {
      marker.setIcon(props.iconImage);
    }

    if (props.content) {
      var infoWindow = new google.maps.InfoWindow({
        content: props.content,
      });

      marker.addListener("click", function () {
        infoWindow.open(map, marker);
      });
    }
  }

  const pinUser = new PinElement({
    background: "#CCDBDC",
  });

  // The marker, positioned at Uluru
  marker = new AdvancedMarkerElement({
    map: map,
    position: User_Position,
    title: "You",
    gmpClickable: true,
    content: pinUser.element,
  });
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
   * Performs the Distance Calculation. 
   * I found this code on https://stackoverflow.com/questions/24315538/finding-the-nearest-location-from-a-list-of-coordinates.
   *
   * @author contribute@geeksforgeeks.org 
   * @see https://www.geeksforgeeks.org/merge-sort/
   */


function distance(latstation
  , lngstation) {
  let R = 6371; // Radius of the earth in km
  let dLat = toRad(user_lat - latstation

  );  // Javascript functions in radians
  let dLon = toRad(User_lng - lngstation);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(user_lat)) * Math.cos(toRad(latstation

      )) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
}


/**
 * Clickable scrolling.
 * Assisted with basic coding tools 3.5
 *
 * @author https://chat.openai.com/
 */
function scrollToSection(sectionId, station_ID) {
  const container = document.getElementById("stations-placeholder");
  const section = document.getElementById("card-style" + station_ID);
  
  // Calculate the scroll position to center the section
  const containerHeight = container.offsetHeight;
  const sectionHeight = section.offsetHeight;
  const scrollPosition = section.offsetTop - (containerHeight / 2)  - (containerHeight / 3) ;

  // Scroll to the target section
  container.scroll({
    top: scrollPosition,
    behavior: "smooth",
  });

  // Highlight the section temporarily
  section.classList.add('highlight');

  // Remove the highlight class after 2 seconds
  setTimeout(() => {
    section.classList.remove('highlight');
  }, 2000);
}



