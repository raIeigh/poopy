module.exports = {
    helpf: '(arrayName | index | value)',
    desc: 'Sets the value in the array with that index to a new one.',
    func: async function (matches, msg) {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word, { args: 3 })
        var name = split[0] ?? ''
        var index = split[1] ?? '0'
        var newVal = split[2] ?? ''

        var array = poopy.tempdata[msg.author.id]['arrays'][name]
        if (!array) return ''

        array[index] = newVal

        return ''
    }
}