function log(entry){
	var console = document.getElementById('console');
	console.value += entry + '\n';
}

function deg(degrees){
	return (Math.PI/180)*degrees;
}

function Coordinate(x, y){
	this.x = x || 0;
	this.y = y || 0;	
}

Coordinate.prototype.toString = function(){
	return "(" + this.x + ", " + this.y + ")";
}

function rotateArray(inputArray, forward){
	var array = inputArray;
	if(forward){
		var last = array[array.length-1];
		array.splice(0, 0, last);
		array.splice(array.length-1, 1);
	}
	else{
		var first = array[0];
		array.push(first);
		array.splice(0, 1);
	}
	return array;
}

function swapItems(array, index1, index2){
	var item1 = array[index1];
	var item2 = array[index2];
	array.splice(index1, 1, item2);
	array.splice(index2, 1, item1);
}

/*
* LINK: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
* componentToHex()
* rgbToHex()
*/

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
