PLACES = [
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
YELP_KEY = 'mQibNaJT6QaNZKdz8XinUA';
YELP_KEY_SECRET = 'VksxaiJCJB29B6NliQUSnClrpIE';
YELP_TOKEN = 'jUQ68PDom3T0lpOIa2K1VyM964196tun';
YELP_TOKEN_SECRET = 'AzQgSea38SUPEKnee5WgcBY53fk';

//
var otherInfoWindowObj = null;

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
	self.infoWindow = null;

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
	};

	self.showMarker = function() {
		self.marker.setMap(self.map);
	};

	self.hideMarker = function() {
		self.marker.setMap(null);
	};

	self.openInfoWindow = function() {
		// marker animation
		setAnimation(1500);

		// set clicked marker as map center
		self.marker.get('map').setCenter(self.loc);

		// console.log('open '+ self.name +' window'); //for testing
		// console.log(self);

		// keep only one info window open
		closeOtherOpenedInfoWindow(otherInfoWindowObj);

		// get data from yelp and display in the infowindow
		self.infoWindow = new google.maps.InfoWindow();
		self.callYelpApi(self.name);
		self.infoWindow.open(self.marker.get('map'), self.marker);
		otherInfoWindowObj = self.infoWindow;

		// console.log(otherInfoWindowObj);
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
		// console.log(Date.now());
		var settings = {
			url: message.action,
			data: parameters,
			cache: true, //prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
		  	dataType: 'jsonp',
		  	jsonpCallback: 'cb',
			success: function (response) {
				callYelpSuccess(response);
			},
			fail: function(){
				return 'fail';
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
		// console.log(res); // make response visible
		if( res.businesses.length != 0 ) {
			message = res.businesses[0].name + '<br />' + '<img src=' + res.businesses[0].image_url + '>'; //message needs TO BE UPDATED based on the response
		} else {
			message = 'There is no info about ' + self.name + ' on Yelp';
		}
		self.infoWindow.setContent(message);
	}

	function closeOtherOpenedInfoWindow(cur) {
		if (cur !== null) {
			// console.log('current Info Window: ');
			// console.log(cur);
			cur.setMap(null);
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