module.exports = {
    helpf: '(sendFinishPhrase) (manage messages permission only)',
    desc: 'Stops all message collectors that are still active in the channel.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id) || isBot) {
            for (var uid in poopy.tempdata[msg.guild.id][msg.channel.id]) {
                if (poopy.tempdata[msg.guild.id][msg.channel.id][uid].messageCollector) {
                    poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector.stop(word ? 'time' : 'user')
                    delete poopy.tempdata[msg.guild.id][msg.channel.id][msg.author.id].messageCollector
                }
            }
        } else {
            return 'You need the manage messages permission to use this function.'
        }
    }
}