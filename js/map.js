var map;

function initialize () {
    var mapOptions = {
        center: { lat: -34.397, lng: 150.644},
        zoom: 8
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

}

google.maps.event.addDomListener(window, 'load', initialize);