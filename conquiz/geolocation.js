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
		//console.log('CALLED GEOLOCATOR');
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

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

function haversineDistance(lat1, lon1, lat2, lon2){

	var R = 6371; // km 
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
	Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 

 	return d;
}

function distanceToTower(tower){
	return haversineDistance(
		getUserLat(), getUserLon(),
		tower.getLat(), tower.getLon()
	) * 1000;
}

function isUserAtTower(tower){
	var response = false;
	console.log('distance: ' + distanceToTower(tower))
	if(distanceToTower(tower) <= tower.get('size')){
		response = true;
	}
	return response;
}

function updateUserMarker(){
	var objects = map.getObjects();
	var target;
	var size = objects.length;
	for(var o = 0; o < size; o++){
		if(objects[o] instanceof H.map.Marker){
			target = objects[o];
			//console.log('Found User Marker!');
			break;
		}
	}
	function moveUserMarker(){
		target.setPosition({
			lat: userPosition.latitude,
			lng: userPosition.longitude
		});
		//console.log('Update with: ' + userPosition.toString());
		game.checkAllTowers();
	}
	getGeolocation(moveUserMarker);
}

/*$(document).click(function(){
	updateUserMarker();
});*/

window.setInterval(function(){
	updateUserMarker();
}, 500);

console.log('LOADED geolocation.js');