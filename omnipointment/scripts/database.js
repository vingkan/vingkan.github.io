//BROWSERIFY IMPORTS
var _ = require('underscore');
//LOCAL IMPORTS
import {Front} from './frontend';

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
			if(meeting === null){
				reject("Could not find a meeting with that code.");
			}
			else{
				if(meeting.users){
					meeting.users = JSON.parse(meeting.users);	
				}
				else{
					meeting.users = [];
				}
				meeting.timeOptions = JSON.parse(meeting.timeOptions);
				/*var userList = JSON.parse(meeting.users);
				var userSlotsListPromise = getMeetingTimeSlots(id, userList);
				userSlotsListPromise.then(function(userSlotsList){
					var meetingData = _.extend(meeting, {responses: userSlotsList});
						meetingData.timeOptions = JSON.parse(meetingData.timeOptions);
						meetingData.users = JSON.parse(meetingData.users);
					resolve(meetingData);
				});*/
				resolve(meeting);				
			}
		}, function(error){
			console.log(error)
			response = Promise.reject(error.code);
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
	var response;
	if(meetingID.length > 0 && userList.length > 0){
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
		response = userSlotsListPromise;
	}
	else{
		response = Promise.reject("Invalid meeting ID and/or user list was used to search for responses.");
	}
	return response;
}

function getUserMeetings(userID){
	var promise = new Promise(function(resolve, reject){
		var firebase = new Firebase(`${PATH}/users/${userID}/meetings/`);
		firebase.once("value", function(snapshot){
			var meetingKeys = [];
			var meetings = snapshot.val();
			for(var key in meetings){
				meetingKeys.push(key);
			}
			var firebaseMeetings = new Firebase(`${PATH}/meetings/`);	
			firebaseMeetings.once("value", function(snapshot){
				var allMeetings = snapshot.val();
				for(var key in allMeetings){
					if(allMeetings[key].creator === userID){
						/*
						 * SEPARATE THESE INTO MULTIPLE FUNCTIONS
						 * Want to show which meetings you created
						 * Which meetings you've been invited to
						 * How many have responded: it will look like an inbox
						 */
						if(meetingKeys.indexOf(key) < 0){
							meetingKeys.push(key);
						}
					}
				}
				var meetingPromises = meetingKeys.map(meetingID => getMeetingById(meetingID));
				resolve(Promise.all(meetingPromises));
			});
		});
	});
	return promise;
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

function postMeeting(meeting){
	var postPromise = new Promise(function(resolve, reject){
		var firebase = new Firebase(`${PATH}/meetings/${meeting.mid}`);
		var timeOptionsArray = [];
		meeting.timeOptions.forEach(option => {
			timeOptionsArray.push(option);
		})
		meeting.timeOptions = JSON.stringify(timeOptionsArray);
		var userArray = [];
		meeting.users.forEach(user => {
			userArray.push(user);
		})
		meeting.users = JSON.stringify(userArray);
		firebase.set(meeting);
		resolve("Meeting saved successfully!");
	});
	return postPromise;
}

function postUserResponses(userID, meetingID, responses){
	var postPromise = new Promise(function(resolve, reject){
		if(responses.length > 0){
			var meetingRef = new Firebase(`${PATH}/meetings/${meetingID}/users`);
				meetingRef.once("value", function(snapshot){
					var users = JSON.parse(snapshot.val());
					if(users.indexOf(userID) < 0){
						users.push(userID);
					}
					meetingRef.set(JSON.stringify(users));
				});
			var firebase = new Firebase(`${PATH}/users/${userID}/meetings/${meetingID}`);
			firebase.set(JSON.stringify(responses));
			resolve("Responses saved successfully!");
		}
	});
	return postPromise;
}

function meetingIDExists(meetingID){
	var promise = new Promise(function(resolve, reject){
		var keyExists = false;
		var firebase = new Firebase(`${PATH}/meetings/`);
		firebase.once("value", function(snapshot){
			var meetings = snapshot.val();
			for(var key in meetings){
				if(key === meetingID){
					keyExists = true;
				}
			}
			resolve(keyExists);
		});
	});
	return promise;
}

function postFeedback(feedback){
	var userPromise = getUserInformation(Front.getUID());
	userPromise.then(function(userData){
		var firebase = new Firebase(`${PATH}/feedback/`);
		firebase.push({
			user: userData,
			feedback: feedback
		});
	});
}

export var Database = {
	getMeetingById: getMeetingById,
	getMeetingTimeSlots: getMeetingTimeSlots,
	getUserMeetings: getUserMeetings,
	getUserTimeSlots: getUserTimeSlots,
	postMeeting: postMeeting,
	postUserResponses: postUserResponses,
	meetingIDExists: meetingIDExists,
	postFeedback: postFeedback
}