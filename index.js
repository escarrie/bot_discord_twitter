const { Client, Collection } = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const { getApi } = require("./twitter.js");

const client = new Client({
  intents: 32767, // All intents
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();

startProccess();

function startProccess() {
  require("./handler")(client);
}

client.login(config.token);
