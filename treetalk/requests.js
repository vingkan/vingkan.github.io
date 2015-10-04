function getTrees(id, query, limit, callback){
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: treeURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			console.log("Received tree data for [" + id + "]...");
			handleTreeData(id, data, callback);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleTreeData(id, data, callback){
	var newTrees = []
	for(var d = 0; d < data.length; d++){
		newTrees.push(new Tree(data[d]));
	}
	storage.add({
		'id': id,
		'data': newTrees
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
		url: treeURL,
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