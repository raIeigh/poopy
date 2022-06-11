module.exports = {
    helpf: '(phrase) (manage messages only)',
    desc: 'Creates a new yes/no choice in the channel. Returns true if yes is chosen, blank otherwise. Has a cooldown.',
    func: async function (matches, msg, isBot) {
        let poopy = this

        var word = matches[1]

        if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return ''

        if (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 &&
                poopy.tempdata[msg.author.id]['cooler'] !== msg.id) {
                return `Calm down! Wait more ${(poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        poopy.tempdata[msg.author.id]['cooler'] = msg.id
        poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + 2500 / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) ? 5 : 1)

        if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/mod|dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id) || isBot) {
            var result = await poopy.functions.yesno(msg.channel, word, msg.member).catch(() => { })
            return result ? 'true' : ''
        } else {
            return 'You need to have the manage messages permission to execute that!'
        }
    },
    attemptvalue: 10
}