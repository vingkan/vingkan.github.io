var graffitiURL = "https://data.cityofchicago.org/resource/cdmx-wzbz.json"
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

var storage = new Storage();

function getGraffiti(query, limit, callback, id){
	var store = false;
	if(id){
		store = true;
	}
	var id = id || 'callback';
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: graffitiURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			console.log("Received graffiti data for [" + id + "]...");
			handleGraffitiData(callback, {
				id: id,
				data: data,
				store: store
			});
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleGraffitiData(callback, request){
	var newGraffiti = []
	for(var d = 0; d < request.data.length; d++){
		var g = Graffiti(request.data[d])
		if(!isNaN(g.lat()) && !isNaN(g.lon())){
			newGraffiti.push(g);
		}
	}
	if(request.store){
		storage.add({
			'id': request.id,
			'data': newGraffiti
		});
	}
	if(callback != null){
		callback(newGraffiti);
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