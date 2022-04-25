module.exports = {
    helpf: '(arrayName | function<_index|_val>)',
    desc: "For each value in that array, it'll execute the function.",
    func: async (matches, msg, isBot) => {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = poopy.tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        for (var index in array) {
            var val = array[index]
            await poopy.functions.getKeywordsFor(func, msg, isBot, {
                extrakeys: {
                    _index: {
                        func: async () => {
                            return index
                        }
                    },

                    _val: {
                        func: async () => {
                            return val
                        }
                    },
                }
            }).catch(() => { })
        }

        return ''
    },
    attemptvalue: 5,
    raw: true
}