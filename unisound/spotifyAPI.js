var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQACTmnSZskqH5ksTfG49UfuAHFNMfAUds7UmB_gIYgLeZp4XneqQSH-KUqX3htv_Wpxt-l7lkTXGj6D3ET_GX61NhJTsVVa3foif-SwT7G_nPLEzGrdRGKFh9HbYUrduAIt9ECPjzXujNE71M-CmmeBl_RLnO8uiLEkkpQsa1bKX7jVdp9aa6td6HoM2_ThB9NE-xVlSFrdFiCzgBi0GS0yzORFqEyjw8owDZNRTvnl2H2UCwT0uvOfNI6-J8JK3TJvx2aVtG4DiK5Rm-5zJcAaTwvJDjpCrhL0xxYT4Gg";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}