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

	var potential_cookie = memory['cookie'];
	var potential_token = memory['token'];

	var lead = {
		"lead_name": memory['lead-name'],
		"lead_amount": memory['lead-amount'],
		"lead_date": memory['lead-date']

	}
	console.log("Creating lead: " + lead.lead_name);

	csrf.getToken(potential_cookie, potential_token)
	.then( function(token_data){
		console.log('Received token: ' + token_data.token);
		api.call_api_post(token_data.token, token_data.cookie, lead)
		.then(function(api_data){
			card = [{type: 'text', content: 'Your lead has been created'}];
    		res.json({
    		  replies: card
    		});
		});
	})
	.catch( function(err){
		//console.log(err);
	});
});

/*
app.post('/create-lead', function (req, res) {
	console.log('[POST] create-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	const token = memory.token;
	const cookie = memory.cookie;

	var lead = {
		"lead_name": memory['lead-name'],
		"lead_amount": memory['lead-amount'],
		"lead_date": memory['lead-date']

	}

	console.log("Creating lead: " + lead.lead_name);

	api.call_api_post(token, cookie, lead)
	.then(function(api_data){
		card = [{type: 'text', content: 'Your lead has been created'}];
    	res.json({
    	  replies: card
    	});
	});
});
*/

app.post('/get-lead', function (req, res) {
	console.log('[GET] get-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	const nlp = req.body.nlp;
	const entities = nlp.entities;

	var potential_cookie = memory['cookie'];
	var potential_token = memory['token'];

	var sel_opts = decoder.getSelOpts(entities);

	csrf.getToken(potential_cookie, potential_token)
	.then( function(token_data){
		console.log('Received token: ' + token_data.token);
		api.call_api_get(token_data.token, token_data.cookie, sel_opts)
		.then( function(api_data){
			res.json({
    		  replies: [
   				  {
   				    type: 'text',
   				    content: "Here's what I found for you!",
   				  },{
   				  	type: 'list',
   				  	content: api_data || {},
    				buttons: []
   				  }
   				],
    		});
    		console.log(res);
		});
	})
	.catch( function(err){
		card = [{type: 'text', content: 'Backend call failed'}];
    	res.json({
    	  replies: card
    	});
	}); 
});

/*
app.post('/get-lead', function (req, res) {
	console.log('[POST] get-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	const nlp = req.body.nlp;
	const entities = nlp.entities;

	const token = memory.token;
	const cookie = memory.cookie;

	var sel_opts = decoder.getSelOpts(entities);

	api.call_api_get(token, cookie, sel_opts)
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
	})
	.catch(){
		card = [{type: 'text', content: 'Backend call failed'}];
    	res.json({
    	  replies: card
    	});
	};
});
*/

app.post('/save-lead-name', function (req, res) {
	console.log('[POST] save-lead-name');

	const memory = req.body.conversation;

	console.log(memory);


});

// Recast will send a post request to /errors to notify errors
app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200); 

});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`)); 