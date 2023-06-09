const { Client, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    description: "PONG!",
    type: 1,
    options: [],

    run: async(client, interaction) => {
        const embed = new EmbedBuilder()
        .setColor("DarkGold")
        .setDescription(`:speech_balloon:|Mesaj Ping **${client.ws.ping}**ms!`)
        interaction.reply({ embeds: [embed] });
    }
}