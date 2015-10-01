//the map model
var mapModel = {
    mapOptions: {
        center: {lat: 49.2569332, lng:  -123.1239135},
        zoom: 13
    },
    //addMap: function return a map object
    addMap: function(mapid){
       var self = this;
       var map = new google.maps.Map(mapid, self.mapOptions);
       return map; 
    }
};

//the places model
var placeModel = {
    //Places: an array stores some places
    places: [
    {
        'name': 'Mobify',
        'loc': { lat: 49.277866, lng: -123.119140 }
    },
    { 
        'name': 'Paysavvy',
        'loc': { lat: 49.287559, lng: -123.105795 }
    },
    {
        'name': 'Launch Academy',
        'loc': { lat: 49.284983, lng: -123.107684 }
    },
    {
        'name': 'Unbounce',
        'loc': { lat: 49.281552, lng: -123.114606 }
    },
    {
        'name': 'Launch Labs',
        'loc': { lat: 49.286095, lng: -123.116745 }
    },
    {
        'name': 'Hootsuite',
        'loc': { lat: 49.264166, lng: -123.104376 }
    },
    {
        'name': 'Mogo',
        'loc': { lat: 49.286325, lng: -123.114445 }
    }
    ],

    //marker array
    markers: [],
    
    //infoWindow array

    //functions: addMarker, addInfoWindow
    addMarker: function(map){
        var self = this;
        for(var i = 0; i < self.places.length; i++){
            var marker = new google.maps.Marker({
            position: self.places[i].loc,
            map: map,
            title: self.places[i].name
            });
        }
    },
    
    //marker event listener: Ajax call third party API 

    addInfoWindow: function(){}
};

//ViewModel
var ViewModel = {
    init: function(){
        var self = this;
        //initialize the map; TO-DO:if map not applicable show error message
        var mapID = document.getElementById('map-canvas');
        var map = mapModel.addMap(mapID);


        //add markers for places
        placeModel.addMarker(map);
        
    }

};

//activating knockout js
ko.applyBindings(ViewModel);

//app starts here: 
ViewModel.init();

//test func:

