function LogBase(base, arg){
	return Math.log(arg) / Math.log(base);
}

function countTotalCases(data){
	var count = 0;
	if(typeof data === 'number'){
		count = data;
	}
	else{
		for(var attr in data){
			if(typeof data[attr] === 'number'){
				count += data[attr];
			}
			else if(data[attr]){
				count += countTotalCases(data[attr]);
			}
		}
	}
	return count;
}

function getFrequency(data, attr){
	var occurences = countTotalCases(data[attr]);
	var total = countTotalCases(data);
	return occurences / total;
}

/*
 * Dubious function
 */
function sumOutcomes(data, empty){
	var sumSet = empty || {yes: 0, no: 0};
	for(var attr in data){
		if(data[attr]){
			for(var tag in data[attr]){
				sumSet[tag] += data[attr][tag];
			}
		}
	}
	return sumSet;
}

/*
 * API Points: data can be either a map or an array!
 * entropyOneAttr({y:5, n:9}) === entropyOneAttr([5, 9])
 */
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

function entropyTwoAttr(data){
	var sum = 0;
	for(var attr in data){
		if(data[attr]){
			var outcomes = data[attr];
			var freq = getFrequency(data, attr);
			var entropy = entropyOneAttr(outcomes);
			var partial = freq * entropy;
			sum += partial;
		}
	}
	return sum;
}

function getInformationGain(data, empty){
	var emptySet = empty || {yes: 0, no: 0};
	var outcomeSet = sumOutcomes(data, _.clone(emptySet)); //Dubious function
	var targetEntropy = entropyOneAttr(outcomeSet);
	var splitEntropy = entropyTwoAttr(data);
	var gain = targetEntropy - splitEntropy;
	return gain;
}

function getMatrixFromDataSet(dataSet, outcomeKey, empty){
	var emptySet = empty || {yes: 0, no: 0};
	var attributes = {};
	for(var i in dataSet){
		if(dataSet[i]){
			var sample = dataSet[i];
			var outcomeVal = sample[outcomeKey];
			for(var j in sample){
				if(sample[j] && j !== outcomeKey){
					if(!attributes[j]){
						attributes[j] = {};
					}
					var infoMap = attributes[j]
					var val = sample[j];
					if(infoMap[val]){
						infoMap[val][outcomeVal]++;
					}
					else{
						var newEmptySet = _.clone(emptySet);
						//console.log(newEmptySet)
						infoMap[val] = newEmptySet;
						infoMap[val][outcomeVal] = 1;
					}
				}
			}
		}
	}
	return attributes;
}

function topInformationGain(dataSet, outcomeKey, empty){
	var matrix = getMatrixFromDataSet(dataSet, outcomeKey, empty);
	var gainMap = {};
	var emptySet = empty || {yes: 0, no: 0};
	for(var info in matrix){
		if(matrix[info] && info !== outcomeKey){
			var gain = getInformationGain(matrix[info], emptySet);
			gainMap[info] = gain;
		}
	}
	var maxGain = {
		attr: 'NONE_DEFAULT',
		gain: 0
	}
	for(var info in gainMap){
		var gain = gainMap[info];
		if(gain > maxGain.gain){
			maxGain.attr = info;
			maxGain.gain = gain;
		}
	}
	return maxGain;
}

var Entropy = {
	countTotalCases: countTotalCases,
	getFrequency: getFrequency,
	entropyOneAttr: entropyOneAttr,
	entropyTwoAttr: entropyTwoAttr,
	getMatrixFromDataSet: getMatrixFromDataSet,
	chooseSplitPoint: topInformationGain
}

// Batman please forgive my ugly excuse for a module layout