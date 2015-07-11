/*
* Creates and returns a standard Rubik's Cube in solved form
*/
function createRubiksCube(){
	//HEADER: new Part('orange', 'red', 'green', 'blue', 'yellow', 'white', false)
	var parts = [];
	//Create center pieces
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
	//Create edge pieces
		//Orange Face
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		//Red Face
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		//Green Face
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		//DUPLICATE: parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		//Blue Face
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		//DUPLICATE: parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		//Yellow Face
		//DUPLICATE: parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('yellow'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('yellow'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('yellow'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('yellow'), false));
		//White Face
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
		//DUPLICATE: parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		//DUPLICATE: parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
	//Create corner pieces
		//Up Corners
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('yellow'), new Label('blank'), false));
		//Down Corners
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('yellow'), new Label('blank'), false));
	//Create cube
	var cube = new Cube(parts);
	return cube;
}