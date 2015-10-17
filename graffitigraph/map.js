var userLocation = {
	latitude: 0,
	longitude: 0
};

function updateCoords(position){
	userLocation.latitude = position.coords.latitude;
	userLocation.longitude = position.coords.longitude;
}

navigator.geolocation.getCurrentPosition(updateCoords);

function initGoogleMap(markerArray){
	var centerPoint = markerArray[0];
	var mapProperties = {
		//center: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
		center: new google.maps.LatLng(centerPoint.getLat(), centerPoint.getLon()),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById('googleMap');
	var googleMap = new google.maps.Map(mapDiv, mapProperties);

	for(var m = 0; m < markerArray.length; m++){
		var current = markerArray[m];
		var marker = new google.maps.Marker({
			position: {
				lat: current.getLat(),
				lng: current.getLon()
			},
			map: googleMap,
			title: current.name
		});
	}
}