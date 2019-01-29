var express = require('express');

const bodyParser = require('body-parser');
const config = require('./config.js');
var csrf    = require('./get-csrf-token.js');
var api     = require('./api.js');

var app = express();
app.use(bodyParser.json());

app.post('/create-lead', function (req, res) {
	console.log('[POST] create-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	var leadName = memory['lead-name'].value;
	console.log("Creating lead: " + leadName);

	csrf.getToken()
	.then( function(data){
		var api_data = api.call_api_post(data.token, data.cookie, leadName);
	})
	.catch( fucntion(err){
		console.log(err);
	});

	card = [{type: 'text', content: 'Your lead has been created'}];
    res.json({
      replies: card
    });
})

// Recast will send a post request to /errors to notify errors
app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200); 

});

app.post('/get-lead', function (req, res) {
	console.log('[POST] get-lead');

	//conversation memory
	const memory = req.body.conversation.memory;
	const nlp = req.body.nlp;

	console.log(nlp.entities);

	csrf.getToken()
	.then( function(data){
		var api_data = api.call_api_get(data.token, data.cookie);

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
	.catch( fucntion(err){
		console.log(err);
	}); 
})

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`)); 