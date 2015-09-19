var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQD9rCVMSqsBFux_fodwGo32KxI66OcgPrI_9s1H5o2RhRx6ZJgQji_u6jA49d0GBhCJF9CtGeRwQodsPLwSP5In9hcsTvT34ngk4FiR-mK2V5h1b18Y9-Fb-sJIbGoL_vkzU2WH7GRRZ7yEdHWFLNyGjuqtpB_Rt8giDvUjiNZ47mNpt0f4tn6jSePauLt9h-SyRDTZBrFxVuV0hjEzIzf00MVtYhdejhjV5rzcH3Iym89YOl6p-Siz8jjsUxTRag5zLvEL_TImMGYEnl0QIlfmYLG06XcDC-WDpaXY3LI";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}