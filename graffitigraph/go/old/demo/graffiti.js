var SURFACE ={
	WOOD: {name: "Wood"},
	BRICK: {name: "Brick"} 
}

/*
* Since the surface data is not included in the Rockford dataset, I will use this function for now.
* Later, I will either try to use the Google Maps Streetview API to determine surfaces for each data point.
* If that does not work, I will manually add surfaces for 20-50 data points.
*/
function getRandomSurface(){
	//No Enum.length or Enum.get(), so magic numbers and switch statements it is!
	var random = Math.floor(Math.random() * 2);
	switch(random){
		case 0: return SURFACE.WOOD;
		case 1: return SURFACE.BRICK;
		default: return null;
	}
}

Graffiti.prototype.id = ""; //String
Graffiti.prototype.type = ""; //String
Graffiti.prototype.requested = ""; //Date
Graffiti.prototype.resolved = ""; //Date
Graffiti.prototype.intersection = false; //Boolean
Graffiti.prototype.address = ""; //String
Graffiti.prototype.crossStreet = ""; //String
Graffiti.prototype.surface = ""; //Surface Enumeration
Graffiti.prototype.monikers = []; //String[]
Graffiti.prototype.coordinates = {
	'latitude': 0.0,
	'longitude': 0.0
}; //Object of Doubles/Floats

function Graffiti(data){
	this.id = data['servno'];
	this.type = data['graffititype'];
	this.requested = new Date(data['request_date']);
	this.resolved = new Date(data['resolved_date']);
	var intersectionType = false;
	if(data['addrtype'] == 'I'){
		intersectionType = true;
	}
	this.intersection = intersectionType;
	this.address = data['address'];
	this.crossStreet = data['crossstreet'];
	this.surface = getRandomSurface();
	this.monikers = [
			data['graffitimoniker'],
			data['graffitimoniker2'],
			data['graffitimoniker3']
		];
	this.coordinates = {
		'latitude': parseFloat(data['latitude']),
		'longitude': parseFloat(data['longitude'])
	};
}

Graffiti.prototype.getLat = function(){
	return this.coordinates.latitude;
}

Graffiti.prototype.getLon = function(){
	return this.coordinates.longitude;
}

Graffiti.prototype.getResolutionLength = function(){
	var time = this.resolved.getTime() - this.requested.getTime();
	var days = (((time / 1000) / 60) / 60) / 24;
	return days;
}