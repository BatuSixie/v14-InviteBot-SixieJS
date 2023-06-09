const { Client, EmbedBuilder, PermissionsBitField, embedLength, italic, Invite } = require("discord.js");
const db = require("quick.db");

module.exports = {
    name: "davet-sıfırla",
    description: "Davet Sistemi Sıfırlanır!!!",
    type: 1,
    options: [],

    run: async(client, interaction) => {
        const izinGerekli = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`**Yönetici** Yetkisine Sahip Olman Gerekli!`)
        
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            interaction.message.react("❌");
            interaction.reply({ embeds: [izinGerekli], ephemeral: true });
            return;
        }

        const yok = new EmbedBuilder()
        .setColor("DarkRed")
        .setDescription(`Davet Sistemi Zaten Sıfırlanmış!`)

        if(!db.get(`davetKanal_${interaction.guild.id}`)) return interaction.reply({ embeds: yok, ephemeral: true });

        const silindi = new EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: `${interaction.user.username} Tarafından`, iconURL: interaction.user.avatarURL() })
        .setDescription(`> Davet Sistemi Sıfırlandı!`)
        .setThumbnail(interaction.user.avatarURL())

        db.delete(`davetKanal_${interaction.guild.id}`);
        return interaction.reply({ embeds: [silindi] });

    }

}