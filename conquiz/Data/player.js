
function Player(data) {
	this.id = data['id'];
	this.name = data['name'];
	this.team = {
		icon: data['icon'],
		color: data['color']
	}
	this.coordinate = {
		latitude: parseFloat(data['latitude']),
		longitude: parseFloat(data['longitude'])
	}
	this.troops = JSON.parse(data['troops']);
}

Player.prototype.get = function(attribute) {
	return this[attribute];
}

Player.prototype.set = function(attribute, value) {
	this[attribute] = value;
}

Player.prototype.updateLocation = function(newLoc) {
	// update location called in task object
	this.coordinate = {
		latitude:parseFloat(newLoc['latitude']),
		longitude:parseFloat(newLoc['longitude'])
	};
}

Player.prototype.toString = function() {
	return "Player " + this.id + ": " + this.name + " Team:" + this.team.color;
}

var testPlayer = new Player({
    id: "marcuswan",
    name: "Marcus Wan",
    icon: "png", 
    color: "Blue",
    latitude: 10, 
    longitude: 20,
    troops: "[]"
});
var testPlayer2 = new Player({
    id: "marcuswan",
    name: "Marcus Wan",
    icon: "png", 
    color: "Blue",
    latitude: 10, 
    longitude: 20,
    troops: "[]"
});

var playser = [testPlayer, testPlayer2];


console.log("Player loaded");
