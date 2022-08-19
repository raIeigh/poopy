module.exports = {
    name: ['poop'],
    args: [],
    execute: async function (msg) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        await msg.reply({
            content: poopy.arrays.poopPhrases[Math.floor(Math.random() * poopy.arrays.poopPhrases.length)]
                .replace(/{fart}/, Math.floor(Math.random() * 291) + 10)
                .replace(/{seconds}/, Math.floor((Math.random() * 59) + 2))
                .replace(/{mention}/, `<@${msg.author.id}>`),
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })
        await msg.channel.sendTyping().catch(() => { })
    },
    help: { name: 'poop', value: 'Poopy says a random funny.' },
    type: 'OG'
}