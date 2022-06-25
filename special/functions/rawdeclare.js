module.exports = {
    helpf: '(name | value)',
    desc: "Declares a variable with the name and value specified, but keywords and functions don't execute automatically. Variables can be used by typing in {variablename}.",
    func: async function (matches, msg, isBot, string, opts) {
        let poopy = this

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = poopy.functions.splitKeyFunc(word, { args: 2 })
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot, opts).catch(() => { }) ?? ''
        name = poopy.functions.regexClean(name)
        var value = split[1] ?? ''
        var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
        poopy.tempdata[msg.author.id]['declared'][`{${name}}`] = value.replace(new RegExp(`\\{${name}\\}`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`{${name}}`] || '')
        poopy.tempdata[msg.author.id]['keydeclared'][`{${name}}`] = {
            func: async function (_, msg, isBot, __, opts) {
                return await poopy.functions.getKeywordsFor(value.replace(new RegExp(`\\{${name}\\}`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`{${name}}`] || ''), msg, isBot, opts).catch(() => { }) ?? ''
            }
        }
        return [phrase, true]
    },
    raw: true,
    attemptvalue: 10
}