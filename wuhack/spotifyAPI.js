var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";


var bearer = "BQAJgKcgJoHvSBYhTEiaH13i6OHiPuj7OMVi0TmCRW1igAs8ZrYazFPVCCyMD5HwzXtHY-iDO7d2nGsrcIQ0-GxwavM1kiRIP28codYrOI5_hLC9Z_L3Nwsr1Yp6CWhXVVsqQRrrofj6INAQorpJ_SJHfwII4wAriqH4eC5nd3G_nyDD4eaXdDUoIurdpTlf5qupfA4bdkknLfEoWMdVdu6UUYH5RBBqLd1h9ANtlPKCQPJe_lBIFFykyMz2SAN2OGNi2VNfSqeWVIOLcfgWVun3JJHb2Z_E4gkbbIojIhl9";


function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}