module.exports = {
    name: ['destroy', 'kill', 'shutdown'],
    execute: async function (msg) {
        let poopy = this

        var ownerid = poopy.config.ownerids.find(id => id == msg.author.id);
        if (ownerid === undefined) {
            msg.channel.send('Owner only!').catch(() => { })
            return
        } else {
            msg.channel.send('The salami lid')
                .then(() => {
                    poopy.bot.destroy()
                    process.exit()
                })
                .catch(() => { })
        };
    },
    help: { name: 'destroy/kill/shutdown', value: 'Causes Poopy to shutdown.' },
    type: 'Owner'
}