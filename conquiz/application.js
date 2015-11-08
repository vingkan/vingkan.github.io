
/*--------------------------------------------*/
/*---> Variables/accessor <------------------*/
/*--------------------------------------------*/

// Store user's location
var userPosition = {
	latitude: 0,
	longitude: 0
};

var platform; // platform will be initialized with a new H map
var map; // will be initialze later
var defaultLayers; // default map type, will be used to store the map obtain from platform
var ui;
var game;

// Accessor methods
function getLat() {
	return userPosition.latitude;
}
function getLon() {
	return userPosition.longitude;
}
function getMap() {
	return map;
}
function getUI() {
	return ui;
}

/*--------------------------------------------*/
/*---> User Location <------------------------*/
/*--------------------------------------------*/

// Function that updates user location
function updatePosition(position) {
	userPosition.latitude = position.coords.latitude;
	userPosition.longitude = position.coords.longitude;
}

// Using the navigator class to get a location and update it with update method to userPosition variable
function getGeolocation(callback) {
	navigator.geolocation.getCurrentPosition(function(position) {
		updatePosition(position);
		console.log("Called Geolocator");
		if (callback) {
			callback();
		}
	});
}

/*--------------------------------------------*/
/*---> Here Maps Initialization <-------------*/
/*--------------------------------------------*/

function initHereMap() {
	// Initialized communication with back-end services
	platform = new H.service.Platform({
		app_id: "habu7uC2upRacruDrUfu",
		app_code: "85_CDKXMNkoraKX54-ZS-g",
		useCIT: true,
		useHTTPS: true
	});

	// Obtain the default map type from the platform object
	defaultLayers = platform.createDefaultLayers();

	// Initialized a map - if location not given then it will give a world view
	map = new H.Map(document.getElementById("map-container"), defaultLayers.normal.map /*, {
		remove the quotes to add a default init location
		center: setCenter({lat: getLat(), lng: getLon()});
		zoom: setZoom(11);
	} */ );

	// Make the map interactive
	// MapEvents enables the event system
	// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
	var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	// Create the default UI components
	ui = H.ui.UI.createDefault(map, defaultLayers);
	// move map to initial location
	moveMap(map);
}

/*--------------------------------------------*/
/*---> Here API Functions <-------------------*/
/*--------------------------------------------*/

// move the map
function moveMap(map) {
	map.setCenter({lat: getLat(), lng: getLon()});
	map.setZoom(15); // zooming is inverted, bigger number = more zoom
}



/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
function addGroupMapMarker(group, coordinate, html) {
	var marker = new H.map.Marker(coordinate);
	marker.setData(html);
	group.addObject(marker);
}

function addInfoBubble(map) {
	var group = new H.map.Group();
	if (map == null) {
		console.log("map is null");
	} else if (group == null) {
	console.log("group is null")
	}

	map.addObject(group);

	// add 'tap' event listener, that opens info bubble, to the group
	group.addEventListener('tap', function (evt) {
	// event target is the marker itself, group is a parent event target
	// for all objects that it contains
	var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
	// read custom data
	content: evt.target.getData()
	});
	// show info bubble
	ui.addBubble(bubble);
	}, false);
	addGroupMapMarker(group, {lat:41.835591, lng:-87.625787},
	'<div><a href=\'https://web.iit.edu\' >Web</a>' +
	'</div><div>MTCC<br>IIT</div>');
}

function start_game(){
	game = new Game({id:'0',name:'metagame'});
	var troops = loadTroops();
	var players = loadPlayers();
	var towers = loadTowers();
	var questions = game.get('questions');

	if(players.length == 0){
		players = [new Player({
			    "id": "marcuswan",
			    "name": "Marcus Wan",
			    "team": {"icon": "png", "color": "Blue"},
			    "coordinates": {"latitude": "10", "longitude": "20"},
			    "troops": "[]"
		})];
	}
	if(troops.length == 0){
		for (var i = 0; i < players.length; i++){
			for (var q = 0; q < 10; q++){
				troops.push(new Troop({
					id: i + "-" + q,
					name:"Troop" + q,
					playerID: players[i].id,
					towerID: "-1",
					question: JSON.stringify(questions[Math.floor(Math.random()*30)]),
					//alive: "true"
					}));
			}
		}
	}
}
start_game();
console.log('LOADED APPLICATION');
