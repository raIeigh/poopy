module.exports = {
    name: ['avatar', 'av', 'pfp'],
    args: [{"name":"user","required":false,"specifarg":false}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            var avatar = new poopy.modules.Discord.MessageAttachment(msg.author.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }));
            await msg.channel.send({
                content: msg.author.username + '\'s avatar is:',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                },
                files: [avatar]
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        if (!msg.mentions.members.size) {
            async function getMember(id) {
                var member = await poopy.bot.users.fetch(id)
                    .catch(async () => {
                        await msg.channel.send({
                            content: 'Invalid user id: **' + id + '**',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                        await msg.channel.sendTyping().catch(() => { })
                        return
                    })

                if (member) {
                    var avatar = new poopy.modules.Discord.MessageAttachment(member.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }));
                    await msg.channel.send({
                        content: member.username + '\'s avatar is:',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        },
                        files: [avatar]
                    }).catch(() => { })
                }
            }

            await getMember(args[1]);
        } else {
            var mention = msg.mentions.members.first();
            var avatar = new poopy.modules.Discord.MessageAttachment(mention.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }));
            await msg.channel.send({
                content: mention.user.username + '\'s avatar is:',
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                },
                files: [avatar]
            }).catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'avatar/av/pfp [user]',
        value: "Replies with the user's avatar."
    },
    cooldown: 2500,
    type: 'Main'
}