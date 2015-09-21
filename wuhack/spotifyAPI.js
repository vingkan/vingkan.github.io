var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";


var bearer = "BQCvzMjUcSPK_1x5IvWX0QC56J1iMEG63U_XyodWL1Zgou4g4OXm4b2wv3jE1L0thfDB4OYl91yNf-BEJun_xYSY3U3fDR7ko29BUbK3ssbToKida67-TzLgByxkhuqS050fGtBofL9e8n7bXbaya8sQwiUzAI8IuM130VWEOly-96q6qEyqeRZ2Ksvq1a0ReszunSuzuyEXpjatYoY67GMUAh8GJ-ZxuwozJSNUmaTnwirBxCmK_rMnOJceS5gPmKKncz85vhIqGXtnfiNOl92_S5RcRA0dXRyi4aS9_mQ";


function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}