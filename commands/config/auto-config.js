const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "tconfig",
  aliases: ["tconfig"],
  description: "Auto config your server for me",

  execute: async (client, message, args) => {
    if (!message.content.includes(`${config.prefix}tconfig`)) return;

    const roles = await message.guild.roles.fetch();
    let roles_already_created = false;
    roles.forEach(async (role) => {
      if (role.name === config.discord_role_mention) {
        roles_already_created = true;
        return;
      }
    });
    if (!roles_already_created) {
      console.log(
        `[API]`.bold.white +
          ` roles not exist in server '`.bold.green +
          `${message.guild.name}`.bold.blue +
          `', creation upcomming.`.bold.green
      );

      await message.guild.roles.create({
        name: `${config.discord_role_mention}`,
        color: config.discord_role_color,
      });

      console.log(
        `[API]`.bold.white +
          ` roles  in server '`.bold.green +
          `${message.guild.name}`.bold.blue +
          `', created.`.bold.green
      );
      let role_id;
      await (
        await message.guild.roles.fetch()
      ).forEach(async (role) => {
        if (role.name === config.discord_role_mention) {
          role_id = role.id;
          return;
        }
      });

      message.channel.send({
        content: `The roles <@&${role_id}> as created by ${message.author}`,
      });
    } else {
      let role_id;
      await (
        await message.guild.roles.fetch()
      ).forEach(async (role) => {
        if (role.name === config.discord_role_mention) {
          role_id = role.id;
          return;
        }
      });

      message.channel.send({
        content: `The role <@&${role_id}> already exist in this server.`,
      });
    }

    const channels = await message.guild.channels.fetch();
    let channel_already_created = false;
    channels.forEach(async (channel) => {
      if (
        channel.type === "GUILD_TEXT" &&
        channel.name === `${config.discord_channel_name}`
      ) {
        channel_already_created = true;
        return;
      }
    });
    if (!channel_already_created) {
      console.log(
        `[API]`.bold.white +
          ` channels not exist in server '`.bold.green +
          `${message.guild.name}`.bold.blue +
          `', creation upcoming.`.bold.green
      );

      await message.guild.channels.create(config.discord_channel_name, {
        type: "text", //Make sure the channel is a text channel
        permissionOverwrites: [
          {
            //Set permission overwrites
            id: message.guild.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      });

      console.log(
        `[API]`.bold.white +
          ` channel in server '`.bold.green +
          `${message.guild.name}`.bold.blue +
          `', created.`.bold.green
      );
      let channel_id;
      await (
        await message.guild.channels.fetch()
      ).forEach(async (channel) => {
        if (channel.name === config.discord_channel_name) {
          channel_id = channel.id;
          return;
        }
      });

      message.channel.send({
        content: `The channel <#${channel_id}> was created by ${message.author}.`,
      });
    } else {
      let channel_id;
      await (
        await message.guild.channels.fetch()
      ).forEach(async (channel) => {
        if (channel.name === config.discord_channel_name) {
          channel_id = channel.id;
          return;
        }
      });
      message.channel.send({
        content: `The channel <#${channel_id}> was already created`,
      });
    }
  },
};
