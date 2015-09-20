var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQCkUPxin1H9f7EcnI_wceS5RU7iftQ39_IwC4GY-HckwKvq_pcbjEa8zkDwuyZC9_JgJrH1A5gMA4NXS39NerkWqvGJJqBujUql53hsPteP0tCvLcJMpMBocaEh_WVX3jzs9vhUzJqBx_5PWuvyWPopC7kVa92FgXgeMaWNYMphk7Djf6P3EpmRICEpgYgZpbZy0t9DtAQrstcTTsnzgVwoPx978ZxZ4NnR_oZwmiBkzrI6e2mhU2o6UymsZnvO9UbdZNLfWxrjLB_bcUJwyLKYB6_A6fRU_yJ3ijPMY0s";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}