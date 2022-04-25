module.exports = {
    name: ['ratemyfarts'],
    execute: async function (msg) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        msg.channel.send('Let\'s see...').catch(() => { })
        var fartRating = Math.floor(Math.random() * 100) + 1
        if (!poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id] = {}
        }
        if (!poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['fartRate']) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['fartRate'] = fartRating;
        }
        if (!poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['lastFartRate']) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['lastFartRate'] = Date.now();
        }
        var lastFartRating = Date.now() - poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['lastFartRate']
        if (lastFartRating >= 600000) {
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['fartRate'] = fartRating;
            poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['lastFartRate'] = Date.now();
        }
        if (poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['fartRate'] >= 70) {
            msg.channel.send('**' + poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['fartRate'] + '**/100, great farts!').catch(() => { })
        }
        else {
            msg.channel.send('**' + poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['fartRate'] + '**/100').catch(() => { })
        }
        msg.channel.sendTyping().catch(() => { })
    },
    help: { name: 'ratemyfarts', value: 'Poopy rates your farts.' },
    cooldown: 2500,
    type: 'OG'
}