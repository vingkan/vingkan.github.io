var carIDList = [];

var printed = false;

function newCarID(){
	var newID = "car" + carIDList.length;
	carIDList.push(newID);
	return newID;
}

Car.prototype.id = "" //String: ID of DOM representation
Car.prototype.name = "" //String
Car.prototype.color = "" //Color as String
Car.prototype.boardSize = 100; //Double
Car.prototype.position = 0 //Double as percentage of boardSize
Car.prototype.appearanceOptions = 36; //Body Type as Integer
Car.prototype.appearance = 1; //Body Type as Integer

function Car(name, color, position){
	this.id = newCarID();
	this.name = name || "Car";
	this.color = color || "red";
	this.boardSize = 100;
	this.position = position || 0;
	this.appearance = Math.round((Math.random() * (this.appearanceOptions - 1)) + 1);
}

Car.prototype.update = function(boardSize, roadSize, increment){
	//console.log("updated car: " + this.name);
	this.boardSize = boardSize;
	this.position += increment;
	if(this.position > (boardSize + roadSize)){
		console.log("out of road bounds");
		this.position = -2.5 * roadSize;
		if(printed){
			document.getElementById(this.id).style.display = "none";	
		}
	}
	else{
		if(printed){
			document.getElementById(this.id).style.display = "block";	
		}	
	}
	if(printed){
		document.getElementById(this.id).style.marginLeft = this.position + "px";	
	}
}

Car.prototype.toHTML = function(){
	var html = '';
	html += '<div id="' + this.id + '" class="car" style="margin-left:';
	html += this.position + 'px;background-image:';
	html += 'url(style/cars/path' + (2192 + this.appearance) * 2 + '.png);">';
	html += '</div>';
	return html;
}