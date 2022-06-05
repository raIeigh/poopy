module.exports = {
    helpf: '(name | function<_val>)',
    desc: 'Declares a function with the name and function specified. Functions can be used by typing in [functionname].',
    func: async function (matches, msg, isBot, string, opts) {
        let poopy = this

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = poopy.functions.splitKeyFunc(word)
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        name = poopy.functions.regexClean(name)
        var value = split.slice(1).length ? split.slice(1).join(' | ') : ''
        var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
        poopy.tempdata[msg.author.id]['declared'][`[${name}]`] = value
        poopy.tempdata[msg.author.id]['funcdeclared'][`[${name}]`] = {
            func: async (matches) => {
                var word = matches[1]
                return await poopy.functions.getKeywordsFor(value.replace(new RegExp(`\\[${name}\\]\\(([\\s\\S]*?)\\)`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`[${name}]`] || '').replace(/_val/, word), msg, isBot, opts).catch(() => { }) ?? ''
            }
        }
        return [phrase, true]
    },
    raw: true,
    parentheses: true,
    attemptvalue: 5
}