var timeslot1 = TimeSlot({
	uid: 'ecapstone',
	time: ##########, //4:45 to 5:00 PM
	duration: 15,
	free: true
});

var timeslot2 = TimeSlot({
	uid: 'ecapstone',
	time: ##########, //5:00 to 5:15 PM
	duration: 15,
	free: true
});

var meetingOption1 = TimeOption({
	time: ############, //4:30 to 5:30 PM
	duration: 60,
	timeslots: [slot, slot, slot],
	//there are already three time slots: one for each of the three people already in the meeting option: unlike Eric, their time slots matched up exactly with the meetingoption time/duration
	available: ['bbatliner'],
	partial: ['vkannan'],
	unavailable: ['sunnyshah1000']
});

//Add the time slots Eric checked to the meeting option:
meetingOption1.checkTimeSlot(timeslot1); //maybe name this addTimeSlot() ?
//line returns true because timeslot1 is within meetingOption1's duration
//Updates meetingOption1 so that Eric is listed as partially available:
meetingOption1: TimeOption({
	timeslots: [slot, slot, slot, **timeslot1**],
	//Note that Eric's timeslot is now available to the meetingoption
	...
	partial: ['vkannan', 'ecapstone'],
	...
});
//Add the other time slot to the meetingoption
meetingOption1.checkTimeSlot(timeslot2);
//The meetingoption should check for other time slots that belong to ecapstone, and after calling the function mergeTimeSlots() (defined below) to determin that ecapstone is available.
meetingOption1: TimeOption({
	timeslots: [slot, slot, slot, timeslot1, **timeslot2**],
	available: ['bbatliner', 'ecapstone'],
	//Now Eric has been moved to available
	partial: ['vkannan'],
	...
});

function mergeTimeSlots(newSlot, existingSlot){
	//might wanna check slotsAreMergeable() outside this function too
	if(slotsAreMergeable(newSlot, existingSlot)){
		
	}
}