function solve(){
	outStream("Start solution sequence.\n---");
	solveCross('up');
	solveCorners('up');
	solveMiddle('down');
	outStream("---\nPsych. Solve feature currently in development.");
}

function solveCross(face){
	//var face = 'right';
	var centerColor = cube.findCenter(face).getLabel(face).color;
	var borders = cube.getBorders(face);
	//UP: borders = ['back', 'right', 'front', 'left'];
	var oppositeFace = '';
	var edgeFace = '';
	var edgeColor = '';
	var targetPart = null;
	var targetColorFace = null;
	var edgeColorFace = null;
	for(var f = 0; f < borders.length; f++){
		//var f = 1; //Work with Up/right Edge Part
		//Remove when recreating loop
		oppositeFace = cube.getOppositeFace(face);
		edgeFace = borders[f];
		edgeColor = cube.findCenter(edgeFace).getLabel(edgeFace).color;
console.log("BEGIN\nSearching for the " + centerColor + " with the " + edgeColor + " edge.");
		targetPart = cube.findByColors('edge', [centerColor, edgeColor]);
		targetColorFace = targetPart.getFaceByColor(centerColor);
			//console.log("Target Color is on the " + targetColorFace + " face.");
		edgeColorFace = targetPart.getFaceByColor(edgeColor);
			//console.log("Edge Color is on the " + edgeColorFace + " face.");
		//Begin Manipulation
		while(!(targetPart.hasLabels([face, edgeFace], 1))){
			if(targetPart.hasLabels([oppositeFace], 1)){
				rotate(oppositeFace, true);
			}
			else{
				var edgeSlot = cube.findEdge(face, edgeFace);
				//Need to do a better job of finding edgeSlot
				var shareFace = targetPart.getFaceByColor(edgeColor);
				while(!(edgeSlot.hasLabels([shareFace], 1))){
					rotate(face, true);
				}
				while(!(targetPart.getFaceByColor(centerColor) == face)){
					rotate(shareFace, true);
				}
			}
		}

		var positionedFace = '';
		if(targetPart.hasLabels([face], 1)){
			positionedFace = face;
		}
		else if(targetPart.hasLabels([edgeFace], 1)){
			positionedFace = edgeFace;
		}

		console.log(positionedFace + " = positionedFace")

		while(!(targetPart.hasLabels([face, edgeFace], 2))){
			rotate(positionedFace, true);
		}
		if(targetPart.getLabel(face).color != centerColor){
			flipEdge(face, edgeFace);
		}

	} //End of Loop
	//Check edges: TEMPORARY FIX
	var correctFaces = 0;
	for(var b = 0; b < borders.length; b++){
		var faceCorrect = (cube.findEdge(face, borders[b]).getLabel(face).color == centerColor);
		var edgeCorrect = (cube.findEdge(face, borders[b]).getLabel(borders[b]).color == cube.findCenter(borders[b]).getLabel(borders[b]).color);
//console.log(cube.findEdge(face, borders[b]).getLabel(borders[b]).color + '==' + cube.findCenter(borders[b]).getLabel(borders[b]).color)
		if(faceCorrect && edgeCorrect){
			correctFaces++;
		}
		else{
//console.log('faceCorrect: ' + faceCorrect + ', edgeCorrect: ' + edgeCorrect);
		}
	}
//console.log("CORRECT FACES: " + correctFaces + "\n");
	if(correctFaces < 4){
		alert("Needed multiple tries.");
		solveCross(face);
	}
}

/*
* Algorithm I: Flip a reversed edge part in the correct position to match correctly to the boundary centers
* 3D Specifications: Target face in the up position, Edge face in the right position
* Repeat Note: This algorithm is only called once at a time
* var targetFace (string): the target face
* var edgeFace (string): the edge face
*/
function flipEdge(targetFace, edgeFace){
	//runCommands(["Ri", "U", "Fi", "Ui"]);
	var orientedUp = targetFace;
	var orientedRight = edgeFace;
	var orientedFront = getOrientedFront(targetFace, edgeFace);
	console.log("Up: " + orientedUp + ", Right: " + orientedRight + ", Front: " + orientedFront);
	rotate(orientedRight, false);
	rotate(orientedUp, true);
	rotate(orientedFront, false);
	rotate(orientedUp, false);
}

function checkCross(face){
	var complete = false;
	var crossColor = cube.getFaceColor(face);
	var faceParts = cube.getFace(face, 'edge');
	var correctParts = 0;
		//Check Levels
		var isEdge = false;
		var faceColor = false;
		var edgeColor = false;
	var currentEdgeFace = '';
	for(var f = 0; f < faceParts.length; f++){
		currentEdgeFace = faceParts[f].getEdgeFace(face);
		isEdge = (faceParts[f].isType('edge'));
		faceColor = (faceParts[f].getLabel(face).color == crossColor);
		edgeColor = (faceParts[f].getLabel(currentEdgeFace).color == cube.getFaceColor(currentEdgeFace));
		if(isEdge && faceColor && edgeColor){
			correctParts++;
		}
	}
	if(correctParts == 4){
		complete = true;
	}
	return complete;
}

