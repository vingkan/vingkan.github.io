var graffitiURL = "https://data.illinois.gov/resource/u4ca-yfeq.json"
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

var storage = new Storage();

function getGraffiti(id, query, limit, callback){
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: graffitiURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			console.log("Received graffiti data for [" + id + "]...");
			handleGraffitiData(id, data, callback);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleGraffitiData(id, data, callback){
	var newGraffiti = []
	for(var d = 0; d < data.length; d++){
		newGraffiti.push(new Graffiti(data[d]));
	}
	storage.add({
		'id': id,
		'data': newGraffiti
	});
	if(callback != null){
		callback();
	}
}

function getCount(id, tag, value){
	var query = {
		'$$app_token': appToken,
		'$select': 'count(' + tag + ')',
	}
	query[tag] = value;
	$.ajax({
		url: graffitiURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			console.log("Received count data for [" + id + "]...");
			var count = data[0]['count_' + tag];
			handleCountData(id, count);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleCountData(id, data){
	storage.add({
		'id': id,
		'data': data
	});
}