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
	return"up: " + this.getLabel('up').toChar() + ", down: " + this.getLabel('down').toChar() + ", front: " + this.getLabel('front').toChar() + ", back: " + this.getLabel('back').toChar() + ", left: " + this.getLabel('left').toChar() + ", right: " + this.getLabel('right').toChar();
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
			console.log('Invalid Face.');
			break;
	}
	return label;
}

/*
* Saves the last orientation of the part as a temporary part representation
*/
Part.prototype.saveLastOrientation = function(){
	var tempPart = new Part(this.up, this.down, this.front, this.back, this.left, this.right, true);
	this.last = tempPart;
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
* Basic method to rotate the orientation of a part with respect to basic directions
* var face (string): the face to be rotated
* var clockwise (boolean): rotate face clockwise, counter-clockwise if false
*/
Part.prototype.rotate = function(face, clockwise){
	//Save the part's last orientation to refer to while rotating and in case a move needs to be undone
	this.saveLastOrientation();
	//Rotate label values around focused face
	if(clockwise){
		switch(face){
			case 'up':
				this.left = this.last.front;
				this.back = this.last.left;
				this.right = this.last.back;
				this.front = this.left;
				break;
			case 'down':
				this.right = this.last.front;
				this.front = this.last.left;
				this.left = this.last.back;
				this.back = this.right;
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
	console.log("Changed [" + this.last.toString() + "] to [" + this.toString() + "]");
}