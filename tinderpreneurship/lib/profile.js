/*--------------------------------------------*/
/*---> LISTS <--------------------------------*/
/*--------------------------------------------*/

var skills = [
	"Business Model Canvases",
	"Public Speaking",
	"Graphic Design",
	"Brainstorming",
	"Report Writing",
	"Marketing",
	"Programming",
	"Time Management",
	"Slide Presentation Design",
	"Statistics",
	"Animation",
	"Photography",
	"Finances",
	"Research",
	"CAD/Drafting",
	"UI/UX Design",
	"Server Side",
	"Comedy"
];

/*--------------------------------------------*/
/*---> FORMS <--------------------------------*/
/*--------------------------------------------*/

function createHTMLCheckbox(checkboxData){
	var html = '';
	html += '<label class="checkSquareLabel">';
		html += '<input type="checkbox" onchange="recordChange(this);" name="';
		html += checkboxData['name'];
		html += '" value="';
		html += convertOptionTagName(checkboxData['value'], false);
		html += '"'
		if(checkboxData['checked']){
			html += 'checked';
		}
		html += '>';
		html += '<div class="checkSquare"></div>';
		html += checkboxData['value'];
	html += '</label>';
	return html;
}

function getArrayFromForm(formName){
	var response = [];
	$('input[name="' + formName + '"]:checked').each(function(){
		response.push($(this).val());
	});
	return response;
}

/*--------------------------------------------*/
/*---> DATABASE <-----------------------------*/
/*--------------------------------------------*/

var unsavedChanges = false;

function recordChange(elementChanged){
	//console.log(elementChanged);
	unsavedChanges = true;
}

/*
* To add updating for new fields, simply add them to profileData
*/
function updateProfile(){

	function updateProfileFields(userID, profileData){
		var path = "tinderpreneurship.firebaseio.com/users/" + userID + "/profile/";
		$.each(profileData, function(key, value){
			var profileRef = new Firebase(path + key);
			profileRef.set(value);
		});
	}

	if(userID && unsavedChanges){
		var profileData = {
			description: document.getElementById('profile-description').value,
			strengths: JSON.stringify(
					getArrayFromForm('strengths')
				),
			desires: JSON.stringify(
					getArrayFromForm('desires')
				),
			peeves: document.getElementById('profile-peeves').value
		}
		updateProfileFields(userID, profileData);
		displayMessage("Your profile has been updated.<br>Click on the menu in the top right corner to browse other profiles.");
		unsavedChanges = false;
	}
	else{
		console.log("ERROR: UserID not authenticated. (or no changes to be saved)");
	}

}

/*--------------------------------------------*/
/*---> LOADING <------------------------------*/
/*--------------------------------------------*/

function loadProfile(){
	loadClientText('description');
	loadClientSkills('strengths');
	loadClientSkills('desires');
	loadClientText('peeves');
}

var profileSkills = [];

function loadClientSkills(formID){

	function findInList(search, array){
		var response = false;
		var size = array.length;
		for(var i = 0; i < size; i++){
			if(array[i] === search){
				response = true;
				break;
			}
		}
		return response;
	}

	function loadProfileSkills(callback){
		var path = "tinderpreneurship.firebaseio.com/users/" + userID + "/profile/";
		var skillsRef = new Firebase(path + formID);
			skillsRef.on("value", function(snapshot){
				profileSkills = JSON.parse(snapshot.val());
				callback();
			});	
	}

	function loadSkillsCallback(){
		if(userID){
			var output = document.getElementById('center-' + formID);
				output.innerHTML = "";
			var size = skills.length;
			for(var s = 0; s < size; s++){
				output.innerHTML += (createHTMLCheckbox({
					name: formID,
					value: skills[s],
					checked: findInList(convertOptionTagName(skills[s], false), profileSkills)
				}));
			}
		}
		else{
			console.log("ERROR: UserID not authenticated.");
		}
	}

	loadProfileSkills(loadSkillsCallback);

}

function loadClientText(formID){
	var output = document.getElementById('profile-' + formID);
	var path = "tinderpreneurship.firebaseio.com/users/" + userID + "/profile/";
	var textRef = new Firebase(path + formID);
		textRef.on("value", function(snapshot){
			output.value = snapshot.val();
		});	
}

var userDatabase = [];

function userFactory(data){
	var user = {
		uid: data['uid'],
		google: data['google'],
		profile: data['profile'],
		getProfileDiv: function(isAnon){
			var size;
			var displayname = (isAnon ? this.profile.secretname : this.google.name);
			var html = '<div class="people">';
			//console.log(this.uid)
				if(isAnon){
					html += '<button onclick="likeProfile(&quot;' + this.uid + '&quot;);">&#128077;</button>';
				}
				html += '<h2>' + displayname + '</h2>';
				if(isAnon){
					html += '<p class="subtitle">Click the &#128077; to like this profile.</p>';
				}
				else{
					html += '<p class="subtitle">Contact Me: ' + this.google.email + '</p>';	
				}
				html += '<h3>Description</h3>';
				if(this.profile.description){
					html += '<p>' + this.profile.description + '</p>';	
				}
				else{
					html += '<p>None.</p>';
				}
				html += '<h3>Skills I Have</h3>';
				html += '<ul>';
				var strengths = JSON.parse(this.profile.strengths);
				size = strengths.length;
				if(size > 0){
					for(var s = 0; s < size; s++){
						html += '<li>';
						html += convertOptionTagName(strengths[s], true);
						html += '</li>';
					}
				}
				else{
					html += '<li>None</li>'
				}
				html += '</ul>';
				html += '<h3>Skills I Want</h3>';
				html += '<ul>';
				var desires = JSON.parse(this.profile.desires);
				size = desires.length;
				if(size > 0){
					for(var s = 0; s < size; s++){
						html += '<li>';
						html += convertOptionTagName(desires[s], true);
						html += '</li>';
					}
				}
				else{
					html += '<li>None</li>'
				}
				html += '</ul>';
				html += '<h3>Pet Peeves</h3>';
				if(this.profile.peeves){
					html += '<p>' + this.profile.peeves + '</p>';	
				}
				else{
					html += '<p>None.</p>';
				}
				//html += '<div class="footerSpace"></div>';
			html += '</div>';
			return html;
		}
	}
	return user;
}

function loadProfileData(callback){
	var ref = new Firebase("https://tinderpreneurship.firebaseio.com/users");
	userDatabase = [];
	ref.on("value", function(snapshot){
		var data = snapshot.val();
		$.each(data, function(key, value){
			var user = userFactory({
				uid: key,
				google: value['google'],
				profile: value['profile']
			});
			userDatabase.push(user);
		});
		if(callback){
			callback();
		}
	});
}

/*--------------------------------------------*/
/*---> BROWSING <-----------------------------*/
/*--------------------------------------------*/

function likeProfile(likeUID){
	var path = "https://tinderpreneurship.firebaseio.com/users/";
	//UPDATE MY LIKES
	var myLikesRef = new Firebase(path + userID + "/profile/youliked");
	myLikesRef.once("value", function(snapshot){
		var data = JSON.parse(snapshot.val());
		data.push(likeUID);
		myLikesRef.set(JSON.stringify(data));
	});
	//UPDATE THEIR LIKES
	var likesRef = new Firebase(path + likeUID + "/profile/likedyou");
	likesRef.once("value", function(snapshot){
		var data = JSON.parse(snapshot.val());
		data.push(userID);
		likesRef.set(JSON.stringify(data));
		loadProfileData(loadBrowsingProfiles);
	});
}

function loadBrowsingProfiles(){
	var size = userDatabase.length;
	var output = document.getElementById('browsingSpace');
		output.innerHTML = "";
	var alreadyLiked = JSON.parse(getProfileById(userID).profile.youliked);
		//console.log('ALREADY LIKED:')
		//console.log(alreadyLiked)
	for(var u = 0; u < size; u++){
		if(userDatabase[u].uid != userID){
			if(!checkList(userDatabase[u].uid, alreadyLiked)){
				output.innerHTML += userDatabase[u].getProfileDiv(true);
			}
		}
	}
}

function checkList(targetID, userList){
	var found = false;
	//console.log(userList);
	var size = userList.length;
	for(var u = 0; u < size; u++){
		if(userList[u] === targetID){
			//console.log(userList[u] + ' vs' + targetID)
			//console.log('match!')
			found = true;
			break;
		}
	}
	return found;
}

function getProfileById(targetID){
	var response = 'not found';
	var size = userDatabase.length;
	for(var u = 0; u < size; u++){
		if(userDatabase[u].uid + '' == targetID){
			//console.log(userDatabase[u].uid + '' + '===' + targetID)
			response = userDatabase[u];
			break;
		}
	}
	//console.log('search: ' + targetID + ', response: ' + response);
	return response;
}

/*--------------------------------------------*/
/*---> CONTACTS <-----------------------------*/
/*--------------------------------------------*/

function loadContactProfiles(){
	var likedYouList = JSON.parse(getProfileById(userID).profile.likedyou);
	var youLikedList = JSON.parse(getProfileById(userID).profile.youliked);
	var size = likedYouList.length;
	var output = document.getElementById('contactSpace');
		output.innerHTML = "";
	if(size > 0){
		for(var u = 0; u < size; u++){
			if(likedYouList[u] != userID){
				if(checkList(likedYouList[u], youLikedList)){
					output.innerHTML += getProfileById(likedYouList[u]).getProfileDiv(false);
				}
			}
		}
	}
	else{
		output.innerHTML += '<p>You have no mutual contacts.</p>';
	}
}

console.log("LOADED profile.js");