var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";


var bearer = "BQDr7Kk7t3dZVGgnv4ASe7kVCVfBMNsQpAuplSBJc5EglsUyH1re5gd_nMxq7e7BmMiNKnCo2aJKWaFfGnrxumUPNltWbjX1sETac4MnYfSEZQyDN5pCEA6mregTgXwFztOq2emii2NPyuhrizCT8mhdHSWAenpZe6S_WBf_eks0lmLMQwHS3z5qqR4X0MVq6ZYurCz56iWOZY1fYhmJg1fJpL1xaYGmbNBzvF_v6omGWgrItzP7KyBzfejsMtjkESn2m7dOGQi04jpdk0-MLj4Hop5MDkf8Aj_m8pRR254";


function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}