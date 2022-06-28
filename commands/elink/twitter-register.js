const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");

const sqlite3 = require("sqlite3").verbose();
const { getApi } = require("./../../twitter.js");
const db = new sqlite3.Database("./guild.db");

module.exports = {
  name: "el-tregister",
  aliases: ["el-tregister"],
  description: "[Earlylink] help",

  execute: async (client, message, args) => {
    if (!args.length || (args.length == 1 && !args[0].startsWith("@"))) {
      return message.channel.send({
        content: `${message.author} please make sure to use the command like: ${config.prefix}el-tregister ${config.twitter}.`,
      });
    }
    console.log(message.content.startsWith(`${config.prefix}el-tunregister`));
    console.log(message.content);
    if (args.length == 1 && args[0].startsWith("@")) {
      const api = getApi(config.twitter_api);
      const twitter = await api.users.findUserByUsername(args[0].substring(1));
      if (twitter.errors) {
        return message.channel.send({
          content: `The twitter ${args[0]} not found, make sure it's the correct username.`,
        });
      }
      db.run(
        `CREATE TABLE if not exists 'tb_${message.guildId}' (id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, channel_id TEXT NOT NULL, twitter TEXT NOT NULL);`,
        function (err) {
          if (err) {
            return;
          }
          return;
        }
      );

      db.run(
        `SELECT id FROM tb_${message.guildId} WHERE key = '${
          message.channelId + "_" + args[args.length - 1]
        }';`,
        function (err, rows) {
          if (err)
            return message.channel.send({
              content: `Some trouble is passed, can you remake the command`,
            });
          if (rows == undefined) {
            db.run(
              `INSERT INTO tb_${
                message.guildId
              } (key, channel_id, twitter) VALUES ('${
                message.channelId + "_" + args[args.length - 1]
              }', '${message.channelId}', '${args[args.length - 1]}');`,
              function (err) {
                if (err)
                  return message.channel.send({
                    content: `The twitter ${
                      args[args.length - 1]
                    } already added to channel: ${message.channel}`,
                  });
              }
            );
            return message.channel.send({
              content: `The twitter ${
                args[args.length - 1]
              } added to channel: ${message.channel}`,
            });
          }
        }
      );
    }
  },
};
