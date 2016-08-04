// Initialize Firebase with 3.0 API
firebase.initializeApp(window.CONFIG);

window.toggleLoading = function(assertion){
	if(assertion){
		document.body.classList.add('loading');
	}
	else{
		document.body.classList.remove('loading');
	}
}

window.toggleSpace = function(spaceID){
	var spaces = document.getElementsByClassName('space');
	for(var i = 0; i < spaces.length; i++){
		spaces[i].style.display = 'none';
	}
	var space = document.getElementById(spaceID);
		space.style.display = 'inline-block';
}

renderUserModule();
renderSearchModule();

window.toSentenceCase = function(string){
	var response = '';
	var names = string.toLowerCase().split(' ');
	for(var i = 0; i < names.length; i++){
		var name = names[i];
		response += name[0].toUpperCase() + name.substr(1) + ' ';
	}
	return response.trim();
}

window.getUserSnippet = function(){
	var info = document.querySelector('#user-info').childNodes[0].childNodes;
	var user = {};
	user.name = window.toSentenceCase(info[0].innerText);
	user.since = info[1].innerText;
	user.visits = info[2].innerText;
	user.email = info[3].innerText;
	user.uid = info[4].innerText.split('UID: ')[1];
	var snippet = user.name + '\t' + 'User' + '\t\t' + user.since + '\t' + user.uid + '\t\t\t\t' + user.email + '\t' + user.visits;
	window.prompt('Copy the user snippet:', snippet);
}