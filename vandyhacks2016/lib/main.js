var OPEN = '<i class="fa fa-check"></i>';
var TAKEN = '<i class="fa fa-times"></i>';

function getTag(tag, content, opt){
	var inline = '';
	if(opt){
		for(var s in opt){
			inline += ' ' + s + '="' + opt[s] + '"';
		}
	}
	return '<' + tag + (inline.length > 1 ? inline : '') + '>' + content + '</' + tag + '>';
}

function ClickEvent(id, fn){
	var dom = document.getElementById(id);
	dom.addEventListener('click', fn);
}

function MapToList(map, mapper, sorter){
	var list = Object.keys(map).map(function(key){
		if(mapper){
			return mapper(map[key], key);	
		}
		else{
			return map[key];
		}
	});
	if(sorter){
		list = list.sort(sorter);
	}
	return list;
}

function constructBuilding(bData, sData){
	var resData = {
		floors: {}
	}
	var directory = {};
	for(var f in bData.floors){
		var floor = bData.floors[f]
		resData.floors[f] = {
			name: floor.name,
			rooms: {}
		}
	}
	for(var r in bData.rooms){
		var room = bData.rooms[r];
		directory[r] = room.floor;
		resData.floors[room.floor].rooms[r] = {
			name: room.name,
			spots: {},
			pictures: room.pictures
		}
	}
	for(var s in sData){
		var sensor = sData[s];
		resData.floors[directory[sensor.room]].rooms[sensor.room].spots[s] = {
			open: sensor.open
		}
	}
	resData.floors = MapToList(resData.floors, function(floor){
		floor.rooms = MapToList(floor.rooms, function(room){
			room.spots = MapToList(room.spots, function(spot){
				return spot;
			});
			return room;
		}, function(a, b){
			return b.spots.length - a.spots.length;
		});
		return floor;
	}, function(a, b){
		return a.name.localeCompare(b.name);
	});
	return resData;
}

function getHTML(data){
	var html = '';
	html += getTag('room', getTag('h2', 'Temperature: ' + data.temp + '&deg;'));
	for(var f = 0; f < data.floors.length; f++){
		var floor = data.floors[f];
		html += getTag('h1', floor.name);
		for(var r = 0; r < floor.rooms.length; r++){
			var room = floor.rooms[r];
			var spotHTML = getTag('h2', room.name);
			room.spots.forEach(function(a){
				var aH = getTag('spot', a.open ? OPEN : TAKEN, {
					class: a.open ? 'open' : 'taken'
				});
				spotHTML += aH;
			});
			spotHTML += getTag('spot', getTag('i', '', {
				class: 'fa fa-camera'
			}), {
				onclick: 'toggleById(&quot;pics-' + f + '-' + r + '&quot;);'
			});
			var scrollerHTML = '';
			if(room.pictures){
				for(var p in room.pictures){
					var pic = room.pictures[p];
					scrollerHTML += getTag('img', '', {
						src: pic
					});
				}
			}
			spotHTML += getTag('scroller', scrollerHTML, {
				id: 'pics-' + f + '-' + r,
				class: 'closed'
			});
			html += getTag('room', spotHTML);
		}
	}
	return html;
}

var STATE = {};

var db = firebase.database();
db.ref().on('value', function(snapshot){
	var val = snapshot.val();
	//console.log(val);
	STATE = val;
	var inData = constructBuilding({
		floors: val.floors,
		rooms: val.rooms
	}, val.sensors);
	inData.temp = val.Temp.val;
	var roomHTML = getHTML(inData);
	var spaces = document.getElementById('spaces');
	spaces.innerHTML = roomHTML;
});

function addFloor(data){
	db.ref('floors').push(data);
}

function addRoom(data){
	db.ref('rooms').push(data);
}

function addSensor(data){
	db.ref('sensors/' + data.id).set(data);
}

var Editor = {
	addFloor: function(){
		vex.dialog.open({
			message: 'Add New Floor',
			input: '<input name="name" type="text" placeholder="Floor Name" required />',
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {text: 'Add'}),
				$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
			],
			callback: function(data){
				if(data){
					addFloor(data);
				}
			}
		});
	},
	addRoom: function(){
		var html = '<input name="name" type="text" placeholder="Room Name" required />';
		html += '<select name="floor">'
		//html += '<option value="new_floor">Add New Floor</option>';
		var floorList = MapToList(STATE.floors, function(floor, key){
			return {
				name: floor.name,
				key: key
			}
		}, function(a, b){
			return a.name.localeCompare(b.name);
		});
		for(var f = 0; f < floorList.length; f++){
			var floor = floorList[f];
			html += '<option value="' + floor.key + '">' + floor.name + '</option>';
		}
		html += '</select>';
		vex.dialog.open({
			message: 'Add New Room',
			input: html,
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {text: 'Add'}),
				$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
			],
			callback: function(data){
				if(data){
					addRoom(data);
				}
			}
		});
	},
	addSensor: function(){
		var html = '<input name="id" type="text" placeholder="Sensor ID" required />';
		html += '<select name="room">'
		var roomList = MapToList(STATE.rooms, function(room, key){
			return {
				name: room.name,
				key: key
			}
		}, function(a, b){
			return a.name.localeCompare(b.name);
		});
		for(var f = 0; f < roomList.length; f++){
			var room = roomList[f];
			html += '<option value="' + room.key + '">' + room.name + '</option>';
		}
		html += '</select>';
		vex.dialog.open({
			message: 'Connect New Sensor',
			input: html,
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {text: 'Connect'}),
				$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
			],
			callback: function(data){
				if(data){
					data.open = true;
					addSensor(data);
				}
			}
		});
	},
	addPicture: function(){
		var html = '';
		html += '<select name="room">'
		var roomList = MapToList(STATE.rooms, function(room, key){
			return {
				name: room.name,
				key: key
			}
		}, function(a, b){
			return a.name.localeCompare(b.name);
		});
		for(var f = 0; f < roomList.length; f++){
			var room = roomList[f];
			html += '<option value="' + room.key + '">' + room.name + '</option>';
		}
		html += '</select>';
		vex.dialog.open({
			message: 'What room is this a picture of?',
			input: html,
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {text: 'Save'}),
				$.extend({}, vex.dialog.buttons.NO, {text: 'Cancel'})
			],
			callback: function(data){
				if(data){
					db.ref('rooms/' + data.room + '/pictures').push(window.IMAGE_DATA);
				}
				window.IMAGE_DATA = false;
			}
		});
	}
}

function toggleById(id){
	var eDiv = document.getElementById(id);
	if(eDiv.classList.contains('closed')){
		eDiv.classList.remove('closed');
		eDiv.classList.add('opened');
	}
	else{
		eDiv.classList.remove('opened');
		eDiv.classList.add('closed');
	}
}

ClickEvent('add-sensor', Editor.addSensor);
ClickEvent('add-room', Editor.addRoom);
ClickEvent('add-floor', Editor.addFloor);

ClickEvent('add-picture', function(){
	toggleById('camera');
});

ClickEvent('view-dashboard', function(){
	document.getElementById('dashboard').style.display = 'block';
	document.getElementById('spaces').style.display = 'none';
	toggleById('editor');
});

ClickEvent('view-spaces', function(){
	document.getElementById('dashboard').style.display = 'none';
	document.getElementById('spaces').style.display = 'block';
	toggleById('editor');
});

ClickEvent('menu-toggle', function(){
	toggleById('editor');
});