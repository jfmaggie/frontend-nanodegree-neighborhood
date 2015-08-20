// model : store data eg. when make ajax call

var map;
var infowindow;

// viewmodel functions that initialize model.map
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(49.281834, -123.122557),
        zoom: 14
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // places filter

    var request = {
        location: mapOptions.center,
        radius: 5000,
        types: ['restaurant']
    };

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
            // console.log('test!');
        }

    }
}


function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
