function LogBase(base, arg){
	return Math.log(arg) / Math.log(base);
}

var GolfOneAttr = {
	yes: 9,
	no: 5
}

function countTotalCases(data){
	var count = 0;
	for(var attr in data){
		if(data[attr]){
			count += data[attr];
		}
	}
	return count;
}

function getFrequency(data, attr){
	var occurences = data[attr];
	var total = countTotalCases(data);
	return occurences / total;
}

function entropyOneAttr(data){
	var sum = 0;
	for(var attr in data){
		if(data[attr]){
			var freq = getFrequency(data, attr);
			var partial = (-1 * freq) * LogBase(2, freq);
			sum += partial;
		}
	}
	return sum;
}

var eGolfOne = entropyOneAttr(GolfOneAttr);
console.log('The entropy for one attribute is: ' + eGolfOne);