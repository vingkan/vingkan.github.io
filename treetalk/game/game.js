function updateBoardSize(size){
	less.modifyVars({
		'@boardSize': size
	});
}

function getWindowDimensionLimit(){
	return ((window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth);
}

function updateGameWindow(){
	var limitSize = getWindowDimensionLimit() * 0.95;
	board.size = limitSize;
	board.roadSize = limitSize / 12;
	updateBoardSize(limitSize.toString() + "px");
	board.print();
}