module.exports = {
    name: ['ratemyfarts'],
    args: [],
    execute: async function (msg) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        await msg.reply('Let\'s see...').catch(() => { })
        var fartRating = Math.floor(Math.random() * 100) + 1
        if (!poopy.data['user-data'][msg.author.id]) {
            poopy.data['user-data'][msg.author.id] = {}
        }
        if (!poopy.data['user-data'][msg.author.id]['fartRate']) {
            poopy.data['user-data'][msg.author.id]['fartRate'] = fartRating;
        }
        if (!poopy.data['user-data'][msg.author.id]['lastFartRate']) {
            poopy.data['user-data'][msg.author.id]['lastFartRate'] = Date.now();
        }
        var lastFartRating = Date.now() - poopy.data['user-data'][msg.author.id]['lastFartRate']
        if (lastFartRating >= 600000) {
            poopy.data['user-data'][msg.author.id]['fartRate'] = fartRating;
            poopy.data['user-data'][msg.author.id]['lastFartRate'] = Date.now();
        }
        if (poopy.data['user-data'][msg.author.id]['fartRate'] >= 70) {
            await msg.reply('**' + poopy.data['user-data'][msg.author.id]['fartRate'] + '**/100, great farts!').catch(() => { })
        }
        else {
            await msg.reply('**' + poopy.data['user-data'][msg.author.id]['fartRate'] + '**/100').catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: { name: 'ratemyfarts', value: 'Poopy rates your farts.' },
    cooldown: 2500,
    type: 'OG'
}