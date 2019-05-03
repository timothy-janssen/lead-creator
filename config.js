module.exports = {
   PORT: process.env.PORT,
   C4_API_AUTH: "Basic " + process.env.C4_API_AUTH, // base64 encoding of "<user>:<password>"
   BOT_TOKEN: process.env.BOT_TOKEN // Hex encoded token (from CAI settings)
};

//heroku config:set C4_API_AUTH="Basic VVNTQUxFU1JFUDAxOldlbGNvbWUx==" BOT_TOKEN='8181028f4d91e01775d2e44662c4471f' -a lead-creator 


