function init(){
    //display map
    var map, marker=[], infowindow=[];
    var myLatLng = {lat: 49.2569332, lng:  -123.1239135};
    var mapOptions = {
        center: myLatLng,
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    
    //defalut places list
    var places = [
    {
        'name': 'place1',
        'loc': { lat: 49.2569332, lng: -123.1239135 }
    },
    { 
        'name': 'place2',
        'loc': { lat: 49.271048, lng: -123.145886 }
    }
    ];

    //create markers for places 
    function addMarker(){
    for(var i = 0; i < places.length; i++){
        marker.push(new google.maps.Marker({
            position: places[i].loc,
            title: 'hello'
        }));
        marker[i].setMap(map);
        }
    }
    addMarker();

    //create info windows for markers
    function addInfoWindows(){ 
        function openCallback(i, m){
        return function(){
            i.open(map, m);
        };
        }
        for(var i = 0; i < places.length; i++){
        infowindow.push(new google.maps.InfoWindow({
            content: places[i].name
        }));
        marker[i].addListener('click', openCallback(infowindow[i], marker[i]));
        }
    }
    addInfoWindows();

}

init();

