const { Client, Collection } = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const TwitterApi = require("twitter-api-v2");

console.log(`=====================`.bold.red)
console.log(`API TWITTER CONECTION`.bold.blue)
console.log(`=====================`.bold.red)
const twitterClient = new TwitterApi(`${config.twitter_token}`);

const client = new Client({
  intents: 32767, // All intents
  prefix: config.prefix,
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();

startProccess();

function startProccess() {
  require("./handler")(client);
}

client.login(config.token);
