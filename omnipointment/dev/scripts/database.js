var _ = require('underscore');

var PATH = "https://omnipointment.firebaseio.com";

/*
 * Retrieves data about a meeting from Firebase
 * Param: id - meeting id (mid)
 * Return: thenable promise with meeting data
 */
function getMeetingById(id){
	var meetingPromise = new Promise(function(resolve, reject){
		var firebase = new Firebase(`${PATH}/meetings/${id}/`);
		firebase.once("value", function(snapshot){
			var meeting = snapshot.val();
			var userList = JSON.parse(meeting.users);
			var userSlotsListPromise = getMeetingTimeSlots(id, userList);
			userSlotsListPromise.then(function(userSlotsList){
				var meetingData = _.extend(meeting, {responses: userSlotsList});
					meetingData.timeOptions = JSON.parse(meetingData.timeOptions);
					meetingData.users = JSON.parse(meetingData.users);
				resolve(meetingData);
			});
		});
	});
	return meetingPromise;
}

/*
 *
 * Param: meetingID - meeting id (mid)
 * Return: thenable promise with all users and their availability for a meeting
 */
function getMeetingTimeSlots(meetingID, userList){
	var userSlotsListPromise = new Promise(function(resolve, reject){
		var promises = userList.map(userID => getUserTimeSlots(userID, meetingID));
		var promiseCounter = 0;
		var userSlotsList = [];
		promises.forEach(promise => {
			promise.then(function(userSlots){
				userSlotsList.push(userSlots);
			}).then(function(userSlots){
				promiseCounter++;
				if(promiseCounter === promises.length){
					resolve(userSlotsList);
				}
			});
		});
	});
	return userSlotsListPromise;
}

/*
 *
 * Param: meetingID - meeting id (mid)
 * Return: thenable promise with a user's information and availability
 */
function getUserTimeSlots(userID, meetingID){
 	var userSlotsPromise = new Promise(function(resolve, reject){
		var firebase = new Firebase(`${PATH}/users/${userID}/meetings/${meetingID}`);
		firebase.once("value", function(snapshot){
			var userSlots = snapshot.val();
			var userPromise = getUserInformation(userID);
			userPromise.then(function(userData){
				resolve({
					user: userData,
					slots: JSON.parse(userSlots)
				});
			});
		});
	});
	return userSlotsPromise;
}

function getUserInformation(userID){
	var userPromise = new Promise(function(resolve, reject){
		var firebase = new Firebase(`${PATH}/users/${userID}/google`);
		firebase.once("value", function(snapshot){
			var profile = snapshot.val();
			resolve({
				uid: userID,
				name: profile.name
			});
		});
	});
	return userPromise;
}

export var Database = {
	getMeetingById: getMeetingById,
	getMeetingTimeSlots: getMeetingTimeSlots,
	getUserTimeSlots: getUserTimeSlots
}