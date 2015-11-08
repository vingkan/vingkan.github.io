
// parse array -> string
function Troop(data){
	this.id = data['id'];
	this.name = data['name'];
	this.playerID = data['playerID'];
	this.towerID = data['towerID'];
	this.question = data['question'];
	this.alive = true;
}

Troop.prototype.get = function(attribute){
	return this[attribute];
}

Troop.prototype.set = function(attribute, value){
	this[attribute] = value;
}

Troop.prototype.toString = function(){
	var ret = 'Troop ' + this.name + ' has a id of ' + this.id + ' and playerID of ' + this.playerID + ' and towerID of ' + this.towerID + ' and is isAlive: ' + this.alive;
	return ret;
}

// How object instantiation works
// var troop = new Troop({id: "123", name: "troop1", player: "moh", });


//Example object
var someTroop = new Troop({
	id: "1234",
	name:"myTroop",
	playerID: "1",
	towerID: "1",
	question: JSON.stringify("[Why?, What?]"),
	//alive: "true"
	});
var aTroop = new Troop({
	id: "14",
	name:"myTroop",
	playerID: "2",
	towerID: "4",
	question: JSON.stringify("[W1?, What?]"),
	//alive: "true"
	});
var troops = [someTroop, aTroop];

console.log("troop Loaded");