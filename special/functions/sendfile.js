module.exports = {
    helpf: '(url | name)',
    desc: 'Sends the file with that URL to the channel. Has the default cooldown of course.',
    func: async function (matches, msg, isBot) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var url = split[0]
        var name = split[1]
        
        if (!url || !(await poopy.modules.axios.get(url).catch(() => { }))) return word

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

        var fileinfo = await poopy.functions.validateFile(url, 'very true').catch(() => { })
        if (!fileinfo) return word
        var filepath = await poopy.functions.downloadFile(fileinfo.buffer, fileinfo.name, { buffer: true })
        await poopy.functions.sendFile(msg, filepath, fileinfo.name, { name: name || fileinfo.name })

        return ''
    },
    attemptvalue: 10,
    limit: 5
}