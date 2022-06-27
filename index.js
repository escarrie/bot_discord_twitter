const { Client, Collection } = require("discord.js");
const colors = require("colors");
const config = require("./config.json");

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
