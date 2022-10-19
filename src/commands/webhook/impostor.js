module.exports = {
    name: ['impostor',
        'imposter',
        'sus'],
    args: [{
        "name": "user",
        "required": false,
        "specifarg": false,
        "orig": "[user]",
        "autocomplete": function (interaction) {
            let poopy = this

            var memberData = poopy.data.guildData[interaction.guild.id]['members']
            var memberKeys = Object.keys(memberData).sort((a, b) => memberData[b].messages - memberData[a].messages)

            return memberKeys.map(id => {
                return {
                    name: memberData[id].username, value: id
                }
            })
        }
    }],
    execute: async function (msg, args) {
        let poopy = this
        let data = poopy.data
        let config = poopy.config

        args[1] = args[1] ?? ' '

        var member = msg.mentions.members.first() ??
            await msg.guild.members.fetch((args[1].match(/\d+/) ?? [args[1]])[0]).catch(() => {}) ??
            msg.member

        if (!member) {
            await msg.reply({
                content: `Invalid user id: **${args[1]}**`,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
            return
        }

        if (!data.guildData[msg.guild.id]['members'][member.id]['impostor']) {
            data.guildData[msg.guild.id]['members'][member.id]['impostor'] = false
        }

        if (data.guildData[msg.guild.id]['members'][member.id]['impostor'] === false) {
            if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageWebhooks') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
                data.guildData[msg.guild.id]['members'][member.id]['impostor'] = true
                await msg.reply({
                    content: member.user.username + ' is now the Impostor.',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    }
                }).catch(() => {})
            } else {
                await msg.reply('You need to have the manage webhooks/messages permission to execute that!').catch(() => {})
                return;
            };
        } else {
            data.guildData[msg.guild.id]['members'][member.id]['impostor'] = false
            await msg.reply({
                content: member.user.username + ' is not the Impostor.',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => {})
        }
    },
    help: {
        name: 'impostor/imposter/sus [user] (manage webhooks/messages permission only)',
        value: 'Trap someone in the impostor forcefully'
    },
    cooldown: 2500,
    perms: ['Administrator',
        'ManageMessages'],
    type: 'Webhook'
}