const colors = require("colors");
const config = require("../../config.json");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./guild.db");

module.exports = {
  name: "messageCreate",
  once: true,
  execute: async (message, client) => {
    const prefix = config.prefix;

    awaitCommands();

    async function awaitCommands() {
      if (message.author.bot) return;
      if (!message.guild) return;

      const args = message.content.trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
      const command =
        client.commands.get(commandName.slice(prefix.length)) ||
        client.commands.find(
          (cmd) =>
            cmd.aliases &&
            cmd.aliases.includes(commandName.slice(prefix.length))
        );

      db.run(
        `CREATE TABLE if not exists guilds (id PRIMARY KEY, guild TEXT NOT NULL UNIQUE)`,
        function (err) {
          if (err) console.log(err);
        }
      );
      db.run(
        `INSERT INTO guilds (guild) VALUES('${message.guildId}')`,
        function (err) {
          if (err) console.log(err);
        }
      );
      if (!commandName.startsWith(prefix)) return;
      if (command) {
        message.delete().then(async () => {
          command.execute(client, message, args);
          console.log(
            `[COMMANDS] `.bold.red +
              `${prefix}${command.name}`.bold.blue +
              ` à été executée par ` +
              `${message.author.username}`.bold.blue +
              ` on server: `.bold.white +
              `${message.guildId}`.bold.blue +
              `.`.bold.white
          );
        });
      }
    }
  },
};
