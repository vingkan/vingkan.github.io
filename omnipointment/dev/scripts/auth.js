var USER_ID;

function checkUserInDatabase(authData){
	USER_ID = authData.google.id;
	sessionStorage.setItem('user', {
		uid: USER_ID,
		name: authData.google.displayName,
		email: authData.google.email,
		img: authData.google.profileImageURL
	});
	var path = "https://omnipointment.firebaseio.com/users/" + USER_ID;
	var userRef = new Firebase(path);
	userRef.once('value', function(snapshot){
		if(!snapshot.exists()){
			var userGoogleData = new Firebase(path + "/google");
			userGoogleData.set({
				uid: USER_ID,
				name: authData.google.displayName,
				email: authData.google.email,
				img: authData.google.profileImageURL
			});
			var userProfileData = new Firebase(path + "/profile");
			userProfileData.set({
				events: JSON.stringify([])
			});
			toggleSection('view-menu');
		}
		else{
			toggleSection('view-menu');
			var userImage = new Firebase(path + "/google/img/");
			userImage.once('value', function(snapshot){
				showUserImage(snapshot.val());
			});
		}
	});
}

function googleLogin(){
	var ref = new Firebase("https://omnipointment.firebaseio.com");
	ref.authWithOAuthPopup('google', function(error, authData){
		if(error){
			console.log(error);
		}
		else{
			console.log(authData);
			authObject = authData;
			checkUserInDatabase(authData);
		}
	},
	{
		scope: "email"
	});
}

function guestLogin(){
	var authData = {
		google: {
			id: 0000,
			displayName: 'Guest',
			email: 'guestuser',
			img: 'http://vingkan.github.io/omnipointment/style/img/purple.png'
		}
	}
	console.log(authData);
	authObject = authData;
	checkUserInDatabase(authData);
}

function showUserImage(imgURL){
	var bubble = document.getElementById('image-bubble');
	bubble.style.backgroundImage = "url(" + imgURL + ")";
}