/*
* Creates and returns a standard Rubik's Cube in solved form
*/
function createRubiksCube(){
	//HEADER: new Part('orange', 'red', 'green', 'blue', 'yellow', 'white', false)
	var parts = [];
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('blank'), new Label('blue'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('green'), new Label('blank'), new Label('yellow'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('blank'), new Label('white'), false));
		parts.push(new Part(new Label('blank'), new Label('red'), new Label('blank'), new Label('blue'), new Label('yellow'), new Label('blank'), false));
	//Create cube
	var cube = new Cube(parts);
	return cube;
}

function createIsoCube(){
	//HEADER: new Part('orange', 'red', 'green', 'blue', 'yellow', 'white', false)
	var parts = [];
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), false));
		
		parts.push(new Part(new Label('orange'), new Label('blank'), new Label('green'), new Label('blank'), new Label('blank'), new Label('white'), false));

		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('purple'), new Label('blank'), new Label('blank'), new Label('purple'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('purple'), new Label('blank'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), false));
		parts.push(new Part(new Label('blank'), new Label('purple'), new Label('blank'), new Label('purple'), new Label('purple'), new Label('blank'), false));
	//Create cube
	var cube = new Cube(parts);
	return cube;
}