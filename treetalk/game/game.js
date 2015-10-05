function updateBoardSize(size){
	less.modifyVars({
		'@boardSize': size
	});
}

function getWindowDimensionLimit(){
	return ((window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth);
}

function updateGameWindow(){
	var limitSize = getWindowDimensionLimit() * 0.8;
	board.size = limitSize;
	board.roadSize = limitSize / 12;
	updateBoardSize(limitSize.toString() + "px");
	board.print();
}

function instructionsAlert(message, time){
	document.getElementById('instructions').innerHTML = message;
	document.getElementById('instructionsAlert').style.height = '10vh';
	setTimeout(function(){
		document.getElementById('instructionsAlert').style.height = '0vh';
	}, time);
	return 1.25 * time;
}

function instructionsSequence(){
	setTimeout(function(){
		setTimeout(function(){
			setTimeout(function(){
				instructionsAlert("Tap the light green menu on your left and find some trees to help you!", 2000)
			},instructionsAlert("Thankfully, trees help replace CO2 with oxygen.", 2000))
		}, instructionsAlert("These cars near you are creating tons of pollution!", 2000))
	}, instructionsAlert("Welcome to Tree Talk: The Game!", 2000))
}