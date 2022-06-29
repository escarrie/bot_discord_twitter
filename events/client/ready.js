const colors = require("colors");
const config = require("../../config.json");
const { getApi } = require("./../../twitter.js");

module.exports = {
  name: "ready",
  once: false,
  execute: async (client) => {
    console.log(
      `[API]`.bold.white +
        ` Connecté à :`.bold.green +
        ` ${client.user.tag}`.bold.white
    );
    await client.guilds.cache.forEach(async (guild) => {
      console.log(
        `[API]`.bold.white +
          ` Connecté au serveur: `.bold.green +
          `${guild.name}`
      );

      console.log(`[API]`.bold.white + ` fetching roles.`.bold.green);
      const roles = await guild.roles.fetch();
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
            `${guild.name}`.bold.blue +
            `', creation upcomming.`.bold.green
        );

        await guild.roles.create({
          name: `${config.discord_role_mention}`,
          color: config.discord_role_color,
        });

        console.log(
          `[API]`.bold.white +
            ` roles  in server '`.bold.green +
            `${guild.name}`.bold.blue +
            `', created.`.bold.green
        );
      }

      const channels = await guild.channels.fetch();
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
            `${guild.name}`.bold.blue +
            `', creation upcoming.`.bold.green
        );

        await guild.channels.create(config.discord_channel_name, { 
            type: 'text', //Make sure the channel is a text channel
            permissionOverwrites: [{ //Set permission overwrites
                id: guild.id,
                allow: ['VIEW_CHANNEL'],
            }]

        })

        console.log(
          `[API]`.bold.white +
            ` channel in server '`.bold.green +
            `${guild.name}`.bold.blue +
            `', created.`.bold.green
        );
      }
    });

    client.user.setPresence({
      status: "online",
      activities: [
        {
          name: `Twitter ${config.twitter_username}`,
          type: "CUSTOM",
          url: `https://twitter.com/${config.twitter_username}`,
        },
      ],
    });
  },
};
