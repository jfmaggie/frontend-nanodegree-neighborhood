PLACES = [
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
];

//the map model
var mapModel = {
    mapOptions: {
        center: {
            lat: 49.276960,
            lng: -123.111967
        },
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
    addMap: function(mapid) {
        var self = this;
        var map = new google.maps.Map(mapid, self.mapOptions);
        return map;
    }
};

//the places model
var placeModel = function(name, loc, map) {
      var self = this;
	self.name = name;
	self.loc = loc;
	self.map = map;
	self.marker = null;

	function initialize(){
	    self.addMarker(self.map);

	}

	self.addMarker = function(map) {
		self.marker = new google.maps.Marker({
		      position: self.loc,
		      map: map,
		      title: self.name
		});

	 	self.marker.addListener('click', function() {
	 		var infowindow = new google.maps.InfoWindow({
	       		content: self.name
	    		});
	       	infowindow.open(self.marker.get('map'), self.marker);
	    	});
	};

	self.showMarker = function() {
		self.marker.setMap(self.map);
	};

	self.hideMarker = function() {
		self.marker.setMap(null);
	};


      initialize();
};

        //ViewModel
var ViewModel = function() {
	var self = this;

	self.places = ko.observableArray([]);
	self.query = ko.observable('');

      function initialize() {
		var map = mapModel.addMap(document.getElementById('map-canvas'));
		PLACES.forEach(function(place){
			self.places.push(new placeModel(place.name, place.loc, map));
		});
       }

	self.filteredItem = ko.computed(function() {
       	var filter = self.query();
       	self.places().forEach(function(place){
       		place.hideMarker();
       	});

		var filtered = self.places().filter(function(place){
			return place.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
		});

		filtered.forEach(function(place){
			place.showMarker();
		});
		return filtered;
	});


      initialize();
};

        //app starts here:
      var vm = new ViewModel();

        //activate knockout js
       ko.applyBindings(vm);
