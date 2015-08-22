/*
* Constructor for Part class
* Represents a single part of a Rubik's Cube (a miniature cube)
* var up, down, front, back, left, right (label): label to put on designated part face, if no label, use null
* var temp (boolean): the part is a temporary representation, part is a physical piece if false
*/
function Part(up, down, front, back, left, right, temp){
	this.type = null;
	this.up = up;
	this.down = down;
	this.front = front;
	this.back = back;
	this.left = left;
	this.right = right;
	this.temp = temp || false;
	this.last = null;
	//Initial method calls
	this.updateType();
}

/*
* Returns a string representation of the labels on the part's faces
*/
Part.prototype.toString = function(){
	return "up: " + this.getLabel('up').toChar() + ", down: " + this.getLabel('down').toChar() + ", front: " + this.getLabel('front').toChar() + ", back: " + this.getLabel('back').toChar() + ", left: " + this.getLabel('left').toChar() + ", right: " + this.getLabel('right').toChar();
}

Part.prototype.isType = function(type){
	var response = false;
	if(this.type == type){
		response = true;
	}
	return response;
}

/*
* Get label of part on a given face. Use this method instead of calling variable directly (e.g., this.up)
* var face (string): face to return label from
*/
Part.prototype.getLabel = function(face){
	var label = null;
	switch(face){
		case 'up':
			label = this.up;
			break;
		case 'down':
			label = this.down;
			break;
		case 'front':
			label = this.front;
			break;
		case 'back':
			label = this.back;
			break;
		case 'left':
			label = this.left;
			break;
		case 'right':
			label = this.right;
			break;
		default:
			console.log(face + ' is an Invalid Face.');
			break;
	}
	return label;
}

Part.prototype.getAllLabels = function(nonBlank){
	var all = nonBlank || true;
	var labels = [];
		labels.push(this.up);
		labels.push(this.down);
		labels.push(this.front);
		labels.push(this.back);
		labels.push(this.left);
		labels.push(this.right);
	if(!all){
		for(var l = 0; l < labels.length; l++){
			if(labels[l].color == 'blank'){
				labels.slice(l, 1);
			}
		}
	}
	return labels;
}

/*
* Saves the last orientation of the part as a temporary part representation
*/
Part.prototype.saveLastOrientation = function(){
	var tempPart = new Part(this.up, this.down, this.front, this.back, this.left, this.right, true);
	this.last = tempPart;
	//console.log("Saved: " + this.toString());
}

/*
* Check labels of part and update type: center (1 label), edge (2 labels), or corner (3 labels)
*/
Part.prototype.updateType = function(){
	var labels = 0;
	if(this.up.color != 'blank'){
		labels++;
	}
	if(this.down.color != 'blank'){
		labels++;
	}
	if(this.front.color != 'blank'){
		labels++;
	}
	if(this.back.color != 'blank'){
		labels++;
	}
	if(this.left.color != 'blank'){
		labels++;
	}
	if(this.right.color != 'blank'){
		labels++;
	}
	switch(labels){
		case 0:
			this.type = 'not-painted';
			break;
		case 1:
			this.type = 'center';
			break;
		case 2:
			this.type = 'edge';
			break;
		case 3:
			this.type = 'corner';
			break;
		default:
			this.type = 'over-painted';
			break;
	}
}

/*
* Checks all faces of a part to see if any labels are of a given color
* var color (color): the color to check for
*/
Part.prototype.hasColor = function(color){
	var included = false;
	if(this.up.color == color){
		included = true;
	}
	if(this.down.color == color){
		included = true;
	}
	if(this.front.color == color){
		included = true;
	}
	if(this.back.color == color){
		included = true;
	}
	if(this.left.color == color){
		included = true;
	}
	if(this.right.color == color){
		included = true;
	}
	return included;
}

/*
* Checks all faces of a part and returns the one with a label of the given color
* var color (color): the color to check for
*/
Part.prototype.getFaceByColor = function(color){
	var face = null;
	if(this.up.color == color){
		face = 'up';
	}
	if(this.down.color == color){
		face = 'down';
	}
	if(this.front.color == color){
		face = 'front';
	}
	if(this.back.color == color){
		face = 'back';
	}
	if(this.left.color == color){
		face = 'left';
	}
	if(this.right.color == color){
		face = 'right';
	}
	return face;
}

/*
* Basic method to rotate the orientation of a part with respect to basic directions
* var face (string): the face to be rotated
* var clockwise (boolean): rotate face clockwise, counter-clockwise if false
*/
Part.prototype.rotate = function(face, clockwise){
	this.checkDuplicateLabels('Start of Rotation...');
	//Save the part's last orientation to refer to while rotating and in case a move needs to be undone
	this.saveLastOrientation();
	//Rotate label values around focused face
	if(clockwise){
		switch(face){
			case 'up':
				this.left = this.last.front;
				this.back = this.last.left;
				this.right = this.last.back;
				this.front = this.last.right;
				break;
			case 'down':
				this.right = this.last.front;
				this.front = this.last.left;
				this.left = this.last.back;
				this.back = this.last.right;
				break;
			case 'front':
				this.up = this.last.left;
				this.left = this.last.down;
				this.down = this.last.right;
				this.right = this.last.up;				
				break;
			case 'back':
				this.up = this.last.right;
				this.right = this.last.down;
				this.down = this.last.left;
				this.left = this.last.up;
				break;
			case 'left':
				this.up = this.last.back;
				this.back = this.last.down;
				this.down = this.last.front;
				this.front = this.last.up;
				break;
			case 'right':
				this.up = this.last.front;
				this.front = this.last.down;
				this.down = this.last.back;
				this.back = this.last.up;
				break;
			default:
				console.log("Invalid Face.");
				break;
		}
	}
	else{
		switch(face){
			case 'up':
				this.left = this.last.back;
				this.back = this.last.right;
				this.right = this.last.front;
				this.front = this.last.left;
				break;
			case 'down':
				this.right = this.last.back;
				this.front = this.last.right;
				this.left = this.last.front;
				this.back = this.last.left;
				break;
			case 'front':
				this.up = this.last.right;
				this.left = this.last.up;
				this.down = this.last.left;
				this.right = this.last.down;				
				break;
			case 'back':
				this.up = this.last.left;
				this.right = this.last.up;
				this.down = this.last.right;
				this.left = this.last.down;
				break;
			case 'left':
				this.up = this.last.front;
				this.back = this.last.up;
				this.down = this.last.back;
				this.front = this.last.down;
				break;
			case 'right':
				this.up = this.last.back;
				this.front = this.last.up;
				this.down = this.last.front;
				this.back = this.last.down;
				break;
			default:
				console.log("Invalid Face.");
				break;
		}
	}
	this.checkDuplicateLabels('End of Rotation...');
	//console.log("Changed [" + this.last.toString() + "] to [" + this.toString() + "]");
}

Part.prototype.checkDuplicateLabels = function(location){
	var colors = [];
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	var coloredLabels = 0;
	for(var i = 0; i < faces.length; i++){
		coloredLabels = this.checkColor(this.getLabel(faces[i]).color);
		if(coloredLabels > 1){
			console.log(location + " " + faces[i] + " has " + coloredLabels + " duplicate labels.");
		}
	}

}

Part.prototype.checkColor = function(array, color){
	var coloredLabels = 0;
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	for(var i = 0; i < faces.length; i++){
		if(this.getLabel(faces[i]).color == color){
			coloredLabels++;
		}
	}
	return coloredLabels;
}

/*
* Checks the labels on the given faces and determines if the number of faces specified are non-blank (labeled)
* var faces (string[]): the faces to check
* var matches (int): the number of faces that must be non-blank to be considered labeled
*/
Part.prototype.hasLabels = function(faces, matches){
	var labeled = false;
	var labels = 0;
	for(var f = 0; f < faces.length; f++){
		if(this.getLabel(faces[f]).color != 'blank'){
			labels++;
		}
	}
	if(labels >= matches){
		labeled = true;
	}
	return labeled;
}

Part.prototype.getEdgeFace = function(targetFace){
	var edgeFace = '';
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	for(var f = 0; f < faces.length; f++){
		if(this.getLabel(faces[f]).color != 'blank'){
			edgeFace = faces[f];
		}
	}
	if(!(this.isType('edge'))){
		edgeFace = 'WRONG PART TYPE ERROR';
	}
	return edgeFace;
}