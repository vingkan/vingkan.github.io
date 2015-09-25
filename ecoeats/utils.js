function toggle(button, color1, color2){
	//var button = document.getElementById(id);
	if(button.style.background == color1){
		button.style.background = color2;
	}
	else{
		button.style.background = color1;
	}
}

function togglePayButton(id){
	var payButton = document.getElementById(id);
	var toggleStatus = false;
	setInterval(function () {
		if(toggleStatus){
			payButton.style.opacity = '0.5';
			toggleStatus = false;
		}
		else{
			payButton.style.opacity = '1.0';
			toggleStatus = true;
		}
	}, 500);
}