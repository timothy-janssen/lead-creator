
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
		default: function(obj) {
			//nada
		}
	};

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


CreationDateTime%20gt%20datetimeoffset%27
2017-08-20T08:18:32.5957340Z     %27

2015-04-01T00:00:00Z

2019-01-28T22:42:26+00:00