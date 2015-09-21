var clientID = "afa826690fe04e05a65c5b92ec2bec26";
var clientSecret = "d19a4e03cd31497981aa0ee5aa891eeb";
var spotifyBase = "https://api.spotify.com/";


var bearer = "BQCVDf5ge6aCMQ6nOUFiTMNMe-jQMA7mJYy1d8hZRZCSdDxNf61MdykWafAmTIPADfFDUbiMTp-HEesJ7ge3M2RPAPmD2taQ6eISxaBFcXGbUpzgvLGdmBhS0RbcvAM3bXJPi8EHiFnJYof8GHSYbjpR0TukV3xEgBwV9gFA_vwPsypd1wjO8aO1lVd1HYN-E8TjgT99YUdLxUwUVIZNbaYAcF7N7ihe30PSeSP0EG_X3y-1Gtz86NrAvs-Lmd2BLnNPvKR3WdKvH_ZMnNkFkxqJQgFp5jUtpbAf7dQ6iRc";


function serveData(data){
	var incomingData = document.getElementById('incomingData');
	var jsonData = JSON.stringify(data);
	incomingData.value += jsonData + "\n";
}