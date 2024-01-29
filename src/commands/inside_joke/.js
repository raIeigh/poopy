module.exports = {
    name: [''],
    args: [],
    execute: async function (msg) {
        if (!msg.nosend) await msg.reply("crimes").catch(() => { })
        return "crimes"
    },
    help: {
        name: '',
        value: 'crimes'
    },
    cooldown: 2500,
    type: 'Inside Joke'
}
