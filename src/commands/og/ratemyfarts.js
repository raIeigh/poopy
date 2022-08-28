module.exports = {
    name: ['ratemyfarts'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let data = poopy.data

        await msg.channel.sendTyping().catch(() => { })
        await msg.reply('Let\'s see...').catch(() => { })
        var fartRating = Math.floor(Math.random() * 100) + 1
        if (!data['user-data'][msg.author.id]) {
            data['user-data'][msg.author.id] = {}
        }
        if (!data['user-data'][msg.author.id]['fartRate']) {
            data['user-data'][msg.author.id]['fartRate'] = fartRating;
        }
        if (!data['user-data'][msg.author.id]['lastFartRate']) {
            data['user-data'][msg.author.id]['lastFartRate'] = Date.now();
        }
        var lastFartRating = Date.now() - data['user-data'][msg.author.id]['lastFartRate']
        if (lastFartRating >= 600000) {
            data['user-data'][msg.author.id]['fartRate'] = fartRating;
            data['user-data'][msg.author.id]['lastFartRate'] = Date.now();
        }
        if (data['user-data'][msg.author.id]['fartRate'] >= 70) {
            await msg.reply('**' + data['user-data'][msg.author.id]['fartRate'] + '**/100, great farts!').catch(() => { })
        }
        else {
            await msg.reply('**' + data['user-data'][msg.author.id]['fartRate'] + '**/100').catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: { name: 'ratemyfarts', value: 'Poopy rates your farts.' },
    cooldown: 2500,
    type: 'OG'
}