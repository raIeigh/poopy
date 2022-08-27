module.exports = {
    helpf: '(arrayName | function<_val>)',
    desc: 'Finds a value in the array that matches the function.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, getKeywordsFor, findAsync } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var name = await getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        return await findAsync(array, async (val) => {
            var valOpts = { ...opts }
            valOpts.extrakeys._val = {
                func: async () => {
                    return val
                }
            }

            var found = await getKeywordsFor(func, msg, isBot, valOpts).catch(() => { }) ?? ''

            return found
        }).catch(() => { }) ?? ''
    },
    attemptvalue: 5,
    raw: true
}