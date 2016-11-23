window.config = {
	apiKey: "AIzaSyDzqDG7BigYHeePB5U74VgVWlIRgjEyV3s",
	authDomain: "omnipointment.firebaseapp.com",
	databaseURL: "https://omnipointment.firebaseio.com",
	storageBucket: "project-1919171548079707132.appspot.com"
}

window.labs_config = {
	apiKey: "AIzaSyD1KVVGuoOsINY1l1DrZDKS8T3qN7Rp1LY",
	authDomain: "omnilabs-2dc80.firebaseapp.com",
	databaseURL: "https://omnilabs-2dc80.firebaseio.com",
	storageBucket: "omnilabs-2dc80.appspot.com",
	messagingSenderId: "593871858219"
}

var LFire = firebase.initializeApp(labs_config, 'Labs');
var db = LFire.database();

var PFire = firebase.initializeApp(config, 'Prometheus');
var PromDB = PFire.database();


var listContains = function(list, v){
	for(var i = 0; i < list.length; i++) {
		if(list[i] === v) return true;
	}
	return false;
}

var uniqueList = function(list){
	var arr = [];
	for(var i = 0; i < list.length; i++) {
		if(!listContains(arr, list[i])) {
			arr.push(list[i]);
		}
	}
	return arr; 
}

var START_DATE = new Date('11/18/2016').getTime();
var USERS = {};

var ref = db.ref('meetings').orderByChild('lastActiveTime');
var query = ref.startAt(START_DATE);
query.once('value', function(snap){
	var val = snap.val();
	var users = [];
	for(var i in val){
		var resp = val[i].responders;
		Array.prototype.push.apply(users, resp);
	}
	users = uniqueList(users);
	var promises = [];
	for(var u = 0; u < users.length; u++){
		var uid = users[u];
		var picRef = PromDB.ref('prometheus/users/' + uid + '/profile');
		var picProm = new Promise(function(resolve, reject){
			picRef.once('value', function(pSnap){
				resolve({
					uid: pSnap['W'].path['o'][2],
					profile: pSnap.val()
				});
			});
		});
		promises.push(picProm);
	}
	Promise.all(promises).then(function(userData){
		for(var i = 0; i < userData.length; i++){
			var u = userData[i];
			USERS[u.uid] = u.profile;
		}
		main(val);
	});
});

var list = document.getElementById('meetings-list');
var num = document.getElementById('meetings-count');

function main(meetingMap){

	list.innerHTML = '';

	var mids = Object.keys(meetingMap);
	var meetingsList = mids.map(function(mid){
		meetingMap[mid].mid = mid;
		return meetingMap[mid];
	});
	meetingsList = meetingsList.sort(function(a, b){
		return b.lastActiveTime - a.lastActiveTime;
	});

	var count = 0;
	for(var m = 0; m < meetingsList.length; m++){
		var meeting = meetingsList[m];
		if(meeting.mid !== 'sample'){
			var html = MeetingToHTML(meeting);
			list.innerHTML += html;
			count++;
		}
	}

	num.innerText = count;

}

function getLocationData(eventsList){
	var res = eventsList[0].meta.location;
	for(var z = 0; z < eventsList.length; z++){
		var locData = eventsList[z].meta.location;
		if(locData.city && locData.country){
			res = locData;
			break;
		}
		else if(locData.city || locData.country){
			res = locData;
		}
	}
	return res;
}

function MeetingToHTML(meeting){
	var html = '<div class="meeting">';
	var resp = meeting.responders || [];
	var lastEvent = meeting.events[meeting.events.length-1];
	var locData = getLocationData(meeting.events);
	var dur = moment.duration(moment(meeting.lastActiveTime).diff(meeting.created));
	var loStr = (locData.city || 'Unknown') + ', ' + (locData.country || 'Unknown');
		html += '<h2>' + meeting.title + '</h2>';
		html += '<ul>';
		html += '<li>Creator: ' + USERS[meeting.creator].name + '</li>';
		html += '<li>Location:: ' + loStr + '</li>';
		html += '<li>Active: ' + dur.asDays().toFixed(1) + ' days</li>';
		html += '<li>' + resp.length + ' responders</li>';
		html += '</ul>';
	for(var r = 0; r < resp.length; r++){
		var img = USERS[resp[r]].picture;
		html += '<div class="responder" style="background-image: url(&quot;' + img + '&quot;)"></div>'
	}
		html += '</div>';
	return html;
}