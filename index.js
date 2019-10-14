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
	var memory = req.body.conversation.memory;

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

			var lead_id = api_data.d.results.ID || '';
			card = [{type: 'text', content: 'Lead ' + lead_id + ' has been created'}];
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
	console.log('[GET] get-lead');

	//conversation memory
	var memory = req.body.conversation.memory;
	var nlp = req.body.nlp;
	var entities = nlp.entities;

	var potential_cookie = memory['cookie'];
	var potential_token = memory['token'];

	var sel_opts = decoder.getSelOpts(entities);

	csrf.getToken(potential_cookie, potential_token)
	.then( function(token_data){
		console.log('Received token: ' + token_data.token);
		api.call_api_get(token_data.token, token_data.cookie, sel_opts)
		.then( function(api_data){
			if(api_data){
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
			} else {
				res.json({
    			  replies: [
   					  {
   					    type: 'text',
   					    content: "Unable to find any leads",
   					  },{
   					    type: 'text',
   					    content: "Debugging info: this is likely because of a broken token",
   					  }
   					],
    			});
			}
		});
	})
	.catch( function(err){
		card = [{type: 'text', content: 'Backend call failed'}];
    	res.json({
    	  replies: card
    	});
	}); 
});

app.post('/save-lead-name', function (req, res) {
	console.log('[POST] save-lead-name');

	var memory = req.body.conversation;

	console.log(memory);
});

app.post('/auth', function (req, res) {
	console.log('[POST] auth');

	memory = {};

	csrf.getToken()
	.then( function(token_data){
		memory["token"] = token_data.token
    	memory["cookie"] = token_data.cookie

    	memory["cookie"] = memory["cookie"].join('')
		
		res.json({
    		conversation: {
    			memory: memory,
    			merge_memory: true
    		}
    	});
	})
});

app.get('/wake', function (req, res) {

	console.log('[GET] wake the app up')
	res.end();
});

app.get('/', function (req, res) {
	console.log('[GET] home')
	res.send(`
        <!doctype html>
        <html>

        <body background="background.png">
         <script src="https://cdn.cai.tools.sap/webchat/webchat.js"
            channelId="2f26542f-e158-4faf-8bb7-20df27fd752b"
            token="8181028f4d91e01775d2e44662c4471f"
            id="cai-webchat"
            ></script>
        </body>
        </html>
    `);
});

// Recast will send a post request to /errors to notify errors
app.post('/errors', (req, res) => {
   console.error('ERROR: ' + req.body);
   res.sendStatus(200); 

});

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`)); 