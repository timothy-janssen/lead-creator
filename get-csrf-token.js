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
         //"Authorization": "Basic YWRtaW5pc3RyYXRpb24wMTpXZWxjb21lNQ==", // base64 encoding of administration01:Welcome5
         "Authorization": "Basic VVNTQUxFU1JFUDAxOldlbGNvbWUx==", // base64 encoding of USSALESREP01:Welcome1
         "Content-Type":  "application/json"
    }
};

exports.getToken = function(potential_cookie, potential_token)  {
  if (potential_cookie && potential_token) {
    return resolve({"cookie": potential_cookie, "token": potential_token});
  } else {
    return new Promise((resolve, reject) => {
      request(options)
      .then( data => { resolve(data); } )
      .catch( data => { reject(data); } );
    });
  }
}

/*
Username: USSALESREP01
Password: Welcome1
*/