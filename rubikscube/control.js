function rotate(face, clockwise, random){
	var directions = random || true;
	cube.rotate(face, clockwise);
	cube.draw();
	if(directions){
		if(clockwise){
			outStream("Rotate " + face + " face clockwise.");
		}
		else{
			outStream("Rotate " + face + " face counter-clockwise.");
		}
	}
}

function outStream(log){
	var outBox = document.getElementById('outBox');
		outBox.value += log + '\n';
}

function inStream(){
	var inBox = document.getElementById('inBox');
	var text = inBox.value;
	var commands = [];
	var command = "";
	for(var i = 0; i < text.length; i++){
		if(text[i] != ' '){
			command += text[i];
		}
		else{
			commands.push(command);
			command = "";
		}
	}
	if(command != ' '){
			commands.push(command);
			command = "";
	}
	runCommands(commands);
	//console.log(commands);
	inBox.value = '';
}

function runCommands(commands){
	var key = '';
	var face = '';
	var clockwise = true;
	for(var i = 0; i < commands.length; i++){
		key = commands[i].charAt(0).toLowerCase();
		//console.log('Key: ' + key);
		face = selectFace(key);
		//console.log('Face: ' + face);
		if(commands[i].length > 1 && commands[i].charAt(1) == 'i'){
			clockwise = false;
		}
		if(face != null){
			rotate(face, clockwise);
		}
		key = '';
		face = '';
		clockwise = true;
	}
}

function selectFace(key){
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	var face = null;
	for(var i = 0; i < faces.length; i++){
		if(key == faces[i].charAt(0)){
			//console.log(key + " == " + faces[i].charAt(0));
			face = faces[i];
		}
	}
	return face;
}

function randomRotation(){
	var faces = ['up', 'down', 'front', 'back', 'left', 'right'];
	var random = Math.floor((Math.random() * faces.length) + 0);
	var face = faces[random];
	var clockwise = false;
	if(random > 2){
		clockwise = true;
	}
	rotate(face, clockwise, false);
}

function scramble(rotations){
	for(var i = 0; i < rotations; i++){
		randomRotation();
	}
}

function toggleUnfoldedView(){
	var unfoldedContents = document.getElementById('unfoldedContents');
	var unfoldedView = document.getElementById('unfoldedView');
	var toggleUnfolded = document.getElementById('toggleUnfolded');
	if(unfoldedContents.style.display == 'none'){
		unfoldedContents.style.display = 'block';
		unfoldedView.style.height = '255px';
		toggleUnfolded.style.marginTop = '10px';
	}
	else{
		unfoldedContents.style.display = 'none';
		unfoldedView.style.height = '0';
		toggleUnfolded.style.marginTop = '0';
	}
		
}