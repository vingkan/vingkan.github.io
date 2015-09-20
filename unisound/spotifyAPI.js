var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";

var bearer = "BQCTbBd0CPf8hRU-t4Pq39ovKtbQvMpfIF_hlc5pjwOLacWGVVFUMo4zy6qKRruDTFmZuVI9wiQQjW94Z9ZFdB-Fd-CEoJa_8PnLxrahSb0l8WK5KWhP2B2CM2OghKkpXE0x2G5PpjlMwclMhcaicjRBG75IGMR_AFmLNNmeQgFvxl5Bi1i6D7Jh8kvrc6vHv1qrx9INq6czktpLAqqbes9k89nLCuGNkgFDxQdU2AjKKJ83MvJEh1g5_QLNF8dQnUAH_deTytALj87MtPeMo2tzhEj_Q_hwUdKgPzku90g";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}