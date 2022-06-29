const colors = require("colors");
const config = require("../../config.json");

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
      if (!commandName.startsWith(prefix)) return;
      if (command) {
        message.delete().then(async () => {
          command.execute(client, message, args);
          console.log(
            `[COMMANDS] `.bold.red +
              `${prefix}${command.name}`.bold.blue +
              ` à été executée par ` +
              `${message.author.username}`.bold.blue +
              ` on server: ` +
              `${message.guildId}`.bold.blue +
              `.`
          );
        });
      }
    }
  },
};
