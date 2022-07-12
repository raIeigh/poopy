module.exports = {
    helpf: '(arrayName | function<_index|_val>)',
    desc: "For each value in that array, it'll execute the function.",
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = poopy.tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        for (var index in array) {
            var val = array[index]
            var valOpts = { ...opts }
            valOpts.extrakeys._val = {
                func: async () => {
                    return val
                }
            }
            valOpts.extrakeys._index = {
                func: async () => {
                    return index
                }
            }

            await poopy.functions.getKeywordsFor(func, msg, isBot, valOpts).catch(() => { })
            await poopy.functions.sleep()
        }

        return ''
    },
    attemptvalue: 5,
    raw: true
}