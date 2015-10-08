//the map model
var mapModel = {
    mapOptions: {
        center: {lat: 49.276960, lng: -123.111967 },
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [
                google.maps.MapTypeId.ROADMAP,
                google.maps.MapTypeId.TERRAIN,
                google.maps.MapTypeId.SATELLITE,
                google.maps.MapTypeId.HYBRID
            ]
        }
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

    //marker array stores all the markers created
    //by function addMarker
    markers: [],
    
    //functions: addMarker, addInfoWindow
    addMarker: function(map){
        var self = this;
        for(var i = 0; i < self.places.length; i++){
            self.markers[i] = new google.maps.Marker({
            position: self.places[i].loc,
            map: map,
            title: self.places[i].name
            });

            //make marker clickable, the following to be changed
            self.addInfoWindow(self.markers[i], self.places[i].name);
        }
        //console.log(self.markers);
    },
    
    //click on marker to display place name
    addInfoWindow: function(marker, message){
        var infowindow = new google.maps.InfoWindow({
            content: message
        });
        marker.addListener('click', function(){
            //console.log('click on marker ya!');
            infowindow.open(marker.get('map'), marker);
        });
    }
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

        //activating knockout js
        ko.applyBindings(new self.addPlaceList(placeModel.places));

        //test update list
        self.updatePlaceList(placeModel.places);

    },
    addPlaceList: function(placeList){
        var self = this;
        self.places = ko.observableArray(placeList);
        //console.log('observable array test');

        },

    //filter place list, get list updated 
    updatePlaceList: function(placelist){
        var key = 'Mo';
        for(var i = 0; i < placelist.length; i++){
            if (key in placelist[i].name) { //search function... can not use in operator here!!!
            console.log(placelist[i].name);
            }
        }
    }
};


//app starts here: 
ViewModel.init();

//test func:

