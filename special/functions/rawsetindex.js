module.exports = {
    helpf: '(arrayName | index | value)',
    desc: "Sets the value in the array with that index to a new one, except keywords and functions don't execute automatically.",
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 3 })
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var index = await poopy.functions.getKeywordsFor(split[1] ?? '0', msg, isBot, opts).catch(() => { }) ?? '0'
        var newVal = split[2] ?? ''

        var array = poopy.tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        array[index] = newVal

        return ''
    },
    raw: true
}