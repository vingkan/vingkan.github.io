function initGoogleMap(){
	var mapProperties = {
		center: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById('googleMap');
	var googleMap = new google.maps.Map(mapDiv, mapProperties);
}