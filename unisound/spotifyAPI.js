var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";

var bearer = "BQCXDj-Wkpi_okN18C4vbWE0kTJ75OVHSBKe2zvF_ZhRJdYSbozGwZ56BXvLMDy_Y_xPxo2REnMTWBa1N1aDiALlVxvYt5OTrvETNX7l3K2-5vJDIztv1I-LqfM5me7N7FjoADFvgX8HAApACBoOoUm1ndj8Q3jtuenCmGfJk3P3mC4FM5sakk3qc-RWP6q2NVKeAruoO9_QmMgNfwg2aZBaPmCIov-TNG6TfBkk_NxeCh3-cR6ehh_77hQBjJZOIE5eIIcrrXMzdYSTvHBFLv2ZEyvV3NVGXRBi8wutFTVB";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}