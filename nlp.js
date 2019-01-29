
exports.getSelOpts = function (nlp_obj) {

	var search = "";
	var orderby = "";
	var format = "";
	var filter = "";
	var top = "";
	
	url = [search, orderby, format, filter, top];

	format = "&$format=json";

	var funcs = {
		sort: function(obj) { 
			url.orderby = "&$orderby=LastChangeDateTime" + obj.order;
		},
		number: function(obj) { 
			url.top = "&$top=" + obj.scalar;
		},
		organization: function(obj) { 
			url.filter = add_to_filter(filter, "Company eq " + obj.raw);
		},
		datetime: function(obj) { 
			url.filter = add_to_filter(filter, "CreationDateTime ge datetimeoffset'" + obj.iso + "'");
		},
		default: function(obj) {
			//nada
		}
	}

	Object.keys(nlp_obj).forEach( function(key) {
		var obj = nlp_obj[key];
		(obj) => funcs[key];
	});

	console.log(url);

	return url.join('');
};

function add_to_filter(filter, str){
	if(filter === "") {
		filter = "&$filter=" + str;
	} else {
		filter = filter + " and" + str;
	}
	return filter;	
}