var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQCq3HTdsBYGcInuVze-a22Hd2-hv_7pOx3KgqGwW-wfTHFxbLJ4AL6j-Ebz-g8ssPJVl6OgorYCVM0CPTNg7ckJ81EBQbFkjzQulKmAgDcB7sguxXC99I0YFplCeiDBg0mmAcNgQyY0zMZMotGgO7Csqf5KgUQTh0VyCI4dEPPW9YDbsE2A2KHys-5-p-YliZg3Cz-eE9_yTKEchdqZjE9LDn9wsHoaG6fuP-_pKsbhX2-fIdNqWMpdgf-TE8pFkr1bJ3n4cpPgnfVq5-DkCMJ_lLaGXYDYhIVCnz_ICA0";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}