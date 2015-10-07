var treeURL = "https://data.illinois.gov/resource/dzge-uybj.json"
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

var storage = new Storage();

navigator.geolocation.getCurrentPosition(updateCoords);

getTrees('a1', {
	"tree_species": "Acer rubrum"
}, 3, null);

getTrees('b1', {
	'$where': 'within_circle(location, 40.15, -88.25, 1000)'
}, 10, null);

getCount('c1', 'tree_species', 'Acer rubrum');

//initGoogleMap();