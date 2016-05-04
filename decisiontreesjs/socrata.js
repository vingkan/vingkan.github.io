var URL = "https://data.cityofchicago.org/resource/ucdv-yd74.json";
var appToken = "Le00VXF0GK0d8D1tTn2v6Vkpl";

function getData(url, query, limit, cleaner, callback){
	query['$$app_token'] = appToken;
	query['$limit'] = limit;
	$.ajax({
		url: url,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			handleRequestData(cleaner, callback, data);
		},
		error: function(jqxhr, status, error){
			console.log("Critical Error. RIP.");
		}
	});
}

function handleRequestData(cleaner, callback, dataList){
	var cleanList = [];
	for(var d in dataList){
		if(dataList[d]){
			var a = cleaner(dataList[d])
			cleanList.push(a);
		}
	}
	callback(cleanList);
}