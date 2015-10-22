User.prototype.id = ""; //String
User.prototype.name = ""; //String
User.prototype.coordinates = {
	'latitude': 0.0,
	'longitude': 0.0
}; //Object of Doubles/Floats

function User(data){
	this.id = null;
	this.name = data['name'];
	this.coordinates = {
		latitude: parseFloat(data['latitude']),
		longitude: parseFloat(data['longitude']),
		accuracy: parseFloat(data['accuracy'])
	};
}

User.prototype.getImgLetter = function(){
	var imgLetter = null;
	var firstChar = this.name.charAt(0).toLowerCase();
	if(isLetter(firstChar)){
		imgLetter = firstChar;
	}
	else{
		imgLetter = 'etc';
	}
	return imgLetter;
}

User.prototype.getLat = function(){
	return this.coordinates.latitude;
}

User.prototype.getLon = function(){
	return this.coordinates.longitude;
}