/*
* Constructor for Cube class
* Represents a Rubik's Cube
*/
function Cube(parts){
	this.parts = parts || [];
}

/*
* Adds part to cube
* var part (part): part with labels
*/
Cube.prototype.addPart = function(part){
	this.parts.push(part);
}

/*
* Returns array of all parts with a non-blank label on the given face
* var face (string): the face to select
*/
Cube.prototype.getFace = function(face, getType){
	var type = getType || 'any';
	var partsArray = [];
	for(var i = 0; i < this.parts.length; i++){
		if(this.parts[i].getLabel(face).color != 'blank'){
			if(type == 'any'){
				partsArray.push(this.parts[i]);
			}
			else if(this.parts[i].isType(type)){
				partsArray.push(this.parts[i]);
			}
			//console.log(this.parts[i].toString());
		}
	}
	return partsArray;
}

Cube.prototype.getFaceColor = function(face){
	return this.findCenter(face).getLabel(face).color;
}

Cube.prototype.getColorFace = function(color){
	var response = '';
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	for(var f = 0; f < faces.length; f++){
		if(this.getFaceColor(faces[f]) == color){
			response = faces[f];
		}
	}
	return response;
}

Cube.prototype.checkSolved = function(){
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	var faceColor = null;
	var faceParts = [];
	var faceSolved = true;
	var solved = [];
	for(var i = 0; i < faces.length; i++){
		faceColor = this.findCenter(faces[i]).getLabel(faces[i]).color;
		faceParts = this.getFace(faces[i]);
		for(var p = 0; p < faceParts.length; p++){
			if(faceColor != faceParts[p].getLabel(faces[i]).color){
				faceSolved = false;
			}
		}
		solved.push(faceSolved);
		faceSolved = true;
	}
	var allSolved = true;
	for(var b = 0; b < solved.length; b++){
		if(!solved[b]){
			allSolved = false;
		}
	}
	return allSolved;
}

/*
* Selects and organizes all of the parts of a given face to prepare for output to the HTML visualizer
* var face (string): the face to organize
*/
Cube.prototype.organizeFace = function(face){
	var partsArray = this.getFace(face);
	var borders = this.getBorders(face);
	var faceArray = [];
		faceArray.push(this.findCorner(face, borders[0], borders[3])); //TOP LEFT
		faceArray.push(this.findEdge(face, borders[0])); //TOP MIDDLE
		faceArray.push(this.findCorner(face, borders[0], borders[1])); //TOP RIGHT
		faceArray.push(this.findEdge(face, borders[3])); //LEFT MIDDLE
		faceArray.push(this.findCenter(face)); //CENTER
		faceArray.push(this.findEdge(face, borders[1])); //RIGHT MIDDLE
		faceArray.push(this.findCorner(face, borders[3], borders[2])); //BOTTOM LEFT
		faceArray.push(this.findEdge(face, borders[2])); //BOTTOM MIDDLE
		faceArray.push(this.findCorner(face, borders[1], borders[2])); //BOTTOM RIGHT
	return faceArray;
}

/*
* Returns an array of the faces that share an edge with the given face on a cube in clockwise order starting with the top of the face box on the HTML visualizer
* var face (string): the face to select
*/
Cube.prototype.getBorders = function(face){
	var borders = [];
	switch(face){
		case 'up':
			borders = ['back', 'right', 'front', 'left'];
			break;
		case 'down':
			borders = ['front', 'right', 'back', 'left'];
			break;
		case 'front':
			borders = ['up', 'right', 'down', 'left'];
			break;
		case 'back':
			borders = ['down', 'right', 'up', 'left'];
			break;
		case 'left':
			borders = ['up', 'front', 'down', 'back'];
			break;
		case 'right':
			borders = ['up', 'back', 'down', 'front'];
			break;
		default:
			alert('Invalid Face.');
			break;
	}
	return borders;
}

Cube.prototype.getBorderColors = function(face){
	var borders = this.getBorders(face);
	var borderColors = [];
	for(var b = 0; b < borders.length; b++){
		borderColors.push(this.getFaceColor(borders[b]));
	}
	return borderColors;
}

/*
* Returns the face on the cube opposite the given face
* var face (string): the face to select
*/
Cube.prototype.getOppositeFace = function(face){
	var opposite = null;
	switch(face){
		case 'up':
			opposite = 'down';
			break;
		case 'down':
			opposite = 'up';
			break;
		case 'front':
			opposite = 'back';
			break;
		case 'back':
			opposite = 'front';
			break;
		case 'left':
			opposite = 'right';
			break;
		case 'right':
			opposite = 'front';
			break;
		default:
			console.log(face + ' is an Invalid Face.');
			break;
	}
	return opposite;
}

/*
* Finds a specific center part that is not blank on the given face
* var face (string): the face to select
*/
Cube.prototype.findCenter = function(face1){
	var target = null;
	for(var i = 0; i < this.parts.length; i++){
		if(this.parts[i].type == 'center' && this.parts[i].getLabel(face1).color != 'blank'){
			target = this.parts[i];
		}
	}
	//CATCH ERROR
	if(target == null){
		console.log("Could not find " + face1 + " center part.");
	}
	return target;
}

/*
* Finds a specific edge part that is not blank on the given faces
* var face1, face2 (string): the face to select
*/
Cube.prototype.findEdge = function(face1, face2){
	var target = null;
	for(var i = 0; i < this.parts.length; i++){
		if(this.parts[i].type == 'edge' && this.parts[i].getLabel(face1).color != 'blank' && this.parts[i].getLabel(face2).color != 'blank'){
			target = this.parts[i];
		}
	}
	//CATCH ERROR
	if(target == null){
		console.log("Could not find Edge part with " + face1 + " and " + face2 + ".");
	}
	return target;
}

/*
* Finds a specific corner part that is not blank on the given faces
* var face1, face2, face3 (string): the face to select
*/
Cube.prototype.findCorner = function(face1, face2, face3){
	var target = null;
	for(var i = 0; i < this.parts.length; i++){
		if(this.parts[i].type == 'corner' && this.parts[i].getLabel(face1).color != 'blank' && this.parts[i].getLabel(face2).color != 'blank' && this.parts[i].getLabel(face3).color != 'blank'){
			target = this.parts[i];
		}
	}
	//CATCH ERROR
	if(target == null){
		console.log("Could not find Corner part with " + face1 + ", " + face2 + ", and " + face3 + ".");
	}
	return target;
}

/*
* Returns all parts of a given type as an array
* var type (string): the type of part to return ('center', 'edge', 'corner')
*/
Cube.prototype.findByType = function(type){
	var typeParts = [];
	for(var i = 0; i < this.parts.length; i++){
		if(this.parts[i].type == type){
			typeParts.push(this.parts[i]);
		}
	}
	return typeParts;
}

/*
* Finds a part of a given type with faces of the given colors
* var type (string): the type of part to return ('center', 'edge', 'corner')
* var colors (color[]): the colors to check for, all must be matched
*/
Cube.prototype.findByColors = function(type, colors){
	var target = null;
	var typeParts = this.findByType(type);
	var colorsIncluded = 0;
	for(var t = 0; t < typeParts.length; t++){
		colorsIncluded = 0;
		for(var c = 0; c < colors.length; c++){
			if(typeParts[t].hasColor(colors[c])){
				colorsIncluded++;
			}
		}
		if(colorsIncluded == colors.length){
			target = typeParts[t];
		}
	}
	return target;
}

/*
* Basic method to rotate a face of a cube with respect to basic directions
* var face (string): the face to be rotated
* var clockwise (boolean): rotate face clockwise, counter-clockwise if false
*/
Cube.prototype.rotate = function(face, clockwise){
	var faceArray = this.getFace(face);
	for(var i = 0; i < faceArray.length; i++){
		faceArray[i].rotate(face, clockwise);
	}
}

/*
* Outputs cube labels to HTML visualizer
*/
Cube.prototype.draw = function(){
	var faces = ["up", "down", "front", "back", "left", "right"];
	for(var i = 0; i < faces.length; i++){
		this.drawFace(faces[i]);
	}
}

/*
* Collects all parts with non-blank labels on a given face and draws them on HTML visualizer
* var face (string): face to draw
*/
Cube.prototype.drawFace = function(face){
	var faceDiv = document.getElementById('face-' + face);
	var faceDivSquare = document.getElementById('faceSquare-' + face);
		faceDiv.innerHTML = "";
		faceDivSquare.innerHTML = "";
	var faceParts = this.organizeFace(face);
	for(var i = 0; i < faceParts.length; i++){
		faceDiv.innerHTML += faceParts[i].getLabel(face).toHTML(faceParts[i].type, true);
		faceDivSquare.innerHTML += faceParts[i].getLabel(face).toHTML(faceParts[i].type, false);
	}
}