function getOrientedFront(orientedUp, orientedRight){
	var borders = cube.getBorders(orientedUp);
	var edgeFaceIndex = 0;
	for(var b = 0; b < borders.length; b++){
		if(borders[b] == orientedRight){
			edgeFaceIndex = b;
			break;
		}
	}
	if(edgeFaceIndex == (borders.length - 1)){
		edgeFaceIndex = 0;
	}
	else{
		edgeFaceIndex += 1;
	}
	return borders[edgeFaceIndex];
}

function getOrientedFaces(orientedUp, orientedRight){
	//Part(up, down, front, back, left, right...)
	var orientedFaces = [];
		orientedFaces.push(orientedUp); //0: Up
		orientedFaces.push(cube.getOppositeFace(orientedUp)); //1: Down
		orientedFaces.push(getOrientedFront(orientedUp, orientedRight)); //2: Front
		orientedFaces.push(cube.getOppositeFace(getOrientedFront(orientedUp, orientedRight))); //3: Back
		orientedFaces.push(cube.getOppositeFace(orientedRight)); //4: Left
		orientedFaces.push(orientedRight); //5: Right
	return orientedFaces;
}

function solveCorners(face){
	//Faces
	var edgeFace1 = '';
	var edgeFace2 = '';
	//Colors
	var targetColor = cube.getFaceColor(face);
	var edgeColor1 = null;
	var edgeColor2 = null;
	//Loop Items
	var targetPart = null;
	var borders = cube.getBorders(face);
	//borders = ['back', 'right', 'front', 'left'];
	console.log(borders);
	for(var f = 0; f < borders.length; f++){
		edgeFace1 = borders[f];
		edgeFace2 = borders[f+1];
		if(f == (borders.length-1)){
			edgeFace2 = borders[0];
		}
		console.log("Solving for the " + face + ", " + edgeFace1 + ", and " + edgeFace2 + " corner.");
		edgeColor1 = cube.getFaceColor(edgeFace1);
		edgeColor2 = cube.getFaceColor(edgeFace2);
		targetPart = cube.findByColors('corner', [targetColor, edgeColor1, edgeColor2]);
		while(!(targetPart.hasLabels([face, edgeFace1, edgeFace2], 3) || targetPart.hasLabels([cube.getOppositeFace(face), edgeFace1, edgeFace2], 3))){
			console.log("Has Up: " + targetPart.hasLabels([face, edgeFace1, edgeFace2], 3) + ", Has Down: " + targetPart.hasLabels([cube.getOppositeFace(face), edgeFace1, edgeFace2], 3));
			if(targetPart.hasLabels([cube.getOppositeFace(face)], 1)){
				rotate(cube.getOppositeFace(face), true);
			}
			else{
				rotate(face, true);
			}
		}
		//Target Part in Position
		console.log("Has Up: " + targetPart.hasLabels([face, edgeFace1, edgeFace2], 3) + ", Has Down: " + targetPart.hasLabels([cube.getOppositeFace(face), edgeFace1, edgeFace2], 3));
		while(!(targetPart.getLabel(face).color == targetColor && targetPart.getLabel(edgeFace1).color == edgeColor1 && targetPart.getLabel(edgeFace2).color == edgeColor2)){
			flipCorner(face, edgeFace1);
		}
	}
	//Temporary Fix
	while(!(checkCross(face))){
		rotate(face, true);
	}
}

/*
* Algorithm II: Flip a reversed edge part in the correct position to match correctly to the boundary centers
* 3D Specifications:
* Repeat Note: This algorithm is only called once at a time
* var targetFace (string): the target face
* var edgeFace (string): the edge face
*/
function flipCorner(targetFace, edgeFace){
	//runCommands(["Ri", "Di", "R", "D"]);
	var orientedFaces = getOrientedFaces(targetFace, edgeFace);
	var orientedRight = orientedFaces[5];
	var orientedDown = orientedFaces[1];
	rotate(orientedRight, false);
	rotate(orientedDown, false);
	rotate(orientedRight, true);
	rotate(orientedDown, true);
}

function solveMiddle(face){
	var faceParts = cube.getFace(face);
	for(var p = 0; p < faceParts.length; p++){
		if(faceParts[p].isType('edge')){

		}
	}
}

/*
* Algorithm III: Flip a reversed edge part in the correct position to match correctly to the boundary centers
* 3D Specifications:
* Repeat Note: This algorithm is only called once at a time
* var targetFace (string): the target face
* var edgeFace (string): the edge face
*/
function flipMiddle(targetFace, edgeFace){
	var orientedFaces = getOrientedFaces(targetFace, edgeFace);
}