var request = require('request-promise');
var config = require('./config');

exports.call_api_post = function(token, cookie, lead){

	var date = new Date(lead.lead_date.iso).toISOString();

	var payload = { "Name": lead.lead_name.raw,
					"AccountPartyID": "1001562",
					"OriginTypeCode": "003",
					"PriorityCode": "3",
					"UserStatusCode":"02",
					"DistributionChannelCode": "01",
					"DivisionCode": "00",
					"EndDate": date.split('.')[0],
					"ExpectedRevenueAmount": lead.lead_amount.amount + "",
					"ExpectedRevenueCurrencyCode": lead.lead_amount.currency,
					"LeadItem":[{
						 	"ProductID":"10000954",
						    "Quantity":"2",
						    "unitCode": "EA"
						},	{
							"ProductID":"10000954",
						    "Quantity":"2",
						    "unitCode": "EA"
						}
					]};

	var post_options = {
	    uri:    config.BASE_URL + "/sap/c4c/odata/v1/c4codataapi/LeadCollection",
	    method:  "POST",
	    json:    true,
	    body: payload,
	    headers: {      
	         "Authorization": config.C4_API_AUTH,
	         "Content-Type":  "application/json",
	         "x-csrf-token": token,
	         "cookie": cookie
	    }
	};

	return request.post(post_options)
	.then(console.log('[POST] Request completed'))
	.catch(function (err) {
		console.log(err);
	});
};
	
exports.call_api_get = function(token, cookie, sel_opts){

	var get_options = {
	    uri:    config.BASE_URL + "/sap/c4c/odata/v1/c4codataapi/LeadCollection?" + sel_opts,
	    method:  "GET",
	    json:    true,
	    headers: {      
	         "Authorization": config.C4_API_AUTH,
	         "Content-Type":  "application/json",
	         "x-csrf-token": token,
	         "cookie": cookie
	    }
	};

	console.log("[GET] " + get_options.headers["Authorization"]);
	console.log("[GET] " + get_options.headers["x-csrf-token"]);
	console.log("[GET] " + get_options.headers["cookie"]);

	return request.get(get_options)
	.then(function (data){
		console.log('[GET] Request completed');
		return map_to_response(data.d.results); 
	})
	.catch(function (err) {
		console.log("ERROR: " + err);
	});
};

map_to_response = function (data){
	var response = { "elements": [] };	

  	data.forEach( function(lead){

  		console.log(lead)

  		var value = '' + lead.ExpectedRevenueAmount + lead.ExpectedRevenueCurrencyCodeText;
  		var exp_close =  new Date(lead.EndDate);
  		response.elements.push({
        	"title": lead.Name,
        	"subtitle":  value + ' ' + exp_close,
    		"buttons": []
        });
  	});

  	console.log(response);

	return response;
}

