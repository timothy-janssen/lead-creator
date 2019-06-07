var request = require('request-promise');
var config = require('./config');

var options = {
    uri:    config.BASE_URL + "/sap/c4c/odata/v1/c4codataapi/",
    method:  "GET",
    json:    true,
    transform2xxOnly: true,
    transform: function(body, response, resolveWithFullResponse) {
  		return {'token': response.headers['x-csrf-token'], 'cookie': response.headers["set-cookie"], 'data': body};
	},
    headers: {       
         "X-CSRF-Token":  "Fetch",
         "Authorization": config.C4_API_AUTH,
         "Content-Type":  "application/json"
    }
};

exports.getToken = function(potential_cookie, potential_token)  {
  if (potential_cookie && potential_token) {
    console.log("already have a token");
    return resolve({"cookie": potential_cookie, "token": potential_token});
  } else {
    return new Promise((resolve, reject) => {
      request(options)
      .then( data => { resolve(data); } )
      .catch( data => { reject(data); } );
    });
  }
}