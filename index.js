const { Client, Collection, MessageEmbed } = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const Meta = require("html-metadata-parser");
const { getApi } = require("./twitter.js");
const fs = require("fs");
const console = require("console");

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

client.login(config.token_discord);

setInterval(async () => {
    console.log("Check tweet");
    let t_api = getApi(config.twitter_api_token);
    const twitter = (
      await t_api.users.findUserByUsername(config.twitter_username, {
        "user.fields": [
          "id",
          "name",
          "username",
          "description",
          "profile_image_url",
          "url",
          "pinned_tweet_id",
          "public_metrics",
          "verified",
        ],
      })
    )?.data;

    let i = 0;
    let last_tweet = await t_api.tweets.usersIdTweets(twitter?.id, {
      max_results: 5,
      "place.fields": ["name"],
      "tweet.fields": [
        "author_id",
        "created_at",
        "attachments",
        "context_annotations",
        "conversation_id",
        "entities",
        "geo",
        "in_reply_to_user_id",
        "lang",
        "possibly_sensitive",
        "public_metrics",
        "referenced_tweets",
        "reply_settings",
        "withheld",
        "source",
      ],
      "media.fields": ["url"],
    });
    while (true) {
      let tmp = null;
      let is_last = false;
      last_tweet?.data.forEach((tweet) => {
        if (
          !(
            tweet.referenced_tweets &&
            tweet.referenced_tweets.length &&
            tweet.referenced_tweets[0].type === "replied_to"
          ) &&
          !tmp
        ) {
          tmp = tweet;
        }
        if (tweet === last_tweet[last_tweet.length - 1]) {
          is_last == true;
        }
      });
      if (tmp) {
        last_tweet = tmp;
        break;
      }
      if (is_last) {
        last_tweet = await t_api.tweets.usersIdTweets(twitter?.id, {
          max_results: 5,
          pagination_token: `${last_tweet.meta.next_token}`,
          "place.fields": ["name"],
          "tweet.fields": [
            "author_id",
            "created_at",
            "attachments",
            "context_annotations",
            "conversation_id",
            "entities",
            "geo",
            "in_reply_to_user_id",
            "lang",
            "possibly_sensitive",
            "public_metrics",
            "referenced_tweets",
            "reply_settings",
            "withheld",
            "source",
          ],
          "media.fields": ["url"],
        });
      }
    }

    const last_tweet_id = JSON.parse(fs.readFileSync("./tweet.json"));
    if (last_tweet_id.includes(last_tweet.id)) {
      console.log(`no more tweet`);
      return;
    }

    const regex_url = /https?:\/\/[^\s]+/g;
    const url_in_tweet = last_tweet.text.match(regex_url);

    const embed = new MessageEmbed()
      .setColor(`${config.color_embed}`)
      .setTitle(`New tweet from @${twitter.username}`)
      .setURL(`https://twitter.com/@${twitter.username}`)
      .setAuthor({
        name: `${twitter.username}`,
        iconURL: `${twitter.profile_image_url}`,
        url: `https://twitter.com/@${twitter.username}`,
      })
      .setDescription(`${last_tweet.text}`)
      .setTimestamp(last_tweet.created_at);
    if (url_in_tweet?.length > 0) {
      const meta_url = await Meta.parse(`${url_in_tweet[0]}`);
      if (meta_url?.og?.image) {
        embed.setImage(meta_url.og.image);
      }
      if (meta_url?.meta?.description) {
        embed.addField("\u200b", "\u200b");
        embed.addField("Link description:", meta_url.meta.description);
      }
    }

    client.guilds.cache.forEach(async (guild) => {
      let role_id;
      await (await guild.roles.fetch()).forEach(async (role) => {
        if (role.name === config.discord_role_mention) {
          role_id = role.id;
          return;
        }
      });

      await (await guild.channels.fetch()).forEach(async (channel) => {
        if (
          channel.type === "GUILD_TEXT" &&
          channel.name === `${config.discord_channel_name}`
        ) {
          await channel.send({ content: `<@&${role_id}>`, embeds: [embed] });
          console.log(
            `[API]`.bold.white +
              ` new post twitter posted on server '`.bold.green +
              `${guild.name}`.bold.blue +
              `'`.bold.green
          );
        }
      });
    });

    last_tweet_id.push(last_tweet.id);
    fs.writeFileSync("./tweet.json", JSON.stringify(last_tweet_id));
}, 1000 * 60);
