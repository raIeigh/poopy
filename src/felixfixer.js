module.exports = function (poopy, ndata) {
    let poopy = this
    let data = poopy.data
    let globaldata = poopy.globaldata

    if ((ndata || data)['bot-data']) {
        data.botData = (ndata || data)['bot-data']
        delete (ndata || data)['bot-data']
    }
    if ((ndata || data)['user-data']) {
        data.userData = (ndata || data)['user-data']
        delete (ndata || data)['user-data']
    }
    if ((ndata || data)['guild-data']) {
        data.guildData = (ndata || data)['guild-data']
        delete (ndata || data)['guild-data']
    }

    function felix(ph) {
        return ph
            .replace(/commandurl\(/g, 'cmdoutput(')
            .replace(/fileraw\(/g, 'get(')
            .replace(/randomnumber\(/g, 'random(')
            .replace(/messagecollector\(/g, 'msgcollector(')
            .replace(/membermessage\(/g, 'membermsg(')
    }

    for (var cmd of globaldata.commandTemplates) {
        cmd.phrase = felix(cmd.phrase)
    }

    for (var g in data.guildData) {
        var guild = data.guildData[g]
        for (var cmd of guild.localcmds) {
            cmd.phrase = felix(cmd.phrase)
        }
    }
}