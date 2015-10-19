var userLocation = new User({
	id: null,
	name: 'Local User',
	latitude: 0,
	longitude: 0
});

var mapUsers = [];

function updateCoords(position){
	userLocation.coordinates.latitude = position.coords.latitude;
	userLocation.coordinates.longitude = position.coords.longitude;
}

navigator.geolocation.getCurrentPosition(updateCoords);

function initGoogleMap(markerArray){
	var centerPoint = markerArray[0];
	var mapProperties = {
		//center: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
		center: new google.maps.LatLng(centerPoint.getLat(), centerPoint.getLon()),
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById('googleMap');
	var googleMap = new google.maps.Map(mapDiv, mapProperties);
	var oms = new OverlappingMarkerSpiderfier(googleMap);
	var infoWindow = new google.maps.InfoWindow();
	oms.addListener('click', function(marker, event){
		infoWindow.setContent(marker.desc);
		infoWindow.open(googleMap, marker);
	});
	oms.addListener('spiderify', function(markers){
		infoWindow.close();
	});

	for(var m = 0; m < markerArray.length; m++){
		var current = markerArray[m];
		var marker = new google.maps.Marker({
			title: current.name,
			map: googleMap,
			position: {
				lat: current.getLat(),
				lng: current.getLon()
			},
			icon: 'style/markers/' + current.getImgLetter() + '.png',
			animation: google.maps.Animation.DROP,
			draggable: false
		});
		oms.addMarker(marker);
		mapUsers.push(current);
	}
}