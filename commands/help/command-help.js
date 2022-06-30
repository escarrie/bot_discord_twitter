const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "thelp",
  aliases: ["thelp"],
  description: "Show all commands",

  execute: async (client, message, args) => {
    if (!message.content.includes(`${config.prefix}thelp`)) return;
    const embed = new MessageEmbed()
      .setColor(`${config.color_embed}`)
      .setTitle("List of all commands")
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: `${client.user.tag}`,
        iconURL: `${client.user.avatarURL({ dinamic: true })}`, //
        url: "https://discord.js.org",
      })
      .setDescription("There is all commands who you can use on me");

    client.commands.forEach((cmd) => {
      embed.addField(`${config.prefix}${cmd.name}`, `${cmd.description}`);
    });
    embed.addField("\u200b", "\u200b");
    embed.addField(`How to desable the bot`, `You can desable the Bot by removing the channel of tweet feed or deleting the bot`, true);


    return message.channel.send({
      embeds: [embed],
    });
  },
};
