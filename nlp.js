
exports.getSelOpts = function (nlp_obj) {

	var url = { 'format'	: "&$format=json" , 
				'search' 	: "", 
				'orderby'	: "", 
				'filter'	: "", 
				'top'		: "&$top=6" // Let's default to the top 6 for now
	};

	var sign = 'eq';

	var funcs = {
		sort: function(obj) { 
			url['orderby'] = "&$orderby=LastChangeDateTime " + obj.order;
		},
		ordinal: function(obj) { 
			if(obj.rank > 0) {
				url['orderby'] = "&$orderby=LastChangeDateTime asc"
			} else if(obj.rank < 0){
				url['orderby'] = "&$orderby=LastChangeDateTime desc";
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
			url['filter'] = add_to_filter(url['filter'], "CreationDateTime ge datetimeoffset'" + date.toISOString() + "'");
		},
		money: function(obj) {
			url['filter'] = add_to_filter(url['filter'], "CreationDateTime ge datetimeoffset'" + date.toISOString() + "'");
		},
		default: function(obj) {
			//nada
		}
	};

	sign = nlp_obj['filter'].sign || sign;

	Object.keys(nlp_obj).forEach( function(key) {
		var func = funcs[key] || funcs['default'];
		func(nlp_obj[key][0]);
	});

	var ret = "";

	Object.keys(url).forEach( function(key) { 
		ret += url[key];
	});

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