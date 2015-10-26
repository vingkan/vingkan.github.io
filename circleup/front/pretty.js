function initScrollingHeader(){
	window.addEventListener('scroll', function(event){
		var distanceY = window.pageYOffset || document.documentElement.scrollTop,
			shrinkOn = 50,
			header = document.querySelector("header");
		if(distanceY > shrinkOn){
			classie.add(header, "smaller");
		}
		else{
			if(classie.has(header, "smaller")){
				classie.remove(header, "smaller");
			}
		}
	});
}

window.onload = initScrollingHeader();

function toggleWindow(windowID){
	var credentialWindow = document.getElementById(windowID);
	var shade = document.getElementById('shade');
	//console.log(credentialWindow.style.height)
	if(credentialWindow.style.height == '92vh'){
		credentialWindow.style.height = '0vh';
		shade.style.display = 'none';
	}
	else{
		credentialWindow.style.height = '92vh';
		shade.style.display = 'block';
	}
}

/*--------------------------------------------*/
/*---> KEY BINDINGS <-------------------------*/
/*--------------------------------------------*/

$('#loginEmail').keypress(function(event){
	if(event.keyCode == 13){
		login();
	}
});

$('#newName').keypress(function(event){
	if(event.keyCode == 13){
		addNewUser();
	}
});