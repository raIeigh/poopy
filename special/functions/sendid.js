module.exports = {
    helpf: '(phrase)',
    desc: 'Sends a message to the channel. After being sent, it returns its ID. Has the default cooldown of course.',
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
        
        if (poopy.tempdata[msg.author.id][msg.id]['execCount'] >= 1 && poopy.data['guild-data'][msg.guild.id]['chaincommands'] == false && !(msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot)) return 'You can\'t chain commands in this server.'
        if (poopy.tempdata[msg.author.id][msg.id]['execCount'] >= poopy.config.commandLimit * ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)) return `Number of commands to run at the same time must be smaller or equal to **${poopy.config.commandLimit * ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)}**!`
        poopy.tempdata[msg.author.id][msg.id]['execCount']++
        
        poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (poopy.data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + 2500 / ((msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID) ? 5 : 1)

            var message = await msg.reply({
                content: word,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })

            if (message) {
                return message.id
            }

        return ''
    },
    attemptvalue: 10
}