const { Client, EmbedBuilder, PermissionsBitField, embedLength, italic, Invite } = require("discord.js");
const db = require("quick.db");

module.exports = {
    name: "davetler",
    description: "Davet Sayısını Gösterir!",
    type: 1,
    options: [
        {
            name: "kullanıcı",
            description: "Bir Kullanıcı Seç!",
            type: 6,
            required: false
        },
    ],

    run: async(client, interaction) => {
        const kullanıcı = interaction.options.getUser("kullanıcı");

        if(!kullanıcı) {
            const davetler = db.get(`davetler_${interaction.user.id}_${interaction.guild.id}`) || "0";
            const silinenDavetler = db.get(`silinenDavetler_${interaction.user.id}_${interaction.guild.id}`) || "0";
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${interaction.user.username} Davet Verileri`, iconURL: interaction.user.avatarURL() })
            .setDescription(`> Davet Verileri;`)
            .addFields(
                { name: "Toplam Davet:", value: `\`\`\`${Number(davetler) + Number(silinenDavetler)}\`\`\``, inline: true },
                { name: "Gerçek Davetler:", value: `\`\`\`${davetler}\`\`\``, inline: true },
                { name: "Fake Davetler:", value: `\`\`\`${silinenDavetler}\`\`\``, inline: true }
            )

            return interaction.reply({ embeds: [embed] });
        } else {
            const davetler = db.get(`davetler_${kullanıcı.id}_${interaction.guild.id}`) || "0";
            const silinenDavetler = db.get(`silinenDavetler_${kullanıcı.id}_${interaction.guild.id}`) || "0";
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${interaction.user.username} Davet Verileri`, iconURL: interaction.user.avatarURL() })
            .setDescription(`> Davet Verileri;`)
            .addFields(
                { name: "Toplam Davet:", value: `\`\`\`${Number(davetler) + Number(silinenDavetler)}\`\`\``, inline: true },
                { name: "Gerçek Davetler:", value: `\`\`\`${davetler}\`\`\``, inline: true },
                { name: "Fake Davetler:", value: `\`\`\`${silinenDavetler}\`\`\``, inline: true }
            )
            .setFooter({ text: `${interaction.user.username} Tarafından Görüntüleniyor!`, iconURL: interaction.user.avatarURL() })
            return interaction.reply({ embeds: [embed] })
        }
    }
}