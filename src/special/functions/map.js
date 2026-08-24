module.exports = {
    helpf: '(arrayName | function<_val|_index>)',
    desc: 'Maps the values of the array to new ones depending on the function.',
    func: async function (matches, msg, isBot, _, opts) {
        let poopy = this
        let { splitKeyFunc, parseKeywords, chunkArray } = poopy.functions
        let tempdata = poopy.tempdata

        var word = matches[1]
        var split = splitKeyFunc(word, { args: 2 })
        var name = await parseKeywords(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        var func = split[1] ?? ''

        var array = tempdata[msg.author.id][msg.id].arrays[name]
        if (!array) return ''

        var mapped = []
        var chunks = chunkArray(array, 50)
        
        for (var chunk of chunks) {
            var map = await Promise.all(chunk.map((val, index) => {
                var valOpts = { ...opts }
                valOpts.extraKeys = { ...valOpts.extraKeys }

                valOpts.extraKeys._val = {
                    func: async () => {
                        return val
                    }
                }
                valOpts.extraKeys._index = {
                    func: async () => {
                        return index
                    }
                }

                return parseKeywords(func, msg, isBot, valOpts).catch(() => '')
            })).catch(() => { }) ?? []

            mapped = mapped.concat(map)
        }

        tempdata[msg.author.id][msg.id].arrays[name] = mapped

        return ''
    },
    attemptvalue: 5,
    potential: {
        keys: { _val: {}, _index: {} }
    },
    raw: true
}
