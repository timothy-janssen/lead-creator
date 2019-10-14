
exports.getSelOpts = function (nlp_obj) {

	console.log(nlp_obj);

	var url = { 'format'	: "&$format=json" , 
				'search' 	: "", 
				'orderby'	: "", 
				'filter'	: "", 
				'top'		: "&$top=6" // Let's default to the top 6 for now
	};

	var sign = '';

	var funcs = {
		sort: function(obj) { 
			url['orderby'] = "&$orderby=EndDate " + obj.order;
		},
		ordinal: function(obj) { 
			if(obj.rank > 0) {
				url['orderby'] = "&$orderby=EndDate asc"
			} else if(obj.rank < 0){
				url['orderby'] = "&$orderby=EndDate desc";
			}
		},
		number: function(obj) { 
			url['top'] = "&$top=" + obj.scalar;
		},
		organization: function(obj) { 
			url['filter'] = add_to_filter(url['filter'], "Company eq " + obj.raw);
		},
		datetime: function(obj) { 
			date = new Date(obj.iso);
			url['filter'] = add_to_filter(url['filter'], "EndDate%20" + sign + "%20(datetimeoffset'" + date.toISOString().split('.')[0] + "Z')");
		},
		money: function(obj) {
			url['filter'] = add_to_filter(url['filter'], "ExpectedRevenueAmount " + sign + "%20" + obj.amount);
		},
		default: function(obj) {
			//nada
		}
	};

	if(nlp_obj['filter']){
		sign = nlp_obj['filter'][0].sign || 'eq';
	} else {
		sign = 'eq';
	}
	

	Object.keys(nlp_obj).forEach( function(key) {
		var func = funcs[key] || funcs['default'];
		func(nlp_obj[key][0]);
	});

	var ret = "";

	Object.keys(url).forEach( function(key) { 
		ret += url[key];
	});

	ret = ret.replace(' ', '%20');

	return ret.replace( /^&/,''); //remove leading &
};

function add_to_filter(filter, str){
	if(filter === "") {
		filter = "&$filter=" + str;
	} else {
		filter = filter + " and" + str;
	}
	return filter;	
}