var carIDList = [];

function newCarID(){
	var newID = "car" + carIDList.length;
	carIDList.push(newID);
	return newID;
}

Car.prototype.id = "" //String: ID of DOM representation
Car.prototype.name = "" //String
Car.prototype.boardSize = 100; //Double
Car.prototype.position = 0 //Double as percentage of boardSize
Car.prototype.appearanceOptions = 36; //Body Type as Integer
Car.prototype.appearance = 1; //Body Type as Integer
Car.prototype.starts = 0; //Boolean

function Car(name){
	this.id = newCarID();
	this.name = name || "Car";
	this.boardSize = 100;
	this.position = Math.random() * this.boardSize * 2;
	this.appearance = Math.round((Math.random() * (this.appearanceOptions - 1)) + 1);
	this.starts = 0;
}

Car.prototype.isPolluting = function(){
	var polluting = false;
	var started = this.starts > 1;
	var random = Math.random() > 0.5;
	var minLimit = this.position > (this.boardSize * 0.10);
	var maxLimit = this.position < (this.boardSize * 0.95);
	if(started && random && minLimit && maxLimit){
		polluting = true;
	}
	this.starts++;
	return polluting;
}

Car.prototype.pollute = function(data){
	var xCar = 0;
	var yCar = 0;
	var text = this.id;
	if(data.verticalRoad){
		xCar = (data.roadOffset * 1.000) + (this.boardSize * 0.475);
		yCar = this.boardSize - this.position;
		text += ' ';
	}
	else{
		xCar = this.position - (this.boardSize * 0.075);
		yCar = data.roadOffset * 1;
		text += '-x';
	}
	text = ' ';
	new Cloud(xCar, yCar, data.cloudID, text)
	//board.clouds.push();
}

Car.prototype.update = function(boardSize, roadSize, increment){
	//console.log("updated car: " + this.name);
	this.boardSize = boardSize;
	this.position += increment;
	if(this.position > (boardSize + roadSize)){
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