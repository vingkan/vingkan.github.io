function scrapeCellDate(cellID){
	var timestamp parseInt(cellID.replace('GroupTime', ''), 10);
	var date = new Date(timestamp * 1000);
	date.setUTCHours(date.getUTCHours() + 6)
	console.log(date)
}