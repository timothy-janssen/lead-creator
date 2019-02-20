var request = require('request-promise');

exports.call_api_post = function(token, cookie, lead){

	var date = new Date(lead.lead_date.iso).toISOString();

	var amt_txt = lead.lead_amount.amount + "";

	var payload = { "Name": lead.lead_name,
					"AccountPartyID": "1001562",
					"OriginTypeCode": "003",
					"PriorityCode": "3",
					"UserStatusCode":"02",
					"DistributionChannelCode": "01",
					"DivisionCode": "00",
					"EndDate": date.split('.')[0],
					"ExpectedRevenueAmount": amt_txt,
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
	console.log(payload);
	var post_options = {
	    uri:    "https://my341721.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/LeadCollection",
	    method:  "POST",
	    json:    true,
	    body: payload,
	    headers: {      
	         "Authorization": "Basic YWRtaW5pc3RyYXRpb24wMTpXZWxjb21lNQ==", // base64 encoding of administration01:Welcome5
	         "Content-Type":  "application/json",
	         "x-csrf-token": token,
	         "cookie": cookie
	    }
	};

	return request(post_options)
	.then(console.log('[POST] Request completed'));
};
	
exports.call_api_get = function(token, cookie, sel_opts){

	var get_options = {
	    uri:    "https://my341721.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/LeadCollection?" + sel_opts,
	    method:  "GET",
	    json:    true,
	    headers: {      
	         "Authorization": "Basic YWRtaW5pc3RyYXRpb24wMTpXZWxjb21lNQ==", // base64 encoding of administration01:Welcome5
	         "Content-Type":  "application/json",
	         "x-csrf-token": token,
	         "cookie": cookie
	    }
	};

	console.log("[GET] " + get_options.uri);

	return request(get_options)
	.then(function (data){
		console.log('[GET] Request completed');
		return map_to_response(data.d.results); 
	})
	//.then();
};

map_to_response = function (data){
	var response = { "elements": [] };	

  	data.forEach( function(lead){
  		var value = '' + lead.ExpectedRevenueCurrencyCodeText + lead.ExpectedRevenueAmount;
  		var exp_close =  new Date(lead.EndDate);
  		response.elements.push({
        	"title": lead.Name,
        	"subtitle":  value + ' ' + exp_close,
    		"buttons": []
        });
  	});

	return response;
}

