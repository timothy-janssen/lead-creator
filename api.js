var request = require('request-promise');

exports.call_api = function(token, cookie){
	var rand = ("0000" +  (Math.random() * 99999)).slice(-5);
	var payload = { "Name": "API TEST Lead TJ" + rand,
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

	request(post_options);
}