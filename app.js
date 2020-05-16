window.onload = () => {
  getCountryData();
};

// Get the map
var map;
var infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51, lng: 9 },
    zoom: 2,
    // Disable the zoom etc from map
    disableDefaultUI: true,
  });
  infoWindow = new google.maps.InfoWindow();
}

// Get the country data from the API
const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showDataOnMap(data);
      showDataInTable(data);
    });
};

// Show data on map
const showDataOnMap = (data) => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: "white",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "blue",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country.casesPerOneMillion * 15,
    });

    // Define country data from API in a html variable defined by string literals
    var html = `
      <div class="info-container">
        <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
        </div>
        <div class="info-name">
          ${country.country}
        </div>
        <div class="info-confirmed">
        Total: ${country.cases}
        </div>
        <div class="info-active">
        Active: ${country.active}
        </div>
        <div class="info-recovered">
          Recovered: ${country.recovered}
        </div>
        <div class="info-deaths">
          Deaths: ${country.deaths}
        </div>
    </div>
    `;

    // Define pop-up info window for all countries
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });

    // Create info window on hover
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    // Close info window when mouse not in the circle
    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

// Store data in table below map
const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
    <tr>
      <td>${country.country}</td>
      <td>${country.cases}</td>
      <td>${country.active}</td>
      <td>${country.recovered}</td>
      <td>${country.deaths}</td>
    </tr>
    `;
  });
  document.getElementById("table-data").innerHTML = html;
};
