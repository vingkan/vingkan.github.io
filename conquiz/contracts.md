#FRONTEND

#APPLICATION

#DATA

##Ships Object

###Ship(data)

Constructor for the Ship class.
* Params: json object:
* Return: Ship
```
var ship = new Ship({
	name: 'Dinghy',
	player: 'Mohsin',
	latitude: 13.4,
	longitude: 52.2
});
```

###Ship.toString()
Returns a string representation of a Ship object.
* Params: void
* Return: Strings
```
var ship = new Ship();
console.log(ship.toString());
console.log(ship + " is mine!");
```

##Geolocation

####userPosition
Contains data about the user's geolocation.
* Type: Object
* Schema:
```
{
	latitude: (double),
	longitude: (double)
}
```

###getUserLat() & getUserLon()
Returns the user's latitude or longitude coordinates.
* Param: void
* Return: double

####getGeolocation(callback)
Updates the userPosition object and then runs an optional callback function.
* Params: function
* Return: void
```
getGeolocation(function(){
	console.log(userPosition);
});
```

##Maps

#DATABASE