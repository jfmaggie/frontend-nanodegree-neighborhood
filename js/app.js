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

// Yelp token/secret
YELP_KEY = 'mQibNaJT6QaNZKdz8XinUA';
YELP_KEY_SECRET = 'VksxaiJCJB29B6NliQUSnClrpIE';
YELP_TOKEN = 'jUQ68PDom3T0lpOIa2K1VyM964196tun';
YELP_TOKEN_SECRET = 'AzQgSea38SUPEKnee5WgcBY53fk';

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

//the place model
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
      title: self.name,
      animation: google.maps.Animation.DROP
		});

		self.marker.addListener('click', function() {
 			self.openInfoWindow();
  	});
	};

	self.showMarker = function() {
		self.marker.setMap(self.map);
	};

	self.hideMarker = function() {
		self.marker.setMap(null);
	};

	self.openInfoWindow = function() {
		setAnimation();
		var infoWindow = new google.maps.InfoWindow({
     	content: self.name
  	});
    infoWindow.open(self.marker.get('map'), self.marker);
	};

	function setAnimation() {
		if (self.marker.getAnimation() !== null) {
    	self.marker.setAnimation(null);
  	} else {
    	self.marker.setAnimation(google.maps.Animation.BOUNCE);
  	}
	}

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

		var filtered = self.places().filter(function(place) {
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

function nonce_generate() {
	  return (Math.floor(Math.random() * 1e12).toString());
	}

function callYelpApi() {
	var yelp_url = 'https://api.yelp.com/v2/search/?term=mogo&location=' + encodeURIComponent('vancouver,bc') + '&cc=CA';
	var parameters = {
		oauth_consumer_key: YELP_KEY,
    oauth_token: YELP_TOKEN,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version : '1.0',
    callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
	};
	var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
  parameters.oauth_signature = encodedSignature;
	var settings = {
		url: yelp_url,
		data: parameters,
		// cache: true,
		dataType: 'jsonp',
		success: function(response){
			console.log(response);
		},
		fail: function(){
			console.log('fail');
		}
	};
	$.ajax(settings);
}
callYelpApi();