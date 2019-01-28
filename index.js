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

	csrf.getToken(api.call_api_post, leadName);

	card = [{type: 'text', content: 'Your lead has been created'}];
    return res.json({
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

	console.log(memory);
	
	csrf.getToken(api.call_api_get, {});
})

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`)); 