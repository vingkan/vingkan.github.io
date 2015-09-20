var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";

var bearer = "BQCyA4JHchROO18ff-XKTwEfeiSjMrgNOtZrwauUJ_6j_uoxlXG_cmEpSVUAhD5nt38NMmwkPJiCdYdoLCe_QstrdIYES5yQQCTeaU92VcKa4i1menWl_pWl8UjdQMSadT1J3m6hPXtelZ1DI6jvUUsjWQxpvDmd59ljBo7apxnB0OOMiF1RPg0EFlhdJCLd_QchqnYrsCtr8P4tmuYFJcDHrjCRAU1LZkSzQUU1hYvV4WS6RPpHW01dzNRfGWMyGKATK8h--w0czAYQjqzaGxysuj2Fnptm42cPIHKcc6I";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}