module.exports = {
   PORT: process.env.PORT,
   C4_API_AUTH: "Basic " + process.env.C4_API_AUTH || "Your C4 API key", // base64 encoding of "<user>:<password>"
   BOT_TOKEN: process.env.BOT_TOKEN || "Your Bot token", // Hex encoded token (from CAI settings)
   BASE_URL: "https://my343473.crm.ondemand.com"
};




