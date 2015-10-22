var mapUsers = [];

function initGoogleMap(markerArray){
	var centerPoint = userLocation;
	markerArray.push(userLocation);
	var mapProperties = {
		//center: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
		center: new google.maps.LatLng(centerPoint.getLat(), centerPoint.getLon()),
		zoom: 18,
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
		var markerIcon = {
			url: 'style/markers/' + current.getImgLetter() + '.png',
			scaledSize: new google.maps.Size(82.5, 125),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(0, 0)
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
			draggable: false
		});
		oms.addMarker(marker);
		mapUsers.push(current);
	}
}