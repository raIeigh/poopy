module.exports = {
    desc: 'Returns a random compliment.', func: async function () {
        let poopy = this

        var insults = [
            'awesome',
            'cool',
            'fantastic',
            'talented',
            'swag',
            'spectacular',
            'good',
            'nice',
            'intelligent',
            'lovely',
            'cute',
            'smart',
            'strong',
            'kind',
            'brave',
            'caring'
        ]

        return insults[Math.floor(Math.random() * insults.length)]
    }
}