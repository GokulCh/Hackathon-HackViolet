var map;

function initMap(position) {
var latitude = position.coords.latitude;
var longitude = position.coords.longitude;
var myLatLng = { lat: latitude, lng: longitude };

map = new google.maps.Map(document.getElementById("map"), {
center: myLatLng,
zoom: 18,
});


var markers = [];
var radius = 10; // meters

for (let i = 0; i < 5; i++) {
  var angle = Math.random() * 360;
  var markerLat = latitude + (radius / 111000) * Math.cos(angle);
  var markerLng = longitude + (radius / 111000) * Math.sin(angle) / Math.cos(latitude);

  var markerLatLng = { lat: markerLat, lng: markerLng };
  markers.push(new google.maps.Marker({
    position: markerLatLng,
    map: map,
    title: "Person " + (i + 1)
  }));

  // Increase the radius for the next marker
  radius += Math.random() * 10;
}
}

if (navigator.geolocation) {
var options = {
enableHighAccuracy: true,
maximumAge: 0,
timeout: 60 * 1000 // 1 minute
};

navigator.geolocation.watchPosition(initMap, function (err) {
    var browser = navigator.userAgent;
    var message = "User denied the request for Geolocation.";
    if (browser.indexOf("Chrome") !== -1) {
      message +=
        "\nTo enable, go to Settings > Privacy and security > Site Settings > Location.";
    } else if (browser.indexOf("Firefox") !== -1) {
      message +=
        "\nTo enable, go to Options > Privacy & Security > Permissions > Location.";
    } else if (browser.indexOf("Safari") !== -1) {
      message += "\nTo enable, go to Preferences > Websites > Location.";
    } else if (browser.indexOf("Edge") !== -1) {
      message +=
        "\nTo enable, go to Settings and more > Settings > Site permissions > Location.";
    }
    alert(message);
}, options);
} else {
alert("Geolocation is not supported by this browser.");
}