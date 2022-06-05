module.exports = {
    helpf: '(name | value)',
    desc: 'Declares a variable with the name and value specified. Variables can be used by typing in {variableName}.',
    func: function (matches, msg, _, string) {
        let poopy = this

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = poopy.functions.splitKeyFunc(word)
        var name = split[0] ?? ''
        name = poopy.functions.regexClean(name)
        var value = split.slice(1).length ? split.slice(1).join(' | ') : ''
        var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
        poopy.tempdata[msg.author.id]['declared'][`{${name}}`] = value.replace(new RegExp(`\\{${name}\\}`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`{${name}}`] || '')
        poopy.tempdata[msg.author.id]['keydeclared'][`{${name}}`] = {
            func: async () => {
                return value.replace(new RegExp(`\\{${name}\\}`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`{${name}}`] || '')
            }
        }
        return [phrase, true]
    },
    attemptvalue: 5
}