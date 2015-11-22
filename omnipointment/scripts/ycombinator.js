var timeslots = createTimeRangeArray({
    start: new Date(2015, 10, 21, 12),
    interval: GLOBAL_INTERVAL,
    length: 2*GLOBAL_INTERVAL,
    isPriority: true
});

timeslots[0].set('free', 2);
timeslots[1].set('free', 2);

function isAvailable(startTime, duration, timeslots) {
    var start = startTime.getTime();
    var end = startTime.getTime() + duration*60000;
    var minAvailableTime = Number.POSITIVE_INFINITY;
    var maxAvailableTime = Number.NEGATIVE_INFINITY;
    timeslots.forEach(function (timeslot) {
        var time = timeslot.get('time');
        if (time < minAvailableTime) {
            minAvailableTime = time;
            var endTime = time + timeslot.get('duration')*60000;
            if (endTime > maxAvailableTime) {
                maxAvailableTime = endTime;
            }
        } else if (time === maxAvailableTime) {
            maxAvailableTime += timeslot.get('duration')*60000; 
        }
    });
    return minAvailableTime <= start && maxAvailableTime >= end;
}

function compareSortedTimeSlotList(currentDate, timeSlotList){
    var response = 0;
    var keepArray = [];
    var size = timeSlotList.length;
    for(var t = 0; t < size; t++){
        if(currentDate.getTime() === timeSlotList[t].time){
            response = timeSlotList[t].free;
        }
        else{
            keepArray.push(timeSlotList[t]);
        }
    }
    keepArray.push(response);
    return keepArray;
}
