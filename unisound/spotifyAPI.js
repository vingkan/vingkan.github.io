var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQBx6EGULCqdh2nKedoCjxCWkDZ4PRSNGwHAR79JXXt4LcfS2X2KdrFlSfl9dNVlzKuvEHpAmiz9NTuZdOSTzV-T04N40KiiIR_MzFrQ0S5eAKFDBknB7aKK5q8vR44LABVYHzPfojm-S48ox1wCZ0dDnzSBXGemLcf7tB3IizogYEfwRX13HWsztUxN4zAoEJfzMigG9Gc3iOc5A3Bt3gxl_WzU591sYNRmIzNgfMYX7j2l5gHoEJecnOkYNChK_cYaWK_qCe8u4jP5VCobLteHuQjd5h7tRySAKnstMp0";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}