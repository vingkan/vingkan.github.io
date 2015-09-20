var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";


var bearer = "BQD8bagTQSOQ7SyRbFkoZ_TWNB_5IFKz72DQOxO4x93yjEokTF8PHGQpLZmJvZ5GkJlmS5ffHuAzrmCpmlboz_QFye9CdwnTOiHpcyyRbkQQwuAmjZwbMYGvuPM56ccJZtAuLfOW36hsN-HRIwMhCGHw6l3A3VOuVK7kQfvs8eeb-uqfe4RlkTvnnKqWr7iLhdHPk1i1d1GodmfjoiorgioTrhsDreHFrOzefq-_JHX0LvIwaf7WWZ7EDc5gfMlNk3IbqdmHxCfMY4AFOdILbSKjf0Jm_K-ptJxpP0qwTdc";


function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}