const colors = require("colors");

module.exports = {
  name: "ready",
  once: false,
  execute: async (client) => {
    console.log(
      `[API]`.bold.white +
        ` Connecté à :`.bold.green +
        ` ${client.user.tag}`.bold.white
    );
  },
};
