const { Client } = require("twitter-api-sdk");
const fs = require("fs");

module.exports = {

  getApi: (token) => {
      return new Client(`${JSON.parse(fs.readFileSync('./config.json')).twitter_api}`);
  },
}