module.exports = {
    desc: 'Returns a random compliment.', func: function () {
        let poopy = this

        var compliments = [
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
            'caring',
            'brilliant',
            'great',
            'happy',
            'funny'
        ]

        return compliments[Math.floor(Math.random() * compliments.length)]
    },
    array: [
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
        'caring',
        'brilliant',
        'great',
        'happy',
        'funny'
    ]
}