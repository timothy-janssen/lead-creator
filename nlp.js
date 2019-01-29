
exports.getSelOpts = function (nlp_obj) {

	var search = "";
	var orderby = "";
	var format = "";
	var filter = "";
	var top = "";

	format = "&$format=json";

	var url = [search, orderby, format, filter, top];	
	console.log(url.join(''));

	var funcs = {
		sort: function(obj) { 
			url.orderby = "&$orderby=LastChangeDateTime" + obj.order;
		},
		number: function(obj) { 
			url.top = "&$top=" + obj.scalar;
			console.log(url.join(''));
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

	console.log(nlp_obj);

	Object.keys(nlp_obj).forEach( function(key) {
		var func = funcs[key] || funcs['default'];
		func(nlp_obj[key]);
		console.log(key + " : " + url.join(''))
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