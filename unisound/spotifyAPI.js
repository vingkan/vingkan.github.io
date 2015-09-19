var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQB32FQ52LZDULfnPTGPwAQSsJaGbNc4cZW95zpixicDCkWJK-w9t7hC8npz603EgkpEJepvhq_ETESdciYVNcb2ilk5wPNP5-BgQGd5tsIWAH-rpPOa-HV-cjV_bG13DwGj8FT-qPkJh3Hm_THihYxq7D-23t1d7aqTY8C7mD26ciOYd3UXE7cVNyEpFKAvO2d9BPmLvQ5QRVeFCFxbh9mh6vZkexvDLGY7HHgLAUg3E066KrGxVb4eRIVFSksnBl0Q5HAqH9F1bTF3zk3Qh0inEQy1ezwfYx-Yn6pZHfc";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}