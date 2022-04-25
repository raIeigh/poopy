module.exports = {
    desc: 'Returns a random server emoji.', func: async function (msg) {
        let poopy = this

        var emojis = msg.guild.emojis.cache;
        var emojis2 = [];
        emojis.forEach(emoji => emojis2.push({ animated: emoji.animated, id: emoji.id, name: emoji.name }))
        var emoji = emojis2[Math.floor(Math.random() * emojis2.length)]
        return emoji ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : ''
    }
}