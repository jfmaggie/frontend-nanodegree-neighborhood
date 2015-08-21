
var map = new google.maps.Map(document.getElementById('map-canvas'),{
    zoom: 8,
    center: new google.maps.LatLng(49.2569332,-123.1239135),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

// creat a search box and link it to the UI element
var input = document.getElementById('pac-input');
var searchbox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Bias the SearchBox results towards current map's viewport
map.addListener('bounds_changed', function() {
    searchbox.setBounds(map.getBounds());
});

var makers = [];
// listen for the event
searchbox.addListener('place_changed', function(){
    var places = searchbox.getPlaces();
    if(places.length=0){
        return;
    }

    // clear out the old markers
    markers.forEach(function(marker){
        maker.setMap(null);
    });
    maker = [ ];

    // for each place, get the icon, name and locaiton
    // todo: click on the place get the 3rd party api
    var bounds = new google.maps.LatLngBounds();
    place.forEach(function(place){
        var icon = {
            url: place.icon,
            size: new google.maps.Size(70, 70),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaleSize: new google.maps.Size(25, 25)
        };

    // create a marker for each place
    markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
    }));

    if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport());
    }else{
        bounds.extend(place.geometry.location);
    }
    });
    map.fitBounds(bounds);

});


// viewmodel
var viewModel= {

};

// Activates knokout.js
$.ready(function() {

    ko.applyBindings(viewModel);

});
