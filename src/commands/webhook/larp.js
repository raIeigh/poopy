module.exports = {
    name: ['larp'],
    args: [{
        name: "type",
        required: false,
        specifarg: false,
        orig: "[type]",
        autocomplete: function () {
            return [
                { name: "The Battle Bricks", value: "tbb" },
                { name: "The Battle Bricks (Friendlies)", value: "tbbfriendly" },
                { name: "The Battle Bricks (Enemies)", value: "tbbenemy" },
                { name: "Deltarune", value: "deltarune" }
            ]
        }
    }],
    execute: async function (msg, args, opts = {}) {
        let poopy = this
        let data = poopy.data
        let config = poopy.config
        let { DiscordTypes } = poopy.modules
        let { yesno } = poopy.functions

        if (!(
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageGuild) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageWebhooks) ||
            msg.channel.permissionsFor(msg.member).has(DiscordTypes.PermissionFlagsBits.ManageMessages) ||
            msg.member.permissions.has(DiscordTypes.PermissionFlagsBits.Administrator) ||
            msg.author.id === msg.guild.ownerId || config.ownerids.find(id => id == msg.author.id) ||
            opts.isBot
        )) {
            await msg.reply('You need to have the manage webhooks/messages permission to execute that!').catch(() => { })
            return
        }

        var channelData = data.guildData[msg.guild.id].channels[msg.channel.id]

        var larpHelp = "Available options are:\n"
            + "- **The Battle Bricks** (*Others: TBB Friendlies, TBB Enemies*)\n"
            + "- **Deltarune**"

        var larpValue = args.slice(1).join(" ").trim().toLowerCase()
        var larps = [
            {
                value: 1,
                match: /^(?:1|(?:tbb|the\s*battle\s*bricks?)\s*friendl(?:y|ies))$/i,
                message: "https://static.wikia.nocookie.net/the-battle-bricks/images/0/03/TBB_current_logo.png"
            },
            
            {
                value: 2,
                match: /^(?:2|(?:tbb|the\s*battle\s*bricks?)\s*enem(?:y|ies))$/i,
                message: "https://static.wikia.nocookie.net/the-battle-bricks/images/0/03/TBB_current_logo.png"
            },

            {
                value: 3,
                match: /^(?:3|tbb|the\s*battle\s*bricks?)$/i,
                message: "https://static.wikia.nocookie.net/the-battle-bricks/images/0/03/TBB_current_logo.png"
            },
            
            {
                value: 4,
                match: /^(?:4|deltarune)$/i,
                message: "https://cdn.discordapp.com/attachments/1415073653585875004/1537840000249626624/added_impact_frames_lmao.gif"
            }
        ]

        if (!larpValue && !channelData.battling) {
            await msg.reply("# Hey, hey, HEY!\nYou forgot about the larp type. " + larpHelp).catch(() => { })
            return
        }

        var findLarp = larpValue && larps.find(larp => larp.match.test(larpValue))
        if (larpValue && !findLarp) {
            await msg.reply("# Hey, hey, HEY!\nThat's not a valid larp type. " + larpHelp).catch(() => { })
            return
        }

        if (!data.userData[msg.author.id].dangerousExecuted.includes("larp") && !msg.nosend && !opts.isBot && !data.guildData[msg.guild.id].ignoreDangerous) {
            var confirm = await yesno(msg.channel, "# Are you sure?\n"
                + "okay, so there is a chance you might be executing this command because someone told you to do it "
                + "and you have no idea what it does, basically it'll turn everyone in the current channel into a webhook "
                + "of one of the chosen media's characters depending on the nickname they have, which might be a little disastrous "
                + "depending on how active this channel is...\n"
                + "-# (a server admin can disable these confirmation prompts for the current server entirely with `p:ignoredanger`)", msg.member, undefined, msg).catch(() => { })
            if (!confirm) return

            data.userData[msg.author.id].dangerousExecuted.push("larp")
        }

        if (!channelData.battling || (findLarp && findLarp.value != channelData.battling)) {
            channelData.battling = findLarp.value

            if (!msg.nosend) await msg.reply(findLarp.message).catch(() => { })
            return findLarp.message
        } else {
            channelData.battling = 0

            if (!msg.nosend) await msg.reply("# HEY!!!\nLarping time is over. No more larping.").catch(() => { })
            return "# HEY!!!\nLarping time is over. No more larping."
        }
    },
    help: {
        name: 'larp [type (tbb/tbbfriendly/tbbenemy/deltarune)] (manage webhooks/messages permission only)',
        value: "It's time to larp."
    },
    cooldown: 2500,
    perms: [
        'Administrator',
        'ManageMessages',
        'ManageWebhooks',
        'ManageGuild'
    ],
    type: 'Webhook'
}
