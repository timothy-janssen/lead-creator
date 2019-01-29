var express = require('express');

const bodyParser = require('body-parser');
const config = require('./config.js');
var csrf    = require('./get-csrf-token.js');
var api     = require('./api.js');
var decoder = require('./nlp.js')

var app = express();
app.use(bodyParser.json());

app.post('/create-lead', function (req, res) {
	console.log('[POST] create-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	var leadName = memory['lead-name'].value;
	console.log("Creating lead: " + leadName);

	csrf.getToken()
	.then( function(token_data){
		console.log('Received token: ' + token_data.token);
		api.call_api_post(token_data.token, token_data.cookie, leadName)
		.then(function(api_data){
			card = [{type: 'text', content: 'Your lead has been created'}];
    		res.json({
    		  replies: card
    		});
		});
	})
	.catch( function(err){
		console.log(err);
	});
});

app.post('/get-lead', function (req, res) {
	console.log('[POST] get-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	const nlp = req.body.nlp;
	const entities = nlp.entities;

	csrf.getToken()
	.then( function(token_data){
		console.log('Received token: ' + token_data.token);

		var sel_opts = decoder.getSelOpts(entities);

		api.call_api_get(token_data.token, token_data.cookie, sel_opts)
		.then(function(api_data){
			res.json({
    		  replies: [
   				  {
   				    type: 'text',
   				    content: "Here's what I found for you!",
   				  },{
   				  	type: 'list',
   				  	content: api_data,
    				buttons: []
   				  }
   				],
    		});
		});
	})
	.catch( function(err){
		console.log(err);
	}); 
});

// Recast will send a post request to /errors to notify errors
app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200); 

});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`)); 