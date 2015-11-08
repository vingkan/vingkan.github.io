/*--------------------------------------------*/
/*---> SHIP OBJECT <--------------------------*/
/*--------------------------------------------*/

function Game(data){
	this.name = data['name'];
	this.players = data['players'];
	this.ships = data['ships'];
}

function Ship(data){
	this.name = data['name'];
	this.player = data['player'];
	this.coordinates = {
		latitude: data['latitude'],
		longitude: data['longitude']
	};
}

Ship.prototype.toString = function(){
	return 'Ship ' + this.name + ' belongs to ' + this.player;
}

/*--------------------------------------------*/
/*---> GEOLOCATION <--------------------------*/
/*--------------------------------------------*/

// var userPosition = {
// 	latitude: 0,
// 	longitude: 0
// };

// function updatePosition(position){
// 	userPosition.latitude = position.coords.latitude;
// 	userPosition.longitude = position.coords.longitude;
// }

// function getGeolocation(callback){
// 	navigator.geolocation.getCurrentPosition(function(position){
// 		updatePosition(position);
// 		console.log('CALLED GEOLOCATOR');
// 		if(callback){
// 			callback();
// 		}
// 	});
// }

// function getUserLat(){
// 	return userPosition.latitude;
// }

// function getUserLon(){
// 	return userPosition.longitude;
// }

// console.log('LOADED DATA');

// /*--------------------------------------------*/
// /*---> MAPS <---------------------------------*/
// /*--------------------------------------------*/

// var map = null;

// function initHereMap(){ // This seems like it should be in the application layer

// 	nokia.Settings.set('app_id', APP_ID);
// 	nokia.Settings.set('app_code', APP_CODE);

// 	map = new nokia.maps.map.Display(
// 		document.getElementById('map-container'),
// 		{
// 			components: [
// 				new nokia.maps.map.component.Behavior(),
// 				new nokia.maps.map.component.ZoomBar(),
// 				new nokia.maps.map.component.Overview(),
// 				new nokia.maps.map.component.TypeSelector(),
// 				new nokia.maps.map.component.ScaleBar()
// 			],
// 			zoomLevel: 20,
// 			center: [
// 				getUserLat(),
// 				getUserLon()
// 			],
// 			baseMapType: nokia.maps.map.Display.SATELLITE
// 		}
// 	);

// 	var vinesh = new nokia.maps.map.StandardMarker(
// 		[
// 			getUserLat(),
// 			getUserLon()
// 		],
// 		{
// 			text: "Vinesh",
// 			draggable: true
// 		}
// 	);

// 	var here = new nokia.maps.map.Marker(
// 		new nokia.maps.geo.Coordinate(
// 			getUserLat(),
// 			getUserLon()
// 		),
// 		{
// 			title: "HERE",
// 			visibility: true,
// 			icon: "style/img/hmarker.png",
// 			draggable: true,
// 			anchor: new nokia.maps.util.Point(16, 32)
// 		}
// 	);

// 	map.objects.add(vinesh);
// 	map.objects.add(here);
	
// 	console.log('LOADED HERE MAP');

// }