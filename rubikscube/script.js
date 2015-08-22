/*
* Creates and returns a standard Rubik's Cube in solved form
*/
function createRubiksCube(){
	//HEADER: new Part(up, down, front, back, left, right, temp){
	var colorUp = 'green';
	var colorDown = 'blue';
	var colorFront = 'white';
	var colorBack = 'yellow';
	var colorLeft = 'red';
	var colorRight = 'orange';

	var parts = [];
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label(colorFront), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorBack), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label('blank'), new Label(colorBack), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label(colorFront), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label(colorFront), new Label('blank'), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label('blank'), new Label('blank'), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label('blank'), new Label(colorBack), new Label('blank'), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label(colorFront), new Label('blank'), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label(colorFront), new Label('blank'), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorBack), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label('blank'), new Label('blank'), new Label(colorBack), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label(colorFront), new Label('blank'), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label(colorFront), new Label('blank'), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label('blank'), new Label(colorBack), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label(colorUp), new Label('blank'), new Label('blank'), new Label(colorBack), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label(colorFront), new Label('blank'), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label(colorFront), new Label('blank'), new Label(colorLeft), new Label('blank'), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label('blank'), new Label(colorBack), new Label('blank'), new Label(colorRight), false));
		parts.push(new Part(new Label('blank'), new Label(colorDown), new Label('blank'), new Label(colorBack), new Label(colorLeft), new Label('blank'), false));
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