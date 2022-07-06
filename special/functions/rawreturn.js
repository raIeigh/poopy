module.exports = {
    helpf: '(phrase)',
    desc: "Ends the keyword collection and returns the phrase, except keywords and functions aren't executed (unless they were declared)",
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var declopts = { ...opts }
        declopts.declaredonly = true
        var word = await poopy.functions.getKeywordsFor(matches[1], msg, isBot, declopts).catch(() => { }) ?? ''

        poopy.tempdata[msg.author.id][msg.id]['return'] = word

        return ''
    },
    raw: true
}