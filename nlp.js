
exports.getSelOpts = function (nlp_obj) {

	var search, orderby, format, filter, top = "";
	url = [search, orderby, format, filter, top];

	format = "&$format=json";

	var funcs = {
		sort: function(opts, obj) { 
			opts.orderby = "&$orderby=LastChangeDateTime" + obj.order;
			return opts;
		},
		number: function(opts, obj) { 
			opts.top = "&$top=" + nlp_obj[key].scalar;
			return opts;
		},
		organization: function(opts, obj) { 
			opts.filter = add_to_filter(filter, "Company eq " + nlp_obj[key].raw);
			return opts;
		},
		datetime: function(opts, obj) { 
			opts.filter = add_to_filter(filter, "CreationDateTime ge datetimeoffset'" + nlp_obj[key].iso + "'");
			return opts;
		},
		default: function(opts, obj) {
			return opts;
		}
	}

	Object.keys(nlp_obj).forEach( function(key) {
		url = (url, nlp_obj[key]) => funcs[key];
	})

	return url.join();
};

function add_to_filter(filter, str){
	if(filter === "") {
		filter = "&$filter=" + str;
	} else {
		filter = filter + " and" + str;
	}
	return filter;	
}