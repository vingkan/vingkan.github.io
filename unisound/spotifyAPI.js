var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";

var bearer = "BQB1AASV7Bse5M-c9pmtAGQa9EcPZZ3tphT5-w3_A8z5gmiJ0X8piROJ77pIKAuq9glIhTbkBx6Cslcs-5Zeo1EuMz-N-TG9QY2XvFdkwJ_qLHiotF58f9ztVhKbckAnu1eiXvALNGAgx3bJCe1npGLo6rv86v2eBuKVQF7s2gStVAiIOmfwuYxLBl8-dgzf3HbnO_Z0NFewZmVbVVUtkTM4rYN4kJ1eTwBZq-mG7oeQxDjuOvUYYdlYD9UnVndfF22TIhCZnOTfS_kWfUaTPXPeTTOW8zZ9TEV-uTm9_nM";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}