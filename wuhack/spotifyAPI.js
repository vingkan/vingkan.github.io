var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";


var bearer = "BQCN-KlRsAusDqweRNmw_q6F9L_YqZv0KAH2Ns9b7zJxM1AICARXM_kK0wx0pULFCiIEYQbxXv-1EB5JyohxWXhtqOhdAy3wg-YjStmPIHSENK33IibK0JaE7ZOBOmrelHixr_DSL0RufBQabGn0LLzycbQ2oZfJwDHVh5_LGaH3soAaJXHSP4_wriGgJv28r2_3CyQfc3tzMVakvF0jgXFihHu8rymovxUPJKgzZ6huTD8fTHyWseY62lnh0wt4HHU0CrTZE_9lW003-jLnklzG29awAhVusYfBjIn1xWk";


function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}