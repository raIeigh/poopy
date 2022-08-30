let modules = {}
let activeBots = require('./dataValues').activeBots

modules.Discord = [require('discord.js'), require('discord.js-selfbot-v13')]
modules.REST = require('@discordjs/rest').REST
modules.Routes = require('discord-api-types/v10').Routes
modules.DiscordBuilders = require('@discordjs/builders')
modules.fs = require('fs-extra')
modules.nodefs = require('fs')
modules.archiver = require('archiver')
modules.fileType = require('file-type')
modules.axios = require('axios')
modules.request = require('request')
modules.FormData = require('form-data')
modules.cheerio = require('cheerio')
modules.xml2json = require('xml2js').parseStringPromise
modules.util = require('util')
modules.md5 = require('md5')
if (modules.fs.existsSync('node_modules/@jimp/plugin-print'))
    modules.fs.rmSync('node_modules/@jimp/plugin-print', {
        force: true, recursive: true
    })
if (!modules.fs.existsSync('node_modules/@jimp/plugin-print'))
    modules.fs.copySync('lib/plugin-print', 'node_modules/@jimp/plugin-print', {
        recursive: true
    })
modules.Jimp = require('jimp')
modules.whatwg = require('whatwg-url')
modules.catbox = require('catbox.moe')
modules.youtubedl = require('yt-dlp-exec')
modules.gis = require('g-i-s')
modules.mathjs = require('mathjs')
modules.prettyBytes = require('pretty-bytes')
modules.itob = require('istextorbinary')
modules.os = require('os')
modules.Collection = require('@discordjs/collection').Collection
modules.DMGuild = class DMGuild {
    constructor(msg) {
        let members = new Collection([[bot.user.id, bot.user]].concat(
            msg.channel.recipients ?
            [...msg.channel.recipients] :
            [[msg.channel.recipient.id, msg.channel.recipient]]
        ))

        this.ownerId = msg.channel.ownerId || msg.channel.recipient.id
        this.id = msg.channel.id
        this.name = msg.channel.name || `${(msg.user || msg.author).username}'s DMs`
        this.fetchAuditLogs = async () => {
            return {
                entries: new modules.Collection()
            }
        }
        this.emojis = {
            cache: new modules.Collection()
        }
        this.channels = {
            cache: new modules.Collection([[msg.channel.id, msg.channel]])
        }
        this.members = {
            fetch: async (id) => members.get(id),
            resolve: (id) => members.get(id),
            cache: members
        }
    }
}

for (var Discord of modules.Discord) {
    const Guild = Discord.Guild
    const guildLeave = Guild.prototype.leave

    Guild.prototype.leave = async function leave() {
        let guild = this
        let client = guild.client
        let poopy = activeBots[client.user.id]
        let config = poopy.config

        if (config.public) return 'nvm'

        return guildLeave.call(guild)
    }

    const Channel = Discord.BaseGuildTextChannel
    const channelSend = Channel.prototype.send

    Channel.prototype.send = async function send(payload) {
        var channel = this
        let client = channel.client
        let poopy = activeBots[client.user.id]
        let tempdata = poopy.tempdata
        let { waitMessageCooldown, setMessageCooldown } = poopy.functions

        await waitMessageCooldown()
        if (tempdata[channel.guild?.id]?.[channel.id]?.['shut']) return

        return channelSend.call(channel, payload).then(setMessageCooldown)
    }

    const Message = Discord.Message
    const messageReply = Message.prototype.reply

    Message.prototype.reply = async function reply(payload) {
        var message = this
        let client = message.client
        let poopy = activeBots[client.user.id]
        let config = poopy.config
        let tempdata = poopy.tempdata
        let { waitMessageCooldown, setMessageCooldown } = poopy.functions

        await waitMessageCooldown()
        if (tempdata[message.guild?.id]?.[message.channel?.id]?.['shut']) return

        if (config.allowbotusage || message.replied) return message.channel.send(payload).then(setMessageCooldown)
        else return message.replied = messageReply.call(message, payload).then(setMessageCooldown)
    }

    const Interaction = Discord.CommandInteraction
    const interactionReply = Interaction.prototype.reply

    Interaction.prototype.reply = async function reply(payload) {
        var interaction = this
        let client = interaction.client
        let poopy = activeBots[client.user.id]
        let config = poopy.config
        let tempdata = poopy.tempdata
        let { waitMessageCooldown, setMessageCooldown } = poopy.functions

        await waitMessageCooldown()
        if (tempdata[interaction.guild?.id]?.[interaction.channel?.id]?.['shut']) return

        if (config.allowbotusage || interaction.replied) return interaction.channel.send(payload).then(setMessageCooldown)
        else return (!interaction.replied && interaction.deferred ?
            interaction.editReply(payload) :
            interactionReply.call(interaction, payload)).then(setMessageCooldown)
    }
}

if (process.env.DEEPAI_KEY) {
    modules.deepai = require('deepai')
    modules.deepai.setApiKey(process.env.DEEPAI_KEY)
}

if (process.env.ROBLOX_COOKIE) {
    modules.noblox = require('noblox.js')
    modules.noblox.setCookie(process.env.ROBLOX_COOKIE).catch(() => { })
}

if (process.env.GOOGLE_KEY) modules.google = require('googleapis').google
//if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET && process.env.TWITTER_ACCESSTOKEN_KEY && process.env.TWITTER_ACCESSTOKEN_SECRET) modules.Twitter = require('twitter')

module.exports = modules