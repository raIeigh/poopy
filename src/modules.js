let modules = {}

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
        this.ownerId = msg.channel.ownerId || (msg.user || msg.author).id
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
            fetch: async () => msg.channel.recipient ? (msg.channel.recipient.id == id && msg.channel.recipient) : msg.channel.recipients && msg.channel.recipients.get(id),
            resolve: (id) => msg.channel.recipient ? (msg.channel.recipient.id == id && msg.channel.recipient) : msg.channel.recipients && msg.channel.recipients.get(id),
            cache: new modules.Collection(msg.channel.recipients ? msg.channel.recipients.map(user => [user.id, user]) : [[msg.channel.recipient.id, msg.channel.recipient]])
        }
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