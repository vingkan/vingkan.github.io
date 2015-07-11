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
Cube.prototype.getFace = function(face){
	var partsArray = [];
	for(var i = 0; i < this.parts.length; i++){
		if(this.parts[i].getLabel(face).color != 'blank'){
			partsArray.push(this.parts[i]);
			//console.log(this.parts[i].toString());
		}
	}
	return partsArray;
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
			borders = ['back', 'up', 'front', 'down'];
			break;
		case 'right':
			borders = ['back', 'down', 'front', 'up'];
			break;
		default:
			alert('Invalid Face.');
			break;
	}
	return borders;
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
		faceDiv.innerHTML = "";
	var faceParts = this.organizeFace(face);
	for(var i = 0; i < faceParts.length; i++){
		faceDiv.innerHTML += faceParts[i].getLabel(face).toHTML(faceParts[i].type);
	}
}