const config = require("../../config.json");
const { MessageEmbed } = require("discord.js");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./guild.db");

module.exports = {
  name: "el-tunregister",
  aliases: ["el-tunregister"],
  description: "[Earlylink] help",

  execute: async (client, message, args) => {
    if (!args.length || (args.length == 1 && !args[0].startsWith("@"))) {
      return message.channel.send({
        content: `${message.author} please make sure to use the command like: ${config.prefix}el-tunregister @Some-twitter-tag.`,
      });
    }
    if (args.length == 1 && args[0].startsWith("@")) {
      console.log(
        `[DATABASE] `.bold.red +
          `Create table if not exist ${message.guildId}`.bold.white
      );

      db.run(
        `CREATE TABLE if not exists 'tb_${message.guildId}' (id INTEGER PRIMARY KEY, key TEXT NOT NULL UNIQUE, channel_id TEXT NOT NULL, twitter TEXT NOT NULL);`,
        function (err) {
          if (err) {
            return console.log(
              `[DATABASE] `.bold.red + `Create table not executed`.bold.white
            );
          }
        }
      );

      db.run(
        `DELETE FROM tb_${message.guildId} WHERE key='${
          message.channelId + "_" + args[args.length - 1]
        }';`,
        function (err) {
          if (err) console.log(err);
          return message.channel.send({content: `The twitter ${args[args.length - 1]} unregsiter from channel ${message.channel}`})
        }
      );
    }
  },
};
