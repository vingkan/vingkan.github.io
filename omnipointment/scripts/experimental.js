var GLOBAL_INTERVAL = 15;

/*renderTimeRanges('monday', [
	createTimeRangeArray({
		start: new Date(2015, 10, 21, 12),
		interval: GLOBAL_INTERVAL,
		length: 30,
		isPriority: true
	}),
	createTimeRangeArray({
		start: new Date(2015, 10, 21, 18),
		interval: GLOBAL_INTERVAL,
		length: 120,
		isPriority: false
	})
]);

renderTimeRanges('tuesday', [
	createTimeRangeArray({
		start: new Date(2015, 10, 22, 12),
		interval: GLOBAL_INTERVAL,
		length: 30,
		isPriority: false
	}),
	createTimeRangeArray({
		start: new Date(2015, 10, 22, 18),
		interval: GLOBAL_INTERVAL,
		length: 60,
		isPriority: true
	})
]);

renderTimeRanges('wednesday', [
	createTimeRangeArray({
		start: new Date(2015, 10, 22, 12),
		interval: GLOBAL_INTERVAL,
		length: 15,
		isPriority: false
	})
]);

renderTimeRanges('thursday', [
	createTimeRangeArray({
		start: new Date(2015, 10, 22, 12),
		interval: GLOBAL_INTERVAL,
		length: 30,
		isPriority: false
	}),
	createTimeRangeArray({
		start: new Date(2015, 10, 22, 18),
		interval: GLOBAL_INTERVAL,
		length: 75,
		isPriority: false
	}),
	createTimeRangeArray({
		start: new Date(2015, 10, 22, 19, 30),
		interval: GLOBAL_INTERVAL,
		length: 30,
		isPriority: true
	})
]);

//MASSIVE TABLE POPULATION

var dateSlot = ['m-slot', 't-slot', 'w-slot', 'r-slot', 'f-slot'];
var size = dateSlot.length;
for(var d = 0; d < size; d++){
	renderTimeRanges(dateSlot[d], [
		createTimeRangeArray({
			start: new Date(2015, 10, 23+d, 12),
			interval: GLOBAL_INTERVAL,
			length: 120,
			isPriority: false
		})
	]);
}*/

console.log('LOADED experimental.js');