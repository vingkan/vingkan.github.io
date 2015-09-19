var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQCKkDbObkLOsJkjA24JIhslyZzqURd8JrAhrkweJfhBNlnZjDYwuSzDH8H49O8b6TVWmB5Lord5es5ho40cP2MXkAflX_C4V3EfXFQQ23Dr4KPAQ3Yu58_znIkzEq6rIjV5jotY0g55rBT28AMOFyUhofzrp7ZSzZncDSsDSsSquwG0iFnW9YG7FRdEqhLKPMNwdrC0beZCmdtKQMNO0HopJchk34CNPdRbq09rSH9VOdin3MTGWqw5EtqIEhf3WlWhuHFQOBo8s68LYaSFRw8owUoUsYwiVr2YWxnxMJk";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}