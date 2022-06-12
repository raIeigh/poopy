module.exports = {
    helpf: '(sendFinishPhrase) (manage messages permission only)',
    desc: 'Stops all message collectors that are still active in the channel.',
    func: function (matches, msg, isBot) {
        let poopy = this

        var word = matches[1]

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id) || isBot) {
            for (var uid in poopy.tempdata[msg.guild.id][msg.channel.id]) {
                var userdata = poopy.tempdata[msg.guild.id][msg.channel.id][uid]
                if (userdata.messageCollector && userdata.messageCollector.stop) {
                    userdata.messageCollector.stop(word ? 'time' : 'user')
                    delete poopy.tempdata[msg.guild.id][msg.channel.id][uid].messageCollector
                }
            }
        } else {
            return 'You need the manage messages permission to use this function.'
        }
    }
}