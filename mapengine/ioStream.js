function IOStream(){
	this.lines = [];
	this.countryIndex = null;
}

function stream(){
	//map.countries = [];
	readInLines();
	ioStream.runLines();
	ioStream.readOut();
}

function readInLines(){
	var lines = [];
	var inBox = document.getElementById('inBox');
	var parse = inBox.value;
	var newLine = "";
	for(var i = 0; i < parse.length; i++){
		if(parse.charAt(i) == '\n'){
			lines.push(newLine);
			newLine = "";
		}
		else{
			newLine += parse.charAt(i);
		}
	}
	lines.push(newLine);
	ioStream.lines = lines;
	inBox.value = "";
	//return lines;
}

IOStream.prototype.runLines = function(){
	for(var i = 0; i < this.lines.length; i++){
		this.command(ioStream.lines[i]);
	}
}

IOStream.prototype.command = function(line){
	var key = line.substr(0,3);
	var command = line.substr(4);
	switch(key){
		case "cty":
			this.createCountry(command);
			break;
		case "pnt":
			this.addPoint(command);
			break;
		default:
			//alert("Command Not Found.");
	}
}

IOStream.prototype.createCountry = function(line){
	var name = "";
	var color = "";
	var endQuote = null;
	for(var i = 1; i < line.length; i++){
		if(line.charAt(i) == '"'){
			endQuote = i;
			break;
		}
		name += line.charAt(i);
	}
	var colorStart = endQuote + 2;
	for(var i = colorStart; i < line.length; i++){
		color += line.charAt(i);
	}
	this.countryIndex = newCountry(name, color);
}

IOStream.prototype.addPoint = function(line){
	var coord1 = "";
	var coord2 = "";
	var space = null;
	for(var i = 0; i < line.length; i++){
		if(line.charAt(i) == ' '){
			space = i;
			break;
		}
		coord1 += line.charAt(i);
	}
	var numberStart = space + 1;
	for(var i = numberStart; i < line.length; i++){
		coord2 += line.charAt(i);
	}
	var coord1 = parseInt(coord1, 10);
	var coord2 = parseInt(coord2, 10);
	var point = new Point(coord1, coord2);
	//alert("new Point(" + coord1 + ", " + coord2 + ")");
	map.countries[this.countryIndex].pushPoint(point);
	showAllCountries();
}

IOStream.prototype.readOut = function(){
	var outBox = document.getElementById('outBox');
		outBox.value = "";
	var outStream = "";
	for(var i = 0; i < map.countries.length; i++){
		outStream += 'cty ' + '"' + map.countries[i].name + '" ' + map.countries[i].color + '\n';
		for(var j = 0; j < map.countries[i].points.length; j++){
			outStream += 'pnt ' + map.countries[i].points[j].x + ' ' + map.countries[i].points[j].y + '\n';
		}
		outStream += '\n';
	}
	outBox.value = outStream;
}

function saveOutput(){
	ioStream.readOut();
	var text = document.getElementById('outBox').value;
	var file = new Blob([text], {type: "text/plain;charset=utf-8"});
	var date = new Date();
	var timestamp = date.getTime();
	saveAs(file, "Map Text Output (" + timestamp + ").txt");
}

function saveImage(){
	var gridIncrement = document.getElementById('grid-increment');
	var originalIncrement = gridIncrement.value;
		gridIncrement.value = 900;
		updateGrid();
	//var image = canvas.toDataURL('image/png');
	
	var date = new Date();
	var timestamp = date.getTime();
	var filename = "Map Image Output (" + timestamp + ").png";

	canvas.toBlob(function(blob){
		saveAs(blob, filename);
	})

	/*var printImage = document.getElementById('print-image');
	printImage.innerHTML = '<img src="' + image + '"/>';*/
	gridIncrement.value = originalIncrement;
	resetCanvas();
	map.draw();
}