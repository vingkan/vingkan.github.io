var fireChat = new Firebase('https://tinderpreneurship.firebaseio.com/chat');

function login(){
	fireChat.authWithOAuthPopup("facebook", function(error, authData){
		if(error){
			console.log(authData);
			console.log(error);
			console.log('Brendan Batliner is a dick.');
		}
	});
}

fireChat.onAuth(function(authData){
	console.log('running fireChat.onAuth');
	if(authData){
		initChat(authData);
	}
});


function initChat(authData){
	console.log('running initChat');
	var chat = new FirechatUI(fireChat, document.getElementById('firechat-wrapper'));
	chat.setUser(authData.uid, authData[authData.provider].displayName);
}

console.log('LOADED chat.js');