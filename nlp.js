
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
			console.log("sort " + url);
		},
		number: function(obj) { 
			url.top = "&$top=" + obj.scalar;
			console.log("number " + url);
		},
		organization: function(obj) { 
			url.filter = add_to_filter(filter, "Company eq " + obj.raw);
			console.log("organization " + url);
		},
		datetime: function(obj) { 
			url.filter = add_to_filter(filter, "CreationDateTime ge datetimeoffset'" + obj.iso + "'");
			console.log("datetime " + url);
		},
		default: function(obj) {
			//nada
		}
	}

	console.log(nlp_obj);

	Object.keys(nlp_obj).forEach( function(key) {
		var obj = nlp_obj[key];
		var func = funcs[key] || funcs['default'];
		console.log(func + " : " + 	obj);
		func(obj);
	});

	

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