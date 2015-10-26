function newRedEye(){
	var redeye = new User({
		id: null,
		name: 'RedEye Box (Added by: ' + userLocation.name + ')',
		email: '@redeyechicago',
		latitude: 0,
		longitude: 0,
		accuracy: 0,
		circles: null
	});
	redeye.setGeolocation(userLocation.coordinates);
	redeye.getImgLetter = function(){
		return 'redeye';
	}
	addUsers([redeye]);
	addRedEyeBox(redeye, true);
}

function addRedEyeBox(user, allowEdits){
	var allowDrag = allowEdits || false;
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
		icon: markerIcon,
		animation: google.maps.Animation.DROP,
		draggable: allowDrag
	});
	if(allowDrag){
		marker.addListener('dragend', function(marker, event){
			updateRedEyePosition(marker, event);
		});
	}
	google.maps.event.addListener(marker, 'click', (function(marker, markerCount){
		return function(){
			/*infoWindow.setContent(htmlInfo);
			infoWindow.open(googleMap, marker);*/
		}
	})(marker, markerCount));
}

function updateRedEyePosition(marker, event){
	var newPosition = {
		latitude: marker.latLng.lat(),
		longitude: marker.latLng.lng(),
		accuracy: 100
	}
	updateRedEye(userLocation, newPosition);
}

function updateRedEye(user, position){
	var userDatabase = new Firebase('https://circleup.firebaseio.com/users');
	navigator.geolocation.getCurrentPosition(updateCoords);
	var newLocation = position || userLocation.coordinates;
	userDatabase.child(user.id).update({
		latitude: newLocation.latitude,
		longitude: newLocation.longitude,
		accuracy: newLocation.accuracy
	});
	//getUsers();
}