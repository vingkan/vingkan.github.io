/*--------------------------------------------*/
/*---> UTILITIES <----------------------------*/
/*--------------------------------------------*/


/*--------------------------------------------*/
/*---> STORYBOARD <---------------------------*/
/*--------------------------------------------*/

function initHereMap(callbackcity){

	/*var platform = new H.service.Platform({
		'app_id': APP_ID,
		'app_code': APP_CODE
	});*/

	var mapTypes = platform.createDefaultLayers();
	map = new H.Map(
		document.getElementById('map-container'),
		mapTypes.satellite.map,
		{
			zoom: 18,
			center: {
				lat: getUserLat(),
				lng: getUserLon()
			}
		}
	);

	var icon = new H.map.Icon('style/img/hmarker.png');
	var marker = new H.map.Marker(
		{
			lat: getUserLat(),
			lng: getUserLon()
		},
		{
			icon: icon
		}
	);

	var mapEvents = new H.mapevents.MapEvents(map);

	map.addEventListener('tap', function(event){
		/*console.log(event.currentPointer);
		console.log(event.target);*/
		var xPort = event.currentPointer.viewportX;
		var yPort = event.currentPointer.viewportY;
		//Map.screenToGeo() is a godsend
		var geo = event.target.screenToGeo(xPort, yPort);
		mapClickCallback(geo);
		/*console.log(geo);*/
	});

	var behavior = new H.mapevents.Behavior(mapEvents);

	map.addObject(marker);
	
	console.log('LOADED HERE MAP');

	//callbackcity();

	console.log('you better believe it')

}

console.log('LOADED outline.js');