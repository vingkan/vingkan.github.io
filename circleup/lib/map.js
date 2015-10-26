var googleMap;
var oms;
var mapUsers = [];
var markerCount = 0;

function initGoogleMap(markerArray){
	var centerPoint = userLocation;
	//markerArray.push(userLocation);
	var mapProperties = {
		//center: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
		center: new google.maps.LatLng(centerPoint.getLat(), centerPoint.getLon()),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById('googleMap');
	googleMap = new google.maps.Map(mapDiv, mapProperties);
	oms = new OverlappingMarkerSpiderfier(googleMap, {
		circleFootSeparation: 100
	});
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
		var defaultSize = new google.maps.Size(82.5, 125);
		var currentUser = false;
		if(currentUserMarker(current)){
			currentUser = true;
			defaultSize = new google.maps.Size(82.5 * 1.5, 125 * 1.5);
		}
		var markerIcon = {
			url: 'style/markers/' + current.getImgLetter() + '.png',
			scaledSize: defaultSize,
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(41, 125)
		};
		var marker = new google.maps.Marker({
			title: current.name,
			map: googleMap,
			position: {
				lat: current.getLat(),
				lng: current.getLon()
			},
			icon: markerIcon, //'style/markers/' + current.getImgLetter() + '.png',
			animation: google.maps.Animation.DROP,
			draggable: currentUser
		});
		if(currentUser){
			marker.addListener('dragend', function(marker, event){
				updateMarkerPosition(marker, event);
			});
			currentUser = false;
		}
		oms.addMarker(marker);
		mapUsers.push(current);
		markerCount++;
	}
}

function updateMarkerPosition(marker, event){
	var newPosition = {
		latitude: marker.latLng.lat(),
		longitude: marker.latLng.lng(),
		accuracy: 100
	}
	updateUser(userLocation, newPosition);
}

function addUserMarker(user, allowEdits){
	var allowDrag = allowEdits || false;
	console.log(user)
	var current = user;
	var markerIcon = {
		url: 'style/markers/' + current.getImgLetter() + '.png',
		scaledSize: new google.maps.Size(82.5, 125),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(41, 125)
	};
	var marker = new google.maps.Marker({
		title: current.name,
		map: googleMap,
		position: {
			lat: current.getLat(),
			lng: current.getLon()
		},
		icon: markerIcon, //'style/markers/' + current.getImgLetter() + '.png',
		animation: google.maps.Animation.DROP,
		draggable: allowDrag
	});
	if(allowDrag){
		marker.addListener('dragend', function(marker, event){
			updateMarkerPosition(marker, event);
		});
	}
	//console.log(marker)
	//oms.addMarker(marker);
	google.maps.event.addListener(marker, 'click', (function(marker, markerCount){
		return function(){
			/*infoWindow.setContent(htmlInfo);
			infoWindow.open(googleMap, marker);*/
		}
	})(marker, markerCount));
	/*googleMap.panTo(
		{
			lat: current.getLat(),
			lng: current.getLon()
		}
	);*/
}