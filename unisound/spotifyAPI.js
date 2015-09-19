var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQD_9Tc-zWyWKIWDhJxCKWQ7UOKFq0f__G1SXkQNNBODj_i9TrQCCED5X3feZvEhFDva330dIQrTw8i3cDLINepN4sTqQYImCJfq8kY9UTruxE65eHJCaZ-V3eId41B7XVYz7R4jExx__90uM8Y2NjMuDYUlz2lEaNlzX128FPU16TFy2MJw9Y93wEkEzJgbcr1v7tay0shXCGjSICLA1wLFp-ovXB1uTjbnHpp1_5dhfiSxR0zPpQ_atFifR-7IwWSR9mAcYXoGBZehEAYnQDqnXHGPQE3MWuEVG35omlg";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}