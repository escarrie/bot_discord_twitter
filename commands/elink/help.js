const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "el-help",
  aliases: ["el-help"],
  description: "[Earlylink] help",

  execute: async (client, message, args) => {
    if (
      message.content == `${config.prefix}el-help` ||
      message.content == `${config.prefix}elink help` ||
      message.content == `${config.prefix}elink`
    ) {
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("List of all commands")
        .setURL("https://discord.js.org/")
        .setAuthor({
          name: "[BOT]  Slave",
          iconURL: "https://i.imgur.com/AfFp7pu.png", //
          url: "https://discord.js.org",
        })
        .setDescription("There is all commands who you can use on me")
        .addFields(
          { name: `${config.prefix}el-help`, value: "Show the help command" },
          { name: `${config.prefix}el-tregister`, value: "Register a twitter on current channel" },
          { name: `${config.prefix}el-tunregister`, value: "Unregister a twitter on current channel" },
        )

      return message.channel.send({
        embeds: [embed],
      });
    }
  },
};
