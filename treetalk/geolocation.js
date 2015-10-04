var userLocation = {
	latitude: 0,
	longitude: 0
};

function updateCoords(position){
	userLocation.latitude = position.coords.latitude;
	userLocation.longitude = position.coords.longitude;
}