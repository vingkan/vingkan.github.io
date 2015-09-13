function submitOne(){
	var googleFirstName = document.getElementById('entry_1191619877');
	var googleLastName = document.getElementById('entry_2134594167');
	var userFirstName = document.getElementById('userfirstname');
	var userLastName = document.getElementById('userlastname');
	googleFirstName.value = userfirstname.value;
	googleLastName.value = userlastname.value;
	var potentialUni = userfirstname.value.charAt(0) + userlastname.value;
	var userKeys = document.getElementById('userKeys');
	var userKeyData = userKeys.value;
	var currentKeys = [];
	var forKey = '';
	for(var c = 0; c < userKeyData.length; c++){
		if(userKeyData.charAt(c) != '\n'){
			currentKeys.push(forKey);
			forKey = '';
		}
		else{
			forKey += userKeyData.charAt(c);
		}
	}
	var unique = true;
	var highestNumber = 1;
	for(var k = 0; k < currentKeys.length; k++){
		if(currentKeys[k].substring(0, 2) == potentialUni.substring(0, 2)){
			unique = false;
			if(parseInt(currentKeys[k].charAt(currentKeys[k].length-1), 20) > highestNumber){
				highestNumber = parseInt(currentKeys[k].charAt(currentKeys[k].length-1), 20);
			}
		}
	}
	if(unique){
		potentialUni += '1';
	}
	else{
		potentialUni += (highestNumber+1);
	}
	potentialUni = potentialUni.toLowerCase();
	var googleId = document.getElementById('entry_1503901081');
	googleId.value = potentialUni;
	var userUnique = document.getElementById('unique');
	userUnique.value = potentialUni;
	userUnique.style.display = 'inline-block';
	document.getElementById('submit2').style.display = 'inline-block';
}