
exports.getSelOpts = function (nlp_obj) {

	var search, orderby, format, filter, top = "";

	format = "&$format=json";

	Object.keys(nlp_obj).forEach( function(key) {
		switch(key) {
			case sort:
				orderby = "&$orderby=LastChangeDateTime" + nlp_obj[key].order;
				break;
			case number:
				top = "&$top=" + nlp_obj[key].scalar;
				break;
			case organization:
				filter = add_to_filter(filter, "Company eq " + nlp_obj[key].raw);
				break;
			case location:

				break;
			case datetime:
				filter = add_to_filter(filter, "CreationDateTime ge datetimeoffset'" + nlp_obj[key].iso + "'");
				break;
			default:
			// nada
		}
	})

	return format + search + orderby + filter + top;
};

function add_to_filter(filter, str){
	if(filter === "") {
		filter = "&$filter=" + str;
	} else {
		filter = filter + " and" + str;
	}
	return filter;	
}