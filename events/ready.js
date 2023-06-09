const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Token } = require("../settings.json");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const moment = require("moment");

const client = new Client({
  intents: INTENTS,
  allowedMentions: {
    parse: ["users"]
  },
  partials: PARTIALS,
  retryLimit: 3
});

module.exports = async (client) => {

  const rest = new REST({ version: "10" }).setToken(Token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] | ${client.user.tag} Aktif!`);

  setInterval(async () => {

    const activities = ["SixieJS", "InviteBot"]
    const random = activities[
      Math.floor(Math.random() * activities.length)];
    client.user.setActivity(`${random}`)
  }, 16000);
};