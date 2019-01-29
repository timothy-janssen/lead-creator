var request = require('request-promise');

exports.call_api_post = function(token, cookie, leadName){
	var rand = ("0000" +  (Math.random() * 99999)).slice(-5);
	var payload = { "Name": leadName + " "  + rand,
					"AccountPartyID": "1001562",
					"OriginTypeCode": "003",
					"PriorityCode": "3",
					"UserStatusCode":"02",
					"DistributionChannelCode": "01",
					"DivisionCode": "00",
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

	request(post_options)
	.then(console.log('[POST] Request completed'));
};
	
exports.call_api_get = function(token, cookie){	
	var get_options = {
	    uri:    "https://my341721.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/LeadCollection?$search=%27API%27&$orderby=LastChangeDateTime%20desc&$format=json",
	    method:  "GET",
	    json:    true,
	    headers: {      
	         "Authorization": "Basic YWRtaW5pc3RyYXRpb24wMTpXZWxjb21lNQ==", // base64 encoding of administration01:Welcome5
	         "Content-Type":  "application/json",
	         "x-csrf-token": token,
	         "cookie": cookie
	    }
	};

	return request(get_options)
	.then(function (data){
		console.log('[GET] Request completed');
		console.log(JSON.stringify(data));
		return map_to_response(data); 
	})
	//.then();
};

map_to_response = function (data){
	var response = {
    	"type": "list",
    	"content": {
      		"elements": []
    	}
  	};	

  	data.map(function(lead){
  		var list_item = {
        	"title": "ELEM_1_TITLE",
        	"imageUrl": "IMAGE_URL",
        	"subtitle": "ELEM_1_SUBTITLE"
        };

        lead = list_item;
  	});

  	response.content.elements.push(...data);

	return response;
}

