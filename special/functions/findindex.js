module.exports = {
    helpf: '(arrayName | function<_val>)',
    desc: 'Finds the key of the value in the array that matches the function.',
    func: async function (matches, msg, isBot) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = poopy.tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        return await poopy.functions.findIndexAsync(array, async (val) => {
            var found = await poopy.functions.getKeywordsFor(func, msg, isBot, {
                extrakeys: {
                    _val: {
                        func: async () => {
                            return val
                        }
                    },
                }
            }).catch(() => { }) ?? ''

            return found
        }).catch(() => { }) ?? ''
    },
    attemptvalue: 5,
    raw: true
}