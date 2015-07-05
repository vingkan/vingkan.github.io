function CanvasMap(id, countryList, temporary){
	this.id = id;
	this.countries = countryList || [];
	this.temporary = temporary || false;
}

CanvasMap.prototype.containsCountry = function(country){
	var duplicate = false;
	for(var i = 0; i < this.countries.length; i++){
		if(this.countries[i].name == country.name){
			duplicate = true;
		}
	}
	return duplicate;
}

CanvasMap.prototype.pushCountry = function(country){
	var duplicate = this.containsCountry(country);
	if(!duplicate){
		this.countries.push(country);
		this.loadOptions();
	}
}

CanvasMap.prototype.loadOptions = function(){
	var selector = document.getElementById('country-select');
	selector.innerHTML = '<option value="-1">All Countries</option>';
	var option = '';
	for(var i = 0; i < this.countries.length; i++){
		option = '<option value="' + i + '">' + this.countries[i].name + '</option>'
		selector.innerHTML += option;
	}
}

CanvasMap.prototype.getCountryByIndex = function(index){
	return this.countries[index];
}

CanvasMap.prototype.checkDraggablePoints = function(x, y){
	for(var k = 0; k < this.countries.length; k++){
		for(var i = 0; i < this.country[k].points.length; i++){
			if(this.country[k].points[i].isDraggable(x, y)){
				this.country[k].points.splice(i, 1);
				break;
			}
		}		
	}
}

function resetCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

CanvasMap.prototype.draw = function(){
	if(this.countries.length > 0){
		for(var i = 0; i < this.countries.length; i++){
			this.countries[i].draw();
			if(this.temporary){
				this.countries[i].showPoints();
			}
		}
		if(toolbar.showGrid){
			var gridIncrement = parseInt(document.getElementById('grid-increment').value, 10);
			drawGrid(gridIncrement, false, toolbar.showNumbers);
		}
	}
}

function drawGrid(interval, nodes, numbers){
	var gridText = numbers || false;
	ctx.lineWidth = "0.5";
	ctx.strokeStyle = "white";
	//GRID TEXT
	var fontSize = 10;
	ctx.fillStyle = 'white';
	ctx.font = fontSize + 'px Open Sans';
	//HORIZONTAL GRIDLINES
	for(var y = 0; y <= canvas.height; y += interval){
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.stroke();
		//GRID TEXT
		if(gridText){
			ctx.fillText(y + "", 5, 5 + fontSize + y);
		}
	}
	//VERTICAL GRIDLINES
	for(var x = 0; x <= canvas.width; x += interval){
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.stroke();
		//GRID TEXT
		if(gridText){
			ctx.fillText(x + "", 5 + x, 5 + fontSize);
		}
	}
	ctx.closePath();
	if(nodes){
		//HORIZONTAL NODES
		for(var x = 0; x <= canvas.width; x += interval){
			var startNode = new Point(x, 0);
			var endNode = new Point(x, canvas.height);
			startNode.draw(ctx);
			endNode.draw(ctx);
		}
		//VERTICAL NODES
		for(var y = 0; y <= canvas.height; y += interval){
			var startNode = new Point(0, y);
			var endNode = new Point(canvas.width, y);
			startNode.draw(ctx);
			endNode.draw(ctx);
		}
	}
}

function updateGrid(){
	if(map.countries.length == 0){
		resetCanvas();
		var gridIncrement = parseInt(document.getElementById('grid-increment').value, 10);
		drawGrid(gridIncrement, false);
	}
	else{
		showAllCountries();
	}
}

function getPosition(event){
	var x = event.x;
	var y = event.y;
	
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;

	var wrap = document.getElementById('canvas-wrap');
	x += wrap.scrollLeft;
	y += wrap.scrollTop;

	//alert(x + ", " + y);

	return new Coordinate(x, y);
}

CanvasMap.prototype.checkColorContact = function(color){
	var contact = false;
	for(var i = 0; i < this.countries.length; i++){
		log(color + " | " + this.countries[i].color);
		if(color == this.countries[i].color){
			contact = true;
			log("Color Contact!");
		}
	}
	return contact;
}

function clickCanvas(event){
	var coord = getPosition(event);
	/*var color = checkColor(coord.x, coord.y);
	var touchCountry = map.checkColorContact(color);*/
	var select = document.getElementById('country-select').value;
	if(select != -1){
		var point = new Point(coord.x, coord.y);
		var contact = toolbar.checkContact(coord.x, coord.y);
		if(!contact){
			if(toolbar.moving){
				var currentIndex = document.getElementById('current-index').value;
				toolbar.tempPoints.splice(currentIndex, 1, point);
			}
			else{
				toolbar.pushTempPoint(point);
			}
			outClick();
		}
	}
}

function checkColor(x, y){
	var data = ctx.getImageData(x, y, 1, 1).data;
	var color = 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
	//log(color);
	var hex = rgbToHex(data[0], data[1], data[2]);
	log(hex);
	return hex;
}