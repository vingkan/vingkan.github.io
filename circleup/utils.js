function submitOne(){
	// First and Last Names
	var googleFirstName = document.getElementById('entry_1191619877');
	var googleLastName = document.getElementById('entry_2134594167');
	var userFirstName = document.getElementById('userfirstname');
	var userLastName = document.getElementById('userlastname');
	googleFirstName.value = userfirstname.value;
	googleLastName.value = userlastname.value;
	
	//Unique Device Identification
	var deviceID = getDeviceIP();
	var googleId = document.getElementById('entry_1503901081');
	googleId.value = deviceID;
	var userUnique = document.getElementById('unique');
	userUnique.value = deviceID;

	//Geolocation Coordinates
	var lat = parseFloat(document.getElementById('latCoord').innerHTML);
    var lon = parseFloat(document.getElementById('lonCoord').innerHTML);
    var googleLat = document.getElementById('entry_1145448555');
    var googleLon = document.getElementById('entry_1402007270');
    googleLat.value = lat;
    googleLon.value = lon;
}

function submitTwo(){
	submitOne();
	setInterval(function () {toggle()}, 300);
	var submitButton = document.getElementById('ss-submit');
		submitButton.click();
}

function toggle(){
	var submitButton = document.getElementById('submit2');
	if(submitButton.style.background == 'transparent'){
		submitButton.style.background = 'white';
	}
	else{
		submitButton.style.background = 'transparent';
	}
}

/*
* StackOverflow Link: http://stackoverflow.com/questions/391979/get-client-ip-using-just-javascript
*/
function getDeviceIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

function updateChangeLocation(latlon){
	//TO-DO
}

function updateUserLocation(){
	alert("Feature: Update User Location by Dragging Marker\nComing Soon!");
	document.getElementById('changeLocation').style.display='none';
}