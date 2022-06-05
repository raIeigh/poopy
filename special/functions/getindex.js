module.exports = {
    helpf: '(arrayName | index)',
    desc: 'Gets the value in the array with that index.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var name = split[0] ?? ''
        var index = split[1] ?? '0'

        var array = poopy.tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        return await poopy.functions.getKeywordsFor(array[index], msg, isBot, opts).catch(() => { }) ?? ''
    },
    attemptvalue: 5
}