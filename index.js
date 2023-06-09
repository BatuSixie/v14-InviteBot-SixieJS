const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent, Collection, Invite } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
global.client = client;
client.commands = (global.commands = []);
const { readdirSync } = require("fs");
const { Token } = require("./settings.json");
const moment = require("moment");
client.buttons = new Collection();
const db = require("quick.db");

readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: false,
        type: 1
    });

    console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] | [Komut] ${props.name} yüklendi.`)

});

    readdirSync("./events").forEach(e => {
        const eve = require(`./events/${e}`);
        const name = e.split(".")[0];
        client.on(name, (...args) => {
            eve(client, ...args)
        });
        console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] | [Event] ${name} yüklendi!`);
    })

const InvitesTracker = require("@androz2091/discord-invites-tracker");
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on("guildMemberAdd", (member, type, invite) => {
    const data = db.get(`davetKanal_${member.guild.id}`)
    if(!data) return;
    const Kanal = member.guild.channels.cache.get(data.Kanal);
    if(!Kanal) return db.delete(`davetKanal_${member.guild.id}`);
    const davetedilen = db.get(`inviteBilgi_${member.id}_${member.guild.id}`);
    if(davetedilen) {
        if(data.message === "embed") {
            const invEmbed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Giriş Yaptı!` })
            .setDescription(`Hoşgeldin ${member}! Daha Önce <@${davetedilen.inviterİd}> Tarafından Davet Edilmişsin! :tada: \n\n **discord.gg/${davetedilen.inviteCode}** Linkiyle Giriş Yapmıştın!`)
            .setFooter({ text: `${invite.inviter.username} Tarafından Davet Edildi!` })
            .setTimestamp()

            db.add(`davetler_${davetedilen.inviterİd}_${member.guild.id}`, 1);
            db.add(`silinenDavetler_${davetedilen.inviterİd}_${member.guild.id}`, -1);
            return Kanal.send({ embeds: [invEmbed] });
        } 

        if(data.message === "normal" && member.user.id === invite.inviter.id) {
            db.add(`davetler_${davetedilen.inviterİd}_${member.guild.id}`, 1);
            db.add(`silinenDavetler_${davetedilen.inviterİd}_${member.guild.id}`, -1);
            return Kanal.send({ content: `Hoşgeldin ${member}! Daha Önce <@${davetedilen.inviterİd}> Tarafından Davet Edilmişsin! :tada:`});
        }
    }

    if(type === "normal") {
        if(data.message === "embed" && member.user.id === invite.inviter.id) {
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Giriş Yaptı!` })
            .setDescription(`Hoşgeldin ${member}! Bilader Neden Kendi Davetinle Giriyosun? Bizi Uğraştırıyosun Burda. :tada: \n\n> **discord.gg/${invite.code}** Linkiyle Giriş Yaptı.`)
            .setFooter({ text: `Kendini Davet Etmiş.` })
            .setTimestamp()
            return Kanal.send({ embeds: [embed] });
        }

        if(data.message === "normal" && member.user.id === invite.inviter.id) {
            return Kanal.send({ content: `Hoşgeldin ${member}! Adam Kendini Davet Etmiş Hocam. :tada:` });
        }

        if(data.message === "embed") {
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Giriş Yaptı!` })
            .setDescription(`Hoşgeldin ${member}! **${invite.inviter.username}** Davet Etti! :tada: \n\n> **discord.gg/${invite.code}** Linkiyle Giriş Yaptı.`)
            .setFooter({ text: `${invite.inviter.username} Tarafından Davet Edildi!` })
            .setTimestamp()

            db.set(`inviteBilgi_${member.id}_${member.guild.id}`, { inviterİd: invite.inviter.id, inviteCode: invite.code })
            db.add(`davetler_${invite.inviter.id}_${member.guild.id}`, 1);
            return Kanal.send({ embeds: [embed] });
        }

        if(data.message === "normal") {
            db.set(`inviteBilgi_${member.id}_${member.guild.id}`, { inviterİd: invite.inviter.id, inviteCode: invite.code });
            db.add(`davetler_${invite.inviter.id}_${member.guild.id}`, 1);
            return Kanal.send({ content: `Hoşgeldin ${member}! **${invite.inviter.username}** Davet Etti! :tada:` });
        }
    }

    else if(type === "permissions") {
        if(data.message === "embed") {
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Giriş Yaptı!` })
            .setDescription(`Hoşgeldin ${member}! Yetkim Olmadığı İçin Nasıl Geldiğini Anlayamadım!`)
            .setFooter({ text: `Yetkim Yok, Bulamadım!` })
            .setTimestamp()
            return Kanal.send({ embeds: [embed] });
        }

        if(data.message === "normal") {
            return Kanal.send({ content: `Hoşgeldin ${member}! Yetkim Olmadığı İçin Nasıl Geldiğini Anlayamadım!` });
        }
    }

    else if(type === "unknown") {
        if(data.message === "embed") {
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Giriş Yaptı!` })
            .setDescription(`Hoşgeldin ${member}! Nasıl Geldiğini Bulamadım! Gökten Mi İndin??? :tada:`)
            .setFooter({ text: `Nasıl Geldi Bilmiyorum!` })
            .setTimestamp()
            return Kanal.send({ embeds: [embed] });
        }

        if(data.message === "normal") {
            return Kanal.send({ content: `Hoşgeldin ${member}! Nasıl Geldiğini Bulamadım! Gökten Mi İndin??? :tada:` });
        }
    }
});


client.on("guildMemberRemove", (member) => {
    const data = db.get(`davetKanal_${member.guild.id}`)
    if(!data) return;
    const Kanal = member.guild.channels.cache.get(data.Kanal);
    if(!Kanal) return db.delete(`davetKanal_${member.guild.id}`)
    const davetedilen = db.get(`inviteBilgi_${member.id}_${member.guild.id}`);
    if(davetedilen) {
        if(data.message === "embed") {
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Çıkış Yaptı!` })
            .setDescription(`Görüşürüz ${member}! <@${davetedilen.inviterİd}> Tarafından Davet Edilmişti! :neutral_face: \n\n> **discord.gg/${davetedilen.inviteCode}** Linkiyle Giriş Yapmıştı!`)
            .setFooter({ text: `Tüh Ya Keşke Gitmeseydi! ${member.guild.memberCount} Kişi Kaldık!` })
            .setTimestamp()

            db.add(`silinenDavetler_${davetedilen.inviterİd}_${member.guild.id}`, 1);
            db.add(`davetler_${davetedilen.inviterİd}_${member.guild.id}`, -1)
            return Kanal.send({ embeds: [embed] });
        }

        if(data.message === "normal" && member.user.id === invite.inviter.id) {
            db.add(`silinenDavetler_${davetedilen.inviterİd}_${member.guild.id}`, 1);
            db.add(`davetler_${davetedilen.inviterİd}_${member.guild.id}`, -1);
            return Kanal.send({ content: `Görüşürüz ${member}! <@${davetedilen.inviterİd}> Tarafından Davet Edilmişti! :neutral_face:` });
        }
    } else {
        if(data.message === "embed") {
            const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${member.user.username} Çıkış Yaptı!` })
            .setDescription(`Görüşürüz ${member}! Kim Davet Etti Bu Arkadaş Buraya Nasıl Geldi Bilmiyorum.... :neutral_face:`)
            .setFooter({ text: `Tüh Ya Keşke Gitmeseydi! ${member.guild.memberCount} Kişi Kaldık!` })
            .setTimestamp()
            return Kanal.send({ embeds: [embed] });
        }

        if(data.message === "normal" && member.user.id === invite.inviter.id) {
            return Kanal.send({ content: `Görüşürüz ${member}! Kim Davet Etti Bu Arkadaş Buraya Nasıl Geldi Bilmiyorum.... :neutral_face:` })
        };
    };
});


client.login(Token);