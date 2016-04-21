/*Graffiti.prototype.getResolutionLength = function(){
	var time = this.resolved.getTime() - this.requested.getTime();
	var days = (((time / 1000) / 60) / 60) / 24;
	return days;
}*/

function Graffiti(data){
	var graffiti = {
		id: data['service_request_number'],
		resolved: new Date(data['completion_date']),
		requested: new Date(data['creation_date']),
		coordinates: {
			latitude: parseFloat(data['latitude']),
			longitude: parseFloat(data['longitude'])
		},
		address: data['street_address'],
		zip: data['zip_code'],
		surface: data['what_type_of_surface_is_the_graffiti_on_'],
		location: data['where_is_the_graffiti_located_'],
		community: data['community_area'],
		ward: data['ward'],
		police: data['police_district'],
		status: data['status']
	}
	graffiti.lat = function(){
		return graffiti.coordinates.latitude;
	}
	graffiti.lon = function(){
		return graffiti.coordinates.longitude;
	}
	return graffiti;
}