function updateBoardSize(size){
	less.modifyVars({
		'@boardSize': size + "px",
		'@bubbleSize': (size * 0.15) + "px"
	});
}

function getWindowDimensionLimit(){
	return ((window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth);
}

function updateGameWindow(){
	var limitSize = getWindowDimensionLimit() * 0.9;
	board.size = limitSize;
	board.roadSize = limitSize / 12;
	updateBoardSize(limitSize);
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

function closeAllWindows(){
	var windows = document.getElementsByClassName('statsWindow');
	for(var w = 0; w < windows.length; w++){
		windows[w].style.width = '0';
	}
}

function toggleMenu(menuID){
	closeAllWindows();
	if(document.getElementById(menuID).style.width == '20vw'){
		document.getElementById(menuID).style.width = '0';
	}
	else{
		document.getElementById(menuID).style.width = '20vw';
	}
}

var menuBarList = document.getElementById('menuBarList');
	menuBarList.style.width = '0px';

function toggleMenuBubble(){
	var bubbleSize = board.size * 0.15;
	var menuBubble = document.getElementById('menuBubble');
	var menuBarList = document.getElementById('menuBarList');
	if(menuBarList.style.width == '0px'){
		menuBarList.style.width = (2.0 * bubbleSize) + 'px';
		menuBubble.style.color = '#1a1a1a';
		menuBubble.style.fontSize = '0px';
	}
	else{
		menuBarList.style.width = '0px';
		menuBubble.style.color = 'white';
		menuBubble.style.fontSize = (0.5 * bubbleSize) + 'px';
	}
}