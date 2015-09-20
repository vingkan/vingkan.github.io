var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQDjNyDqiYqp6XbDjtlR5f3FbHgyqV9wSAklUn3S-JTDCcEe4GBNTcdrA1S6zkwlWW5MgDw9FVqOFr3b5dPIHAnWTw-WrUBR_6t2-63YN2pW7naGlgmfxt61ufqysyBerOaJKA26Tva3x_EBW7jCY7pZeFvKnHnW0z9_HnRRTgKXr-0RCnzy9Vkaguk4ofShTUEgvVS8rEDGpd791w8qOxRJ4Hnk0KaKBlF8x1B2FOFIwexYmQa5t5UzITwyeAmtsXg7XnosCWKI1JHxYBW2lRui7tNVG-_1Jb0agGR_X40";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}