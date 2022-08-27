module.exports = {
    helpf: '(sendFinishPhrase) (manage messages permission only)',
    desc: 'Stops all message collectors that are still active in the channel.',
    func: function (matches, msg, isBot) {
        let poopy = this
        let config = poopy.config
        let tempdata = poopy.tempdata

        var word = matches[1]

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id) || isBot) {
            for (var uid in tempdata[msg.guild.id][msg.channel.id]) {
                var userdata = tempdata[msg.guild.id][msg.channel.id][uid]
                if (userdata.messageCollector && userdata.messageCollector.stop) {
                    userdata.messageCollector.stop(word ? 'time' : 'user')
                    delete tempdata[msg.guild.id][msg.channel.id][uid].messageCollector
                }
            }
        } else {
            return 'You need the manage messages permission to use this function.'
        }

        return ''
    }
}