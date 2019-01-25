var request = require('request-promise');

var options = {
    uri:    "https://my341721.crm.ondemand.com/sap/c4c/odata/v1/c4codataapi/",
    method:  "GET",
    json:    true,
    transform2xxOnly: true,
    transform: function(body, response, resolveWithFullResponse) {
  		return {'token': response.headers['x-csrf-token'], 'cookie': response.headers["set-cookie"], 'data': body};
	},
    headers: {       
         "X-CSRF-Token":  "Fetch",
         "Authorization": "Basic YWRtaW5pc3RyYXRpb24wMTpXZWxjb21lNQ==", // base64 encoding of administration01:Welcome5
         "Content-Type":  "application/json"
    }
};

exports.getToken = function(onComplete)  {
	request(options)
    .then( function(data) {console.log('Received token: ' + data.token)})
	.then( function(data) {
		onComplete(data.token, data.cookie);
	});
}	