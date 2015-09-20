var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";
var bearer = "BQDCMcAzY3HsYVWIBgu4bEJgcORKWdZUQxKV9GkWuRG2uWz0liALaaiOvJoO9Xw21j6643WLFGkKV0wAy1bulrI4quxjMqaBKt_k69PwRCCFBEGf6h51mDYfQYUcbBp4CNObJeIfYldCeB_8pCh2CtU2jjgNRMJckzl5FcVG0d8i4uwkQ3sbHYy7dNXbhjvN9t2fae1-xBkf4xbQQMvIR7YmCQrRvITnjzUWFTgz0HAN3iUidi7IRxF90fSxGPXQTQcWLqfoIUN5Vceu6mAwdZZf1C1JJqgIX8Y4OMaAuqI";

function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}