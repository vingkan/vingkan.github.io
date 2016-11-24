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
var MeetDB = LFire.database();

var PFire = firebase.initializeApp(config, 'Prometheus');
var db = PFire.database();


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

var list = document.getElementById('meetings-list');
var sTime = document.getElementById('start-time');
var num = document.getElementById('users-count');

var START_DATE = new Date('11/18/2016').getTime();
var USERS = {};

sTime.innerText = moment(START_DATE).format('dddd M/D h:mm A');

var count = 0;

var ref = db.ref('prometheus/users').orderByChild('lastVisit');
var query = ref.startAt(START_DATE);
query.on('child_added', function(snap){
	var val = snap.val();
	var uid = snap['W'].path['o'][2];
	USERS[uid] = {
		name: val.profile.name,
		picture: val.profile.picture
	}
	count++;
	num.innerText = count;
	var vRef = db.ref('prometheus/visits/' + uid).orderByChild('meta/datetime/timestamp');
	var vQuery = vRef.startAt(START_DATE);
	vQuery.on('child_added', function(vSnap){
		var vVal = vSnap.val();
		vVal.uid = uid;
		update(vVal);
	});
});

function appendVisit(html){
	var newNode = document.createElement('div');
		newNode.classList.add('visit');
		//newNode.innerText = text;
		newNode.innerHTML = '<div class="anchor"></div>' + html;
	list.insertBefore(newNode, list.childNodes[0]);	
}

function updateMid(mid){
	MeetDB.ref('meetings/' + mid + '/title').once('value', function(mSnap){
		var name = mSnap.val() || 'Meeting ' + mid.toUpperCase();
		var spans = document.getElementsByClassName('mid-' + mid);
		for(var s = 0; s < spans.length; s++){
			var span = spans[s];
			span.innerText = name;
		}
	});
}

function update(data){
	var visit = data.visit;
	var meta = data.meta;
	if(visit.mid){
		var text = '';
		switch(visit.type){
			case 'VIEW_MEETING':
				text += 'Viewed a meeting.';
				break;
			case 'EDIT_MEETING':
				text += 'Edited a meeting.';
				break;
			case 'TIMER':
				var slots = visit.free_after - (visit.free_before || 0);
				var dur = ((visit.end - visit.start)/1000).toFixed(1);
				text += 'Marked ' + slots + ' slots free in ' + dur + ' secs.';
				break;
			default:
				text += 'visited Ominpointment.';
		}
		var html = '';
			html += '<div class="v-data u-data">'
				html += '<div class="propic" style="background-image: url(&quot;' + USERS[data.uid].picture + '&quot;)"></div>';
				html += USERS[data.uid].name + '</div>';
		var mSpan = '<span class="mid-' + visit.mid + '"></span>';
			html += '<div class="v-data m-data">' + mSpan + '</div>';
			html += '<div class="desc">' + text + '</div>';
			html += '<div class="time">' + moment(meta.datetime.timestamp).format('dddd M/D h:mm A') + '</div>';
		appendVisit(html);
		updateMid(visit.mid);
	}
}