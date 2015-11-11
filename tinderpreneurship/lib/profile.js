/*--------------------------------------------*/
/*---> LISTS <--------------------------------*/
/*--------------------------------------------*/

var skills = [
	"Public Speaking",
	"Graphic Design",
	"Brainstorming",
	"Web Development",
	"Time Management",
	"Slide Decks",
	"Reports",
	"Statistics",
	"Animation",
	"Photography",
	"Finances",
	"Business Model Canvases"
];

/*--------------------------------------------*/
/*---> FORMS <--------------------------------*/
/*--------------------------------------------*/

function createHTMLCheckbox(checkboxData){
	var html = '';
	html += '<label class="checkSquareLabel">';
		html += '<input type="checkbox" name="';
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

	if(userID){
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
	}
	else{
		console.log("ERROR: UserID not authenticated.");
	}

}

/*--------------------------------------------*/
/*---> LOADING <------------------------------*/
/*--------------------------------------------*/

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
			skillsRef.once("value", function(snapshot){
				profileSkills = snapshot.val();
			});
		callback();
	}

	function loadSkillsCallback(){
		if(userID){
			var output = document.getElementById('center-' + formID);
				output.innerHTML = "";
				console.log(profileSkills)
			var size = skills.length;
			for(var s = 0; s < size; s++){
				output.innerHTML += (createHTMLCheckbox({
					name: formID,
					value: skills[s],
					checked: findInList(skills[s], profileSkills)
				}));
			}
		}
		else{
			console.log("ERROR: UserID not authenticated.");
		}
	}

	loadProfileSkills(loadSkillsCallback);

}

console.log("LOADED profile.js");