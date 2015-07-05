document.onkeydown = function(){
	switch(window.event.keyCode){
		//LEFT KEY
		case 37:
			moveCanvas('LEFT', 10);
			break;
		//UP KEY
		case 38:
			moveCanvas('UP', 10);
			break;
		//RIGHT KEY
		case 39:
			moveCanvas('RIGHT', 10);
			break;
		//DOWN KEY
		case 40:
			moveCanvas('DOWN', 10);
			break;
			//DEFAULT
		default:
			break;
	}
}