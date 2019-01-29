
exports.getSelOpts = function (nlp_obj) {

	format = "&$format=json";

	var url = { 'format'	: format , 
				'search' 	: "", 
				'orderby'	: "", 
				'filter'	: "", 
				'top'		: ""
	};

	var funcs = {
		sort: function(obj) { 
			url['orderby'] = "&$orderby=LastChangeDateTime" + obj.order;
		},
		number: function(obj) { 
			url['top'] = "&$top=" + obj.scalar;
		},
		organization: function(obj) { 
			url['filter'] = add_to_filter(url['filter'], "Company eq " + obj.raw);
		},
		datetime: function(obj) { 
			url['filter'] = add_to_filter(url['filter'], "CreationDateTime ge datetimeoffset'" + obj.iso + "'");
		},
		default: function(obj) {
			//nada
		}
	};

	Object.keys(nlp_obj).forEach( function(key) {
		var func = funcs[key] || funcs['default'];
		func(nlp_obj[key]);
	});

	var ret = "";

	console.log(url);
	url.forEach( function(key, value) { 
		ret += value.toString();
	});

	return ret;
};

function add_to_filter(filter, str){
	if(filter === "") {
		filter = "&$filter=" + str;
	} else {
		filter = filter + " and" + str;
	}
	return filter;	
}