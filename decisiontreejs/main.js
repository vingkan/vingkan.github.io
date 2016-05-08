buildTreeFromData({
	title: 'Will the building pass inspection?',
	url: 'https://data.cityofchicago.org/resource/ucdv-yd74.json',
	size: 10000,
	outcome: 'inspection_status',
	success: 'CLOSED',
	failure: 'FAILED',
	attributes: ['inspection_status', 'inspection_category', 'department_bureau']
});

buildTreeFromData({
	title: 'Will the sanitation complaint be closed?',
	url: 'https://data.cityofchicago.org/resource/kcdz-f29q.json',
	size: 10000,
	outcome: 'status',
	success: 'Completed',
	failure: 'Open',
	attributes: ['ward', 'police_district', 'community_area']
});

buildTreeFromData({
	title: 'Will the micro-market recovery permit be approved?',
	url: 'https://data.cityofchicago.org/resource/w9hv-pqhu.json',
	size: 10000,
	outcome: 'permit_status',
	success: 'C',
	failure: 'X',
	attributes: ['permit_type_description', 'mmrp_zone', 'community_area', 'ward']
});