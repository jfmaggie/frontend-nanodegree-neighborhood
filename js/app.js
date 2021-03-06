"use strict";

var places = [
	{
		'name': 'Blue Water Cafe',
		'loc': { lat: 49.276238, lng: -123.121185 }
 	},
 	{
		'name': 'Chambar',
		'loc': { lat: 49.280344, lng: -123.109680 }
	},
	{
		'name': 'West',
		'loc': { lat: 49.260260, lng: -123.139111 }
	},
	{
		'name': 'Miku',
		'loc': { lat: 49.287112, lng: -123.112272 }
	},
	{
		'name': 'Hawksworth',
		'loc': { lat: 49.283652, lng: -123.118985 }
	},
	{
		'name': 'Nuba',
		'loc': { lat: 49.284153, lng: -123.109142 }
	},
	{
		'name': 'Pourhouse',
		'loc': { lat: 49.286171, lng: -123.108370 }
	}
];

// Yelp token/secret
var YELP_KEY = 'mQibNaJT6QaNZKdz8XinUA';
var YELP_KEY_SECRET = 'VksxaiJCJB29B6NliQUSnClrpIE';
var YELP_TOKEN = 'jUQ68PDom3T0lpOIa2K1VyM964196tun';
var YELP_TOKEN_SECRET = 'AzQgSea38SUPEKnee5WgcBY53fk';

// global variable to keep only one info window open
var infoWindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

//the map model
var mapModel = {
	mapOptions: {
		center: { lat: 49.276960, lng: -123.111967 },
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

	function initialize() {
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

		bounds.extend(new google.maps.LatLng(self.loc.lat, self.loc.lng));
	};

	self.openInfoWindow = function() {
		// marker animation
		setAnimation(1500);

		// set clicked marker as map center
		self.marker.get('map').setCenter(self.loc);

		infoWindow.setContent('Loading...');
		self.callYelpApi(self.name);
		infoWindow.open(self.marker.get('map'), self.marker);
	};

	self.callYelpApi = function (name) {
		var parameters = {
			oauth_consumer_key: YELP_KEY,
			oauth_consumer_secret: YELP_KEY_SECRET,
		  	oauth_token: YELP_TOKEN,
		  	oauth_signature_method: 'HMAC-SHA1',
		  	oauth_version : '1.0',
		  	callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
		};
		var message = {
			'action': 'http://api.yelp.com/v2/search?term=' + name + '&location=' + encodeURIComponent('vancouver, bc') + '&cc=CA',
			'method': 'GET',
			'parameters': parameters
		};
		var accessor = {
			consumerSecret: parameters.oauth_consumer_secret,
			tokenSecret: YELP_TOKEN_SECRET
		};
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		parameters.oauth_signature = OAuth.percentEncode(parameters.oauth_signature);

		var yelpTimeout = setTimeout(callYelpFail, 8000); //error handling for ajax jsonp
		var settings = {
			url: message.action,
			data: parameters,
			cache: true, //prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
			dataType: 'jsonp',
			jsonpCallback: 'cb',
			success: function (response) {
				callYelpSuccess(response);
				clearTimeout(yelpTimeout); //error handling for ajax jsonp
			}
		};

		$.ajax(settings);
	};

	function setAnimation(timeout) {
		if (self.marker.getAnimation() !== null) {
			self.marker.setAnimation(null);
		} else {
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			window.setTimeout(function() {
				self.marker.setAnimation();
			}, timeout);
		}
	}

	function callYelpSuccess(res) {
		var message = '';
		if( res.businesses.length !== 0 ) {
			message = res.businesses[0].name + '<br />' + '<img src=' + res.businesses[0].image_url + '>'; //message needs TO BE UPDATED based on the response
		} else {
			message = 'There is no info about ' + self.name + ' on Yelp';
		}
		infoWindow.setContent(message);
	}

	function callYelpFail() {
		var message = 'Unable to reach Yelp';
		infoWindow.setContent(message);
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

		places.forEach(function(place){
			self.places.push(new placeModel(place.name, place.loc, map));
		});
		window.onresize = function() {
			map.fitBounds(bounds);
		};
	}

	self.filteredItem = ko.computed(function() {
		var filter = self.query();
 		self.places().forEach(function(place){
 			place.marker.setVisible(false);
 		});

		var filtered = self.places().filter(function(place) {
			return place.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
		});

		filtered.forEach(function(place){
			place.marker.setVisible(true);
		});
		return filtered;
	});

	initialize();
};

//app starts here:
var vm = new ViewModel();
ko.applyBindings(vm);