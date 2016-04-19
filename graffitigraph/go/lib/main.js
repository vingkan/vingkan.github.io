var map = null;

function main(geoip){
	var coords = geoip.location;
	var zoom = 13;
	map = L.map('map').setView([coords.latitude, coords.longitude], zoom);
	var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: 'OpenStreetMap'
	});
	var marker = L.marker([coords.latitude, coords.longitude]);
	tile.addTo(map);
	marker.addTo(map);
	marker.bindPopup('<h4>Your Location</h4>').openPopup();

}

function plot(list){
		for(var i = 0; i < list.length; i++){
			var g = list[i];
			var html = '<div class="graffiti-marker">';
				html += '<h1>' + g.surface + '</h1>';
				html += '<p>opened ' + moment(g.requested).fromNow() + '</p>';
				html += '</div>';
			var marker = L.marker([g.lat(), g.lon()]);
			marker.addTo(map);
			marker.bindPopup(html);
		}	
}