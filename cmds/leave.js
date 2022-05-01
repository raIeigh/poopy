module.exports = {
    name: ['leave'],
    execute: async function (msg) {
        let poopy = this

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
            var phrases = [
                'idiot',
                'the salt',
                'why do you hate me',
                'i could kill you',
                'are you mentally disabled',
                'ratio',
                'now',
                'the audacity',
                'you like boys',
                'bull',
                'fat plumber mario',
                'im crying',
                'poopoo demon summoned',
                'im out of ass',
                'the poopening has begun',
                'scrotum cancer alert',
                'stop',
                'chance of meatballs',
                'the poopy boss has spawned',
                `you had one shot ${(msg.member.nickname || msg.author.username).toLowerCase()}`,
                'this is my undertale',
                'i hate the antichrist',
                'not the minors',
                'i can cut your body',
                'things i shoved up my arse',
                'negro',
                'what is the true meaning of nr n',
                'brought oil',
                'father figure',
                '<https://pikmin3.nintendo.com/buy-now/>',
                `<@${msg.author.id}>`,
                'cum sock',
                'quesadilla',
                'pig',
                'youve missed the chance to try crab rice',
                'mug',
                ''
            ]
            var confirm = await poopy.functions.yesno(msg.channel, 'are you sure about this', msg.member).catch(() => { })

            if (confirm) {
                await msg.channel.send(phrases[Math.floor(Math.random() * phrases.length)]).catch(() => { })
                msg.guild.leave().catch(() => { })
            }
        } else {
            msg.channel.send('You need to be an admin to execute that!').catch(() => { })
            return
        }
    },
    help: { name: 'leave (admin only)', value: 'good' },
    perms: ['ADMINISTRATOR'],
    type: 'Annoying'
}