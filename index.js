var express = require('express');

const bodyParser = require('body-parser');
const config = require('./config.js');
var csrf    = require('./get-csrf-token.js');
var api     = require('./api.js');

var app = express();

app.post('/create-lead', function (req, res) {
	console.log('[POST] create-lead');

	//conversation memory
	console.log(req);
	console.log(res);
	//const memory = req.body.conversation.memory;

	csrf.getToken(api.call_api);

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

app.get('/', function (req, res) {
	//csrf.getToken(api.call_api);
})

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`)); 