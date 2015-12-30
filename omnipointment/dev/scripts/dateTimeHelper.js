//BROWERSIFY IMPORTS
var _ = require('underscore');

export var DateTimeHelper = {

	//GLOBAL VARIABLES
	MINUTE: 60000, //one minute in milliseconds
	ZERO_EPOCH: -2209053600000, //-2209053600000 is the epoch timestamp for new Date(0, 0, 0);

	/*
	 * Converts a pair of timestamps into a Date object.
	 * @Param date: a timestamp that will determine the year/month/date of the output
	 * @Param time: a timestamp that will determine the hours/minutes of the output
	 * @Return result: a Date object
	 */
	dateTimeToDate: function dateTimeToDate(date = this.ZERO_EPOCH, time = this.ZERO_EPOCH){
		var dateSetting = new Date(date);
		var timeSetting;
		if(typeof time === "number"){
			timeSetting = new Date(time);
		}
		else{
			timeSetting = new Date(0, 0, 0,
				parseInt(time['startHours']),
				parseInt(time['startMinutes'])
			);
		}
		var result = new Date(
			parseInt(dateSetting.getFullYear()), 
			parseInt(dateSetting.getMonth()), 
			parseInt(dateSetting.getDate()), 
			parseInt(timeSetting.getHours()),
			parseInt(timeSetting.getMinutes())
		);
		return result;
	},

	/*
	 * Creates a list of the timeSlots derived from a list of timeOptions.
	 * @Param optionsList: array of timeOptions
	 * @Param dateSetting: date containing the year/month/date to give the resulting times, if no date setting is provided, the y/m/d will default to zero
	 * @Return list: an array of timeSlots
	 */
	generateTimeList: function(optionsList, dateSetting = new Date(0, 0, 0)){
		var list = [];
		var increment = 15;
		optionsList.forEach(options => {
			var elapsed = 0;
			var date = this.dateTimeToDate(dateSetting, options);
			while(elapsed < options.duration){
				var timeOption = date.getTime();
				list.push({
					time: timeOption,
					isPriority: options.isPriority
				});
				var newTime = timeOption += (increment * this.MINUTE);
				date.setTime(newTime);
				elapsed += increment;
			}
		});
		return list;
	},

	/*
	 * Creates a map of timestamps and data associated with them.
	 * @Param timeOptions: array of timeOptions from which to generate times
	 * @Return timeMap: array that maps timestamps to data
	 */
	getTimeMap: function(timeOptions){
		var timeMap = [];
		timeOptions.forEach(options => {
			options.dates.forEach(date => {
				var list = DateTimeHelper.generateTimeList([options], date);
				timeMap.push.apply(timeMap, list);
			});
		});
		//Group these both into one arrow function later
		timeMap.map(timeSlot => _.extend(timeSlot, {
			data: {
				numFree: 0,
				total: 0,
				members: []
			}
		}));
		return timeMap;
	},

	/*
	 * Searches through a timeMap (array of timeSlots) for a specific timeslot.
	 * @Param map: array of timeSlots to search
	 * @Param time: timestamp of the desired timeSlot
	 * @Return list: the matching timeSlot, if none, will return a timeSlot set to zero
	 */
	getSlotFromTimeMap: function(map, time){
		var response = {
			time: 0,
			numFree: 0,
			isPriority: false
		};
		map.forEach(slot => {
			if(slot.time == time){
				response = slot;
			}
		});
		return response;
	},

	/*
	 * Analyzes two timeOptions and returns information that can be used for merging, splitting, and other operations.
	 * @Param option1, option2: timeOptions to analyze, order does not matter
	 * @Return information: JSON of results that includes:
 		earlier (timeOption): the timeOption that is earlier,
		later (timeOption): the timeOption that is later,
		sameTime (boolean): whether or not the timeOptions start at the same time,
		samePriority (boolean): whether or not the timeOptions have the same priority,
		overlap (boolean): whether or not the timeOptions' durations overlap,
		adjacent (boolean): whether or not the timeOptions' start/end times touch each other,
		inside (boolean): whether or not one timeOption's duration is inside the other's,
		merged (timeOption): if overlap/adjacent, the resulting merged timeOption
	 */
	analyzeTimeOptions: function (option1, option2){
		//Determine which timeOption is earlier
		var start1 = this.dateTimeToDate(null, option1);
		var start2 = this.dateTimeToDate(null, option2);
		var earlier;
		var later;
		var sameTime = false;
		if(start2.getTime() - start1.getTime() > 0){
			earlier = option1;
			later = option2;
		}
		else if(start2.getTime() === start1.getTime()){
			sameTime = true;
			if(option2.duration > option1.duration){
				earlier = option1;
				later = option2;
			}
			else{
				earlier = option2;
				later = option1;
			}
		}
		else{
			earlier = option2;
			later = option1;
		}
		//Check if timeOptions overlap
		var overlap = false;
		var earlierEnd = this.dateTimeToDate(null, earlier).getTime() + (earlier.duration * this.MINUTE);
		if(earlierEnd > this.dateTimeToDate(null, later).getTime()){
			overlap = true;
		}
		//Check if timeOptions are adjacent and can be merged
		var merged = false;
		var adjacent = earlierEnd === this.dateTimeToDate(null, later).getTime();
		var samePriority = earlier.isPriority === later.isPriority;
		//Merge two slots by joining them end-to-end
		if(samePriority && adjacent){
			merged = _.clone(earlier);
			merged.duration = merged.duration + later.duration;
		}
		//Merge two overlapping slots by joining the unique part of the latter to the former
		if(samePriority && overlap){
			var overlapSize = (earlierEnd - this.dateTimeToDate(null, later).getTime()) / this.MINUTE;
			var addFromLater = later.duration - overlapSize;
			merged = _.clone(earlier);
			merged.duration += addFromLater;
		}
		//TODO Case: Slots that overlap, but have different priority levels.
		//Need to remove lower priority slots and merge them to high priority timeOption
		//Check if one timeOption is inside the other
		var inside = false; //denotes that the later timeOption is inside the earlier one
		if(overlap){
			//earlierEnd is within scope
			var laterEnd = this.dateTimeToDate(null, later).getTime() + (later.duration * this.MINUTE);
			var sameEnd = (earlierEnd === laterEnd);
			if(sameTime || sameEnd){
				inside = true;
			}
			else if(laterEnd < earlierEnd){
				inside = true;
			}
		}
		var information = {
			earlier: earlier,
			later: later,
			sameTime: sameTime,
			samePriority: samePriority,
			overlap: overlap,
			adjacent: adjacent,
			inside: inside,
			merged: merged
		}
		//console.log(information);
		return information;
	},

	/*
	 * Returns two lists that show which timeOptions are in/out of range of a particular option. Being in range means that the durations of two timeOptions overlap or are adjacent and are in need of splitting/merging.
	 * @Param timeOptions: array of timeOptions to check
	 * @Param option: timeOption to check relative to
	 * @Return: JSON with array of timeOptions in/out of range
	 */
	getTimeOptionsInRange: function(timeOptions, option){
		var inRange = [];
		var outRange = [];
		timeOptions.forEach(timeOption => {
			var pair = this.analyzeTimeOptions(timeOption, option);
			if(pair.adjacent || pair.overlap){
				inRange.push(timeOption);
			}
			else{
				outRange.push(timeOption);
			}
		});
		return {
			inRange: inRange,
			outRange: outRange
		};
	},

	/*
	 * Recursive function that analyzes a new timeOption and then performs any necessary splits/merges on the rest of the list.
	 * @Param timeOptions: array of all timeOptions
	 * @Param option: new timeOption being introduced
	 * @Return newList: updated array of timeOptions
	 */
	checkIncomingTimeOption: function(timeOptions, option){
		var newList = [];
		var list = this.getTimeOptionsInRange(timeOptions, option);
		newList.push.apply(newList, list.outRange);
		var merged = false;
		list.inRange.forEach(timeOption => {
			if(!merged){
				var pair = this.analyzeTimeOptions(timeOption, option);
				if(pair.merged){
					merged = pair.merged;
				}
			}
			else{
				newList.push(timeOption);
			}
		});
		if(merged){
			newList = this.checkIncomingTimeOption(newList, merged);
		}
		else{
			newList.push(option);
		}
		return newList;
	},

	/*
	 * Creates a new timeOption.
	 * @Param epochTime: timestamp for timeSlot
	 * @Param numOfSlots: number of 15 minute timeSlots to be included in duration
	 * @Param isPriority: whether or not the timeOption is a priority option
	 * @Param dateList: array of timestamps representing dates the option applies to
	 * @Return option: newly-constructed timeOption
	 */
	constructTimeOption: function(epochTime, numOfSlots, isPriority = false, dateList){
		var optionDate = new Date(epochTime);
		var option = {
			dates: dateList,
			duration: (numOfSlots * 15),
			isPriority: isPriority,
			startHours: optionDate.getHours(),
			startMinutes: optionDate.getMinutes()
		}
		return option;
	},

	/*
	 * Splits a timeOption into before/after options as needed.
	 * @Param option: timeOption that needs to be split (bigger in duration)
	 * @Param split: timeOption that causes the split (smaller or equal in duration)
	 * @Return splitSlots: array of timeOptions resulting from the split
	 */
	splitTimeOption: function(option, split){
		var splitSlots = [];
		//Note that this process assumes that the option being split is bigger than or equal to the duration of the splitter
		//This process also assumes splits are only being made in intervals of 15 minutes
		var times = this.generateTimeList([option]);
		var beforeSlots = 0;
		var afterSlots = 0;
		var splitMade = false;
		var firstStartTime = false;
		var newStartTime = false;
		times.forEach(time => {
			if(splitMade){
				afterSlots++;
				if(!newStartTime){
					newStartTime = time.time;
				}
			}
			else if(time.time === split.time){
				splitMade = true;
			}
			else{
				beforeSlots++;
				if(!firstStartTime){
					firstStartTime = time.time;
				}
			}
			//console.log(`${time.time} vs ${split.time} (${beforeSlots}, ${afterSlots})`);
		});
		if(beforeSlots > 0){
			var beforeOption = this.constructTimeOption(
				firstStartTime,
				beforeSlots,
				option.isPriority,
				option.dates
			);
			splitSlots.push(beforeOption);
		}
		if(afterSlots > 0){
			var afterOption = this.constructTimeOption(
				newStartTime,
				afterSlots,
				option.isPriority,
				option.dates
			);
			splitSlots.push(afterOption);
		}
		return splitSlots;
	},

	/*
	 * Removes a timeOption and repairs list of options with any necessary splits.
	 * @Param timeOptions: list of timeOptions
	 * @Param option: timeOption to remove
	 * @Return newList: array of timeOptions resulting from any splits
	 */
	removeTimeOption: function(timeOptions, option){
		var newList = [];
		timeOptions.forEach(timeOption => {
			var pair = this.analyzeTimeOptions(timeOption, option);
			if(pair.inside){
				var splitOptions = this.splitTimeOption(timeOption, option);
				newList.push.apply(newList, splitOptions);
			}
			else{
				newList.push(timeOption);
			}
		});
		return newList;
	},

	/*
	 * Adds a new date option to all timeOptions
	 * @Param timeOptions: list of timeOptions
	 * @Param date: timestamp of date to add
	 * @Return timeOptions: new array of timeOptions
	 */
	addDateOption: function(timeOptions, date){
		timeOptions.forEach(option => {
			option.dates.push(date);
			option.dates.sort();
		});
		return timeOptions;
	},

	/*
	 * Removes a date option from all timeOptions
	 * @Param timeOptions: list of timeOptions
	 * @Param date: timestamp of date to remove
	 * @Return timeOptions: new array of timeOptions
	 */
	removeDateOption: function(timeOptions, date){
		var date = parseInt(date);
		timeOptions.forEach(option => {
			var dateIndex = option.dates.indexOf(date);
			if(dateIndex > -1){
				option.dates.splice(dateIndex, 1);
			}
		});
		return timeOptions;
	}

}