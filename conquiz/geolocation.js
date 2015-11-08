/*--------------------------------------------*/
/*---> GEOLOCATION <--------------------------*/
/*--------------------------------------------*/

var userPosition = {
	latitude: 0,
	longitude: 0
};

function updatePosition(position){
	userPosition.latitude = position.coords.latitude;
	userPosition.longitude = position.coords.longitude;
}

function getGeolocation(callback){
	navigator.geolocation.getCurrentPosition(function(position){
		updatePosition(position);
		console.log('CALLED GEOLOCATOR');
		if(callback){
			callback();
		}
	});
}

function getUserLat(){
	return userPosition.latitude;
}

function getUserLon(){
	return userPosition.longitude;
}

function updateUserMarker(){
	var objects = map.getObjects();
	var target;
	var size = objects.length;
	for(var o = 0; o < size; o++){
		if(objects[o] instanceof H.map.Marker){
			target = objects[o];
			console.log('Found User Marker!');
			break;
		}
	}
	function moveUserMarker(){
		target.setPosition({
			lat: userPosition.latitude,
			lng: userPosition.longitude
		});
		console.log('Update with: ' + userPosition.toString());
	}
	getGeolocation(moveUserMarker);
}

$(document).click(function(){
	updateUserMarker();
});

console.log('LOADED geolocation.js');