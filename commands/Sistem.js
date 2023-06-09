const { Client, EmbedBuilder, PermissionsBitField, embedLength, italic } = require("discord.js");
const db = require("quick.db");

module.exports = {
    name: "davet-sistemi",
    description: "Davet Sistemini Ayarla!",
    type: 1,
    options: [
        {
            name: "kanal",
            description: "Davet Mesajlarının İletileceği Kanal",
            type: 7,
            required: true,
            channel_types: [0]
        },
        {
            name: "görünüm",
            description: "Mesaj Görünümünü Ayarla!",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Embed Mesaj",
                    value: "embed"
                },
                {
                    name: "Normal Mesaj",
                    value: "normal"
                }
            ]
        }
    ],

    run: async(client, interaction) => {
        const izinGerekli = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`**Yönetici** Yetkisine Sahip Olman Gerekli!`)
        
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            interaction.message.react("❌");
            interaction.reply({ embeds: [izinGerekli], ephemeral: true });
            return;
        }

        const kanal = interaction.options.getChannel("kanal");
        const input = interaction.options.getString("görünüm");

        if(input === "embed") {
            const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setAuthor({ name: `${interaction.user.username} Tarafından`, iconURL: interaction.user.avatarURL() })
            .setDescription(`> Davet Kanalı Başarıyla Ayarlandı! \n\n __Kanal:__ ${kanal} \n __Tip:__ \`${input}\``)
            .setThumbnail(interaction.user.avatarURL())

            db.set(`davetKanal_${interaction.guild.id}`, { kanal: kanal.id, message: input })
            return interaction.reply({ embeds: [embed] });
        }

        if(input === "normal") {
            const embed = new EmbedBuilder()
            .setColor("DarkGreen")
            .setAuthor({ name: `${interaction.user.username} Tarafından`, iconURL: interaction.user.avatarURL() })
            .setDescription(`> Davet Kanalı Başarıyla Ayarlandı! \n\n __Kanal:__ ${kanal} \n __Tip:__ \`${input}\``)
            .setThumbnail(interaction.user.avatarURL())
            
            db.set(`davetKanal_${interaction.guild.id}`, { kanal: kanal.id, message: input })
            return interaction.reply({ embeds: [embed] });
        }

    }

}