
function Tower(data) {
	this.id = data['id'];
	this.name = data['name'];
	this.coordinate = {
		latitude: parseFloat(data['latitude']),
		longitude: parseFloat(data['longitude'])
	}
	this.size = parseFloat(data['size']);
	this.player = data['player'];
	this.troops = JSON.parse(data['troops']);
}

Tower.prototype.get = function(attribute) {
	return this[attribute];
}

Tower.prototype.set = function(attribute, value) {
	this[attribute] = value;
}

Tower.prototype.getLat = function(){
	return this.coordinate.latitude;
}

Tower.prototype.getLon = function(){
	return this.coordinate.longitude;
}

Tower.prototype.toString = function(){
	return this.id + ': (' + this.getLat().toFixed(3) + ', ' + this.getLon().toFixed(3) + ', ' + this.size + ')'
}

Tower.prototype.toPresetHTML = function(){
	var html = '';
	html += '<div id="' + this.id + '" class="tower preset" onclick="setFocusObject(\'towers\', \'' + this.id + '\');">' + this.size + '</div>';
	return html;
}

Tower.prototype.getCircle = function(){
	var customStyle ={
		strokeColor: 'rgba(99, 0, 12, 0.50)',
		fillColor: 'rgba(99, 0, 12, 0.25)'
	}
	var circle = new H.map.Circle(
	{
		lat: this.getLat(),
		lng: this.getLon()
	},
	this.size,
	{
		style: customStyle
	}
	);
	console.log("Circle Center: " + this.getLat() + ", " + this.getLon())
	return circle;
}

Tower.prototype.update = function(){
	var screenCoords = map.geoToScreen(
	{
		lat: this.getLat(),
		lng: this.getLon()
	});
	//var geoCoords = map.getObjectsAt(screenCoords.lat, screenCoords.lng);
	//console.log(screenCoords)
	//console.log(geoCoords)
}

Tower.prototype.addTroops = function(troops){
	for (var i = 0; i < troops.length; i++){
		this.troops.push(troops[i].id);
		troops[i].set('towerID', this.id);
	}
	// database.push(this);
}

Tower.prototype.getTroopsByPlayer = function(id){
	var troops = this.troops
	var out = [];
	for (var i = 0; i < troops.length; i++){
		if(troops[i].playerID === players)
		out.push(troops[i].id);
	}
	return out;
}

var nick = new Tower({
	id: "1234",
	name:"Tower",
	latitude: "32",
	longitude: "-23.0",
	size: "5",
	player: "Nick",
	troops: "[1, 2, 3, 4]"
});
var nick2 = new Tower({
	id: "41221",
	name:"Tower2",
	latitude: "-232",
	longitude: "0.0",
	size: "15",
	player: "Nick2",
	troops: "[12, 2, 4]"
});

var obj = [nick, nick2];

console.log("Tower Loaded